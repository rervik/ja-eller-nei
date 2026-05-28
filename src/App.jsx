import { useCallback, useRef, useState } from 'react'
import './App.css'

const TEASES = [
  'Nope! 😏',
  'For treg! 🏃',
  'Prøv igjen 👀',
  'Bom! 🎯',
  'Haha, nei 🙅',
  'Aldri i livet 😆',
  'Du bommet! 💨',
  'Nesten! ...ikke 😜',
]

function HeartConfetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 70 }).map((_, i) => (
        <span
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${14 + Math.random() * 26}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2.5 + Math.random() * 3}s`,
          }}
        >
          {['❤️', '💖', '💕', '💗', '💓', '😘'][i % 6]}
        </span>
      ))}
    </div>
  )
}

function App() {
  const [yes, setYes] = useState(false)
  const [noStyle, setNoStyle] = useState({})
  const [dodges, setDodges] = useState(0)
  const [tease, setTease] = useState('Nei')
  const teaseIndex = useRef(0)

  const dodge = useCallback(() => {
    // Flytt "Nei"-knappen til en tilfeldig plass innenfor vinduet
    const padding = 40
    const btnW = 150
    const btnH = 64
    const maxX = window.innerWidth - btnW - padding
    const maxY = window.innerHeight - btnH - padding
    const x = padding + Math.random() * Math.max(0, maxX - padding)
    const y = padding + Math.random() * Math.max(0, maxY - padding)

    setNoStyle({
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      transform: `rotate(${(Math.random() - 0.5) * 30}deg)`,
    })

    teaseIndex.current = (teaseIndex.current + 1) % TEASES.length
    setTease(TEASES[teaseIndex.current])
    setDodges((d) => d + 1)
  }, [])

  if (yes) {
    return (
      <main className="stage celebrate">
        <HeartConfetti />
        <div className="card">
          <h1 className="title">Tusen takk, Merethe! 😍</h1>
          <p className="subtitle">Du er rett og slett best 💖 Gleder meg til i kveld 😏</p>
          <button
            className="btn yes"
            onClick={() => { setYes(false); setDodges(0); setTease('Nei'); setNoStyle({}) }}
          >
            Spør igjen 🔁
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="stage">
      <div className="card">
        <h1 className="title">Hei Merethe, kan jeg få en BJ i kveld? 🥺</h1>
        <p className="subtitle">
          {dodges === 0
            ? 'Velg ærlig 👇'
            : `Du har bommet på "Nei" ${dodges} ${dodges === 1 ? 'gang' : 'ganger'} 😂`}
        </p>

        <div className="buttons">
          <button className="btn yes" onClick={() => setYes(true)}>
            Ja 😍
          </button>

          <button
            className="btn no"
            style={noStyle}
            onMouseEnter={dodge}
            onMouseDown={dodge}
            onTouchStart={(e) => { e.preventDefault(); dodge() }}
            onClick={dodge}
          >
            {tease}
          </button>
        </div>
      </div>
      <footer className="footer">Tips: «Nei» er litt sjenert 🫣</footer>
    </main>
  )
}

export default App
