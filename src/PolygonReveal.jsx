import { useEffect, useRef } from 'react'

const ENABLED  = false          // set to true to activate the polygon reveal effect
const PHASES   = [10, 40, 140, 450, 1500, 5000]
const PHASE_MS = 190

export default function PolygonReveal({ src, alt, className }) {
  const imgRef    = useRef(null)
  const canvasRef = useRef(null)
  const timerRef  = useRef(null)
  const workerRef = useRef(null)

  useEffect(() => {
    if (!ENABLED) return
    let alive = true
    const img    = imgRef.current
    const canvas = canvasRef.current

    clearTimeout(timerRef.current)
    workerRef.current?.terminate()
    workerRef.current = null
    canvas.style.transition = 'none'
    canvas.style.opacity    = '1'
    img.style.transition    = 'none'
    img.style.opacity       = '0'

    function start() {
      if (!alive) return
      const W = img.naturalWidth
      const H = img.naturalHeight
      if (!W || !H) return

      // Read image pixels via offscreen canvas
      const off = document.createElement('canvas')
      off.width = W; off.height = H
      const offCtx = off.getContext('2d')
      offCtx.drawImage(img, 0, 0)
      const srcPixels = offCtx.getImageData(0, 0, W, H).data
      // Copy into a plain ArrayBuffer so it can be transferred to the worker
      const srcBuffer = new Uint8ClampedArray(srcPixels).buffer

      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')

      // Immediately cover the image with its average colour so nothing shows
      // through while the worker computes the first real frame
      let rS = 0, gS = 0, bS = 0
      const step = 8
      const count = Math.ceil(W * H / step)
      for (let i = 0; i < W * H; i += step) {
        const p = i * 4
        rS += srcPixels[p]; gS += srcPixels[p + 1]; bS += srcPixels[p + 2]
      }
      ctx.fillStyle = `rgb(${rS / count | 0},${gS / count | 0},${bS / count | 0})`
      ctx.fillRect(0, 0, W, H)

      // frames[i] is set when the worker sends phase i back
      const frames = new Array(PHASES.length).fill(null)
      let nextShow = 0

      function showFrame(idx) {
        if (!alive) return
        if (frames[idx] === null) {
          // Worker hasn't returned this frame yet — poll briefly
          timerRef.current = setTimeout(() => showFrame(idx), 25)
          return
        }
        ctx.putImageData(frames[idx], 0, 0)
        if (idx + 1 < PHASES.length) {
          timerRef.current = setTimeout(() => showFrame(idx + 1), PHASE_MS)
        } else {
          // Last frame displayed — fade out
          timerRef.current = setTimeout(() => {
            if (!alive) return
            // Cross-fade: canvas out, real image in simultaneously
            canvas.style.transition = 'opacity 0.45s ease'
            canvas.style.opacity    = '0'
            img.style.transition    = 'opacity 0.45s ease'
            img.style.opacity       = '1'
          }, PHASE_MS)
        }
      }

      const worker = new Worker(new URL('./voronoi.worker.js', import.meta.url))
      workerRef.current = worker

      worker.onmessage = ({ data: { buffer, phaseIdx } }) => {
        if (!alive) return
        frames[phaseIdx] = new ImageData(new Uint8ClampedArray(buffer), W, H)
        // Kick off display as soon as the first frame arrives
        if (phaseIdx === 0 && nextShow === 0) {
          nextShow = 1
          showFrame(0)
        }
      }

      worker.postMessage({ srcBuffer, W, H, phases: PHASES }, [srcBuffer])
    }

    if (img.complete && img.naturalWidth) {
      start()
    } else {
      img.addEventListener('load', start, { once: true })
    }

    return () => {
      alive = false
      clearTimeout(timerRef.current)
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [src])

  if (!ENABLED) return <img src={src} alt={alt} className={className} />

  return (
    <div style={{ position: 'relative', display: 'block' }}>
      <img ref={imgRef} src={src} alt={alt} className={className} />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  )
}
