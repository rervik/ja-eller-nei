import { useCallback, useRef, useState } from 'react'
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

  const dodge = useCallback(() => {
    // Synlig område (visualViewport tar høyde for mobil-nettleserens linjer)
    const vv = window.visualViewport
    const vw = vv ? vv.width : window.innerWidth
    const vh = vv ? vv.height : window.innerHeight

    // Mål knappens faktiske størrelse så den aldri klippes på kanten
    const rect = noRef.current?.getBoundingClientRect()
    const btnW = rect?.width || 120
    const btnH = rect?.height || 56
    const margin = 16

    // Klamp hardt innenfor synlig område
    const minX = margin
    const maxX = Math.max(minX, vw - btnW - margin)
    const minY = margin
    const maxY = Math.max(minY, vh - btnH - margin)
    const x = Math.min(maxX, Math.max(minX, minX + Math.random() * (maxX - minX)))
    const y = Math.min(maxY, Math.max(minY, minY + Math.random() * (maxY - minY)))

    setNoStyle({
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      margin: 0,
      zIndex: 100,
      transform: `rotate(${(Math.random() - 0.5) * 18}deg)`,
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

          <button
            ref={noRef}
            className="ghost"
            style={noStyle ?? undefined}
            onMouseEnter={dodge}
            onPointerDown={(e) => {
              e.preventDefault()
              dodge()
            }}
            onClick={dodge}
          >
            Nei
          </button>
        </div>

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
