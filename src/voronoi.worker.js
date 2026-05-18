function buildFrame(srcPixels, W, H, nSeeds) {
  const seeds = []
  for (let i = 0; i < nSeeds; i++) {
    seeds.push({ x: (Math.random() * W) | 0, y: (Math.random() * H) | 0, r: 0, g: 0, b: 0, n: 0 })
  }

  const gSize = Math.max(1, Math.ceil(Math.sqrt(nSeeds / 3)))
  const gW    = Math.ceil(W / gSize)
  const gH    = Math.ceil(H / gSize)
  const grid  = Array.from({ length: gSize * gSize }, () => [])
  seeds.forEach((s, idx) => {
    const cx = Math.min(gSize - 1, (s.x / gW) | 0)
    const cy = Math.min(gSize - 1, (s.y / gH) | 0)
    grid[cy * gSize + cx].push(idx)
  })

  const assign = new Int32Array(W * H)
  for (let py = 0; py < H; py++) {
    const cy = Math.min(gSize - 1, (py / gH) | 0)
    for (let px = 0; px < W; px++) {
      const cx = Math.min(gSize - 1, (px / gW) | 0)
      let best = 0, bestD = Infinity
      for (let gy = Math.max(0, cy - 2); gy <= Math.min(gSize - 1, cy + 2); gy++) {
        for (let gx = Math.max(0, cx - 2); gx <= Math.min(gSize - 1, cx + 2); gx++) {
          const cell = grid[gy * gSize + gx]
          for (let k = 0; k < cell.length; k++) {
            const s = seeds[cell[k]]
            const dx = px - s.x, dy = py - s.y
            const d  = dx * dx + dy * dy
            if (d < bestD) { bestD = d; best = cell[k] }
          }
        }
      }
      assign[py * W + px] = best
      const pi = (py * W + px) * 4
      seeds[best].r += srcPixels[pi]
      seeds[best].g += srcPixels[pi + 1]
      seeds[best].b += srcPixels[pi + 2]
      seeds[best].n++
    }
  }

  const out = new Uint8ClampedArray(W * H * 4)
  for (let i = 0; i < W * H; i++) {
    const s = seeds[assign[i]]
    const c = s.n || 1
    const o = i * 4
    out[o]     = (s.r / c) | 0
    out[o + 1] = (s.g / c) | 0
    out[o + 2] = (s.b / c) | 0
    out[o + 3] = 255
  }

  // Return raw buffer so it can be transferred (zero-copy) back to main thread
  return out.buffer
}

self.onmessage = ({ data: { srcBuffer, W, H, phases } }) => {
  const srcPixels = new Uint8ClampedArray(srcBuffer)
  phases.forEach((nSeeds, phaseIdx) => {
    const buffer = buildFrame(srcPixels, W, H, nSeeds)
    self.postMessage({ buffer, phaseIdx }, [buffer])
  })
}
