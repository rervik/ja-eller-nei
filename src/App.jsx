import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useSound } from './useSound'
import './App.css'

const HEARTS = ['❤️', '💖', '💕', '💗', '💓', '😘', '💞', '🌹']

function HeartFall() {
  return (
    <div className="hearts" aria-hidden="true">
      {Array.from({ length: 70 }).map((_, i) => (
        <span
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${14 + Math.random() * 30}px`,
            animationDelay: `${Math.random() * 3.5}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
          }}
        >
          {HEARTS[i % HEARTS.length]}
        </span>
      ))}
    </div>
  )
}

function App() {
  const [yes, setYes] = useState(false)
  const [noStyle, setNoStyle] = useState(null)
  const [dodges, setDodges] = useState(0)
  const noRef = useRef(null)
  const { playDodge, playYes } = useSound()

  const dodge = useCallback((e) => {
    // Synlig område (visualViewport tar høyde for mobil-nettleserens linjer)
    const vv = window.visualViewport
    const vw = vv ? vv.width : window.innerWidth
    const vh = vv ? vv.height : window.innerHeight

    // Knappens faktiske mål så den aldri klippes på kanten
    const rect = noRef.current?.getBoundingClientRect()
    const btnW = rect?.width || 120
    const btnH = rect?.height || 56
    const margin = 14

    const minX = margin
    const maxX = Math.max(minX, vw - btnW - margin)
    const minY = margin
    const maxY = Math.max(minY, vh - btnH - margin)
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

    // Hvor er fingeren/musa nå?
    const cx = e?.clientX ?? (rect ? rect.left + btnW / 2 : vw / 2)
    const cy = e?.clientY ?? (rect ? rect.top + btnH / 2 : vh / 2)

    // Smett et KORT stykke unna i en tilfeldig retning – men hold deg på skjermen.
    // Prøv noen retninger og velg den som havner lengst fra fingeren (men nær nok til å være synlig).
    const hop = 150 + Math.random() * 120 // 150–270 px
    let best = null
    let bestDist = -1
    for (let i = 0; i < 8; i++) {
      const ang = Math.random() * Math.PI * 2
      const nx = clamp(cx - btnW / 2 + Math.cos(ang) * hop, minX, maxX)
      const ny = clamp(cy - btnH / 2 + Math.sin(ang) * hop, minY, maxY)
      const d = Math.hypot(nx + btnW / 2 - cx, ny + btnH / 2 - cy)
      if (d > bestDist) {
        bestDist = d
        best = { nx, ny }
      }
    }

    setNoStyle({
      position: 'fixed',
      left: `${best.nx}px`,
      top: `${best.ny}px`,
      margin: 0,
      zIndex: 100,
      transform: `rotate(${(Math.random() - 0.5) * 16}deg)`,
    })
    setDodges((d) => d + 1)
    playDodge()

    // Vibrasjon på mobil
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([18, 12, 28])
    }
  }, [playDodge])

  const sayYes = useCallback(() => {
    playYes()
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([12, 30, 12, 30, 80])
    }
    setYes(true)
  }, [playYes])

  const reset = useCallback(() => {
    setYes(false)
    setDodges(0)
    setNoStyle(null)
  }, [])

  if (yes) {
    return (
      <main className="scene">
        <div className="aura" aria-hidden="true" />
        <HeartFall />
        <section className="yes-screen">
          <span className="kicker">svaret er ja 💋</span>
          <h1 className="answer">
            Tusen takk,
            <em> Merethe</em>
          </h1>
          <p className="lead">Visste det 😏 Gleder meg til i kveld.</p>
          <button className="link-btn" onClick={reset}>
            spør igjen ↺
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="scene">
      <div className="aura" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <section className="ask">
        <span className="kicker">et veldig viktig spørsmål</span>
        <h1 className="question">
          Hei Merethe — kan jeg få en
          <em> BJ</em> i kveld?
        </h1>

        <div className="actions">
          <button className="cta" onClick={sayYes}>
            <span>Ja</span>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {!noStyle && (
            <button
              ref={noRef}
              className="ghost"
              onMouseEnter={dodge}
              onPointerDown={(e) => {
                e.preventDefault()
                dodge(e)
              }}
              onClick={dodge}
            >
              Nei
            </button>
          )}
        </div>

        {/* Når knappen flykter rendres den i en portal på <body> slik at
            position:fixed blir ekte skjerm-relativt (forelder-transform
            fra rise-animasjonene ville ellers forskyve den ut av syne). */}
        {noStyle &&
          createPortal(
            <button
              ref={noRef}
              className="ghost"
              style={noStyle}
              onMouseEnter={dodge}
              onPointerDown={(e) => {
                e.preventDefault()
                dodge(e)
              }}
              onClick={dodge}
            >
              Nei
            </button>,
            document.body
          )}

        <p className="hint">
          {dodges === 0
            ? '🔊 lyd på · prøv å trykke «Nei» 😉'
            : `«Nei» glapp unna ${dodges} ${dodges === 1 ? 'gang' : 'ganger'} 🫣`}
        </p>
      </section>
    </main>
  )
}

export default App
