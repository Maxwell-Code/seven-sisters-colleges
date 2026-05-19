import { useEffect, useRef, useState, useMemo } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { COLLEGES } from './data/colleges.js'
import { BIBLIOGRAPHY } from './data/bibliography.js'
import PolygonReveal from './PolygonReveal.jsx'

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV']
import './Map.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// Center derived from the bounding box of all 7 colleges; shifted slightly
// south so Bryn Mawr (the southwesternmost) isn't clipped by the pitched view.
const OVERVIEW = { center: [-73.2, 41.0], zoom: 7, pitch: 45, bearing: 0 }
const COLLEGE_ZOOM = 15.5
const ZOOMED_IN_THRESHOLD = 10
const DURATION = 2000

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

// Renders a text string with custom markup into React nodes:
//   <<   → opening curly quote (purple)
//   >>   → closing curly quote (purple)
//   //   → toggle italics (wrap subsequent text in <em> until next //)
//   \n   → <br />
function splitCoalesce(text, baseDelay = 0) {
  return text.split('').map((char, i) =>
    char === ' '
      ? <span key={i}> </span>
      : <span
          key={i}
          className="map-header__letter"
          style={{
            '--lx': `${(Math.random() - 0.5) * 110}px`,
            '--ly': `${-(28 + Math.random() * 120)}px`,
            '--lr': `${(Math.random() - 0.5) * 14}deg`,
            animationDelay: `${baseDelay + Math.random() * 0.06}s`,
          }}
        >{char}</span>
  )
}

function renderText(text) {
  let italic = false
  return text.split(/(<<|>>|\/\/|\n)/).map((token, i) => {
    if (token === '<<') return <span key={i} className='motto-quote'>&ldquo;</span>
    if (token === '>>') return <span key={i} className='motto-quote'>&rdquo;</span>
    if (token === '\n') return <br key={i} />
    if (token === '//') { italic = !italic; return null }
    return italic ? <em key={i}>{token}</em> : token
  })
}

export default function Map() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const rafRef = useRef(null)
  const animatingRef = useRef(false)
  const activeCollegeRef = useRef(null)
  const [activeCollege, setActiveCollege] = useState(null)
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('seven-sisters-intro-seen'))
  const [openExtra, setOpenExtra] = useState(null)
  const [showBibliography, setShowBibliography] = useState(false)
  const [openBibItem, setOpenBibItem] = useState(null)

  function setActive(college) {
    activeCollegeRef.current = college
    setActiveCollege(college)
    setOpenExtra(null)
  }

  function dismissIntro() {
    localStorage.setItem('seven-sisters-intro-seen', '1')
    setShowIntro(false)
  }

  function cancelAnimation() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    animatingRef.current = false
  }

  // Drive every frame ourselves so the easing function is applied directly,
  // with no Mapbox internal curve composited on top.
  function animateTo(target) {
    cancelAnimation()

    const from = {
      lng: map.current.getCenter().lng,
      lat: map.current.getCenter().lat,
      zoom: map.current.getZoom(),
      pitch: map.current.getPitch(),
    }
    const startTime = performance.now()
    animatingRef.current = true

    function frame(now) {
      const t = Math.min((now - startTime) / DURATION, 1)
      const zoomP   = easeOutQuart(t)
      // Center runs the same curve but at 2.5× speed, capped at 1.
      // This ensures the college is in frame before the zoom finishes.
      const centerP = easeOutQuart(Math.min(t * 2.5, 1))

      map.current.jumpTo({
        center: [
          from.lng + (target.lng - from.lng) * centerP,
          from.lat + (target.lat - from.lat) * centerP,
        ],
        zoom: from.zoom + (target.zoom - from.zoom) * zoomP,
        pitch: from.pitch + (target.pitch - from.pitch) * zoomP,
      })

      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        animatingRef.current = false
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(frame)
  }

  useEffect(() => {
    if (map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: OVERVIEW.center,
      zoom: OVERVIEW.zoom,
      pitch: OVERVIEW.pitch,
      bearing: OVERVIEW.bearing,
      minZoom: 6,
    })

    map.current.on('load', () => {
      map.current.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      })
      map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 })

      map.current.addLayer({
        id: 'sky',
        type: 'sky',
        paint: {
          'sky-type': 'atmosphere',
          'sky-atmosphere-sun': [0.0, 0.0],
          'sky-atmosphere-sun-intensity': 15,
        },
      })

      map.current.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#c8bfb0',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.75,
        },
      })

      COLLEGES.forEach((college) => {
        const el = document.createElement('div')
        el.className = 'college-marker'

        const labelEl = document.createElement('div')
        labelEl.className = 'college-marker__label'
        labelEl.textContent = college.name

        const pinEl = document.createElement('div')
        pinEl.className = 'college-marker__pin'
        pinEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
          <path d="M12 3L1 9l11 6 11-6-11-6z"/>
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          <path d="M21 9v5.5l1.5.86V9.91L21 9z"/>
          <circle cx="22.5" cy="15.5" r="1.5"/>
        </svg>`

        if (college.logo) {
          el.classList.add('college-marker--has-logo')
          const logoEl = document.createElement('img')
          logoEl.className = 'college-marker__logo'
          logoEl.src = college.logo
          logoEl.alt = college.name + ' logo'
          pinEl.appendChild(logoEl)
        }

        el.appendChild(labelEl)
        el.appendChild(pinEl)

        new mapboxgl.Marker({ element: el, anchor: 'bottom' })
          .setLngLat(college.lngLat)
          .addTo(map.current)

        el.addEventListener('click', () => {
          setActive(college)
          animateTo({ lng: college.lngLat[0], lat: college.lngLat[1], zoom: COLLEGE_ZOOM, pitch: 60 })
        })
      })

      map.current.on('zoomend', () => {
        if (!animatingRef.current && activeCollegeRef.current && map.current.getZoom() < ZOOMED_IN_THRESHOLD) {
          setActive(null)
        }
      })
    })

    return () => {
      cancelAnimation()
      map.current?.remove()
      map.current = null
    }
  }, [])

  function handleBack() {
    setActive(null)
    animateTo({ lng: OVERVIEW.center[0], lat: OVERVIEW.center[1], zoom: OVERVIEW.zoom, pitch: OVERVIEW.pitch })
  }

  const active = activeCollege

  const titleLetters = useMemo(() => {
    const text = active ? active.name : 'The Seven Sisters Colleges'
    return text.split('').map((char) => ({
      char,
      x: `${(Math.random() - 0.5) * 110}px`,
      y: `${-(28 + Math.random() * 120)}px`,
      r: `${(Math.random() - 0.5) * 14}deg`,
      delay: `${Math.random() * 0.08}s`,
    }))
  }, [active?.name])

  return (
    <div className="map-scene">
      <button className="info-btn" onClick={() => setShowIntro(true)} aria-label="Show introduction">
        <span>i</span>
      </button>

      {showIntro && (
        <div className="intro-overlay">
          <div className="intro-deck">
            <div className="intro-welcome" style={{ animationDelay: '50ms' }}>
              <h2 className="intro-welcome__title">Welcome</h2>
              <p className="intro-welcome__sub">to The Seven Sisters Colleges</p>
            </div>
            <div className="intro-tip-card" style={{ animationDelay: '360ms' }}>
              <span className="intro-tip-num">01</span>
              <p className="intro-tip-text">Scroll to zoom or use the <strong>+</strong> / <strong>−</strong> buttons on the lower left</p>
            </div>
            <div className="intro-tip-card" style={{ animationDelay: '490ms' }}>
              <span className="intro-tip-num">02</span>
              <p className="intro-tip-text">Click any college marker to focus on it</p>
            </div>
            <div className="intro-tip-card" style={{ animationDelay: '620ms' }}>
              <span className="intro-tip-num">03</span>
              <p className="intro-tip-text">Right-click and drag to orbit the camera around a point</p>
            </div>
            <button className="intro-dismiss" style={{ animationDelay: '650ms' }} onClick={dismissIntro}>Explore the Map</button>
          </div>
        </div>
      )}

      <header className="map-header">
        <div className="map-header__inner">
          <div className="map-header__title-box" key={active?.name ?? 'overview'}>
            <h1>
              {titleLetters.map(({ char, x, y, r, delay }, i) => (
                <span
                  key={i}
                  className="map-header__letter"
                  style={{ '--lx': x, '--ly': y, '--lr': r, animationDelay: delay }}
                >
                  {char}
                </span>
              ))}
            </h1>
            {active?.motto && (
              <p className="map-header__motto">
                {renderText(active.motto)}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Left panel — college description */}
      <aside className={`college-panel college-panel--left${active ? ' is-visible' : ''}`}>
        <div className="college-panel__top">
          {active?.logo && (
            <img className="college-panel__logo" src={active.logo} alt={`${active.name} logo`} />
          )}
          <h2 className="college-panel__heading">About</h2>
        </div>
        {active?.extras?.filter(e => e.image || e.text).map((extra) => (
          <button key={extra.title} className='college-extra__trigger' onClick={() => setOpenExtra(extra.title)}>
            <span>{extra.title}</span>
            <span className='college-extra__arrow'>&#8594;</span>
          </button>
        ))}
        <p className="college-panel__body">{active?.description ? renderText(active.description) : null}</p>
      </aside>

      {/* Right panel — notable figure */}
      <aside className={`college-panel college-panel--right${active ? ' is-visible' : ''}`}>
        <h2 className="college-panel__heading">{active?.notablePanelLabel ?? 'Notable Alumnae'}</h2>
        <div className="notable-figure">
          {active?.notableFigure?.image
            ? <div className='notable-figure__frame'><PolygonReveal className="notable-figure__image" src={active.notableFigure.image} alt={active.notableFigure.name} /></div>
            : <div className="notable-figure__placeholder"><span>Photo coming soon</span></div>
          }
          <h3 className="notable-figure__name">{active?.notableFigure?.name}</h3>
          <p className="notable-figure__bio">{active?.notableFigure?.bio ? renderText(active.notableFigure.bio) : null}</p>
        </div>
        {active?.notableExtras?.filter(e => e.image || e.text).map((extra) => (
          <button key={extra.title} className='college-extra__trigger' onClick={() => setOpenExtra(extra.title)}>
            <span>{extra.title}</span>
            <span className='college-extra__arrow'>&#8594;</span>
          </button>
        ))}
      </aside>

      <div className="zoom-controls">
        <button className="zoom-btn" onClick={() => map.current?.zoomIn()}>+</button>
        <button className="zoom-btn" onClick={() => map.current?.zoomOut()}>−</button>
      </div>

      {active && (
        <button className="back-button" onClick={handleBack}>
          <span className="back-button__arrow">←</span>
          <span className="back-button__label">Back?</span>
        </button>
      )}
      {openExtra && (() => {
        const extra = [...(active?.extras ?? []), ...(active?.notableExtras ?? [])].find(e => e.title === openExtra)
        if (!extra) return null
        const lines = extra.text ? extra.text.split('\n').filter(l => l.trim()) : []

        // Gaps start wide and compress: first lines breathe, last lines rush in
        const n = lines.length
        let t = 0.05
        const lineDelays = lines.map((_, i) => {
          const d = t
          const frac = n > 1 ? i / (n - 1) : 0
          t += 0.28 + (0.05 - 0.28) * frac
          return d
        })

        return (
          <div className='song-overlay' onClick={() => setOpenExtra(null)}>
            <div className={`song-card${extra.image ? ' song-card--wide' : ''}`} onClick={e => e.stopPropagation()}>
              <button className='song-card__close' onClick={() => setOpenExtra(null)}>&times;</button>
              <p className='song-card__label'>{splitCoalesce(extra.title)}</p>
              <div className='song-card__divider' />
              {extra.image && (
                <div className='song-card__image-wrap'>
                  <PolygonReveal className='song-card__image' src={extra.image} alt={extra.title} />
                </div>
              )}
              {lines.length > 0 && (
                <div className='song-card__poem'>
                  {lines.map((line, i) => {
                    const lineDelay = lineDelays[i]
                    return (
                      <p key={i} className='song-card__line'>
                        {splitCoalesce(line, lineDelay)}
                      </p>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )
      })()}
      {/* Bibliography button */}
      <button className={`bib-btn${showBibliography ? ' bib-btn--open' : ''}${active ? ' bib-btn--hidden' : ''}`} onClick={() => setShowBibliography(v => !v)}>
        <svg className='bib-btn__icon' viewBox="0 0 20 20" width="20" height="20" fill="currentColor">
          <path d="M4 2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm1 3h10v1H5V5zm0 3h10v1H5V8zm0 3h7v1H5v-1z"/>
        </svg>
        <span>Annotated Bibliography</span>
      </button>

      {/* Bibliography overlay */}
      {showBibliography && (
        <div className='bib-overlay' onClick={() => setShowBibliography(false)}>
        <div className='bib-panel' onClick={e => e.stopPropagation()}>
          <div className='bib-panel__header'>
            <div className='bib-panel__header-inner'>
              <span className='bib-panel__eyebrow'>Works Cited</span>
              <h2 className='bib-panel__title'>Annotated Bibliography</h2>
            </div>
            <button className='bib-panel__close' onClick={() => setShowBibliography(false)}>&times;</button>
          </div>
          <div className='bib-panel__list'>
            {BIBLIOGRAPHY.map((item, i) => (
              <div
                key={item.id}
                className={`bib-item${openBibItem === item.id ? ' is-open' : ''}`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <button className='bib-item__header' onClick={() => setOpenBibItem(openBibItem === item.id ? null : item.id)}>
                  <span className='bib-item__citation'>
                    <span className='bib-item__numeral'>{ROMAN[i]}</span>
                    <span className={`bib-item__type bib-item__type--${item.type}`}>
                      {item.type === 'primary' ? 'Primary' : 'Secondary'}
                    </span>
                    {item.citation}
                    {item.link && (
                      <a
                        className='bib-item__link'
                        href={item.link}
                        target='_blank'
                        rel='noreferrer'
                        onClick={e => e.stopPropagation()}
                      >
                        <svg viewBox='0 0 12 12' width='12' height='12' fill='currentColor'>
                          <path d='M7 1h4v4l-1.5-1.5-3 3-1-1 3-3L7 1zM2 2h3v1H3v6h6V7h1v3H2V2z'/>
                        </svg>
                        View source
                      </a>
                    )}
                  </span>
                  <span className='bib-item__arrow'>&#8964;</span>
                </button>
                <div className='bib-item__body'>
                  <p className='bib-item__annotation'>{item.annotation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      )}

      <div ref={mapContainer} className="map-container" />
    </div>
  )
}
