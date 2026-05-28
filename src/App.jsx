import { useCallback, useRef, useState } from 'react'
import { useSound } from './useSound'
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
  'Catch me! 🦋',
  'Hihi 🫣',
]

function HeartConfetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {Array.from({ length: 80 }).map((_, i) => (
        <span
          key={i}
          className="heart"
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${14 + Math.random() * 28}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2.5 + Math.random() * 3}s`,
          }}
        >
          {['❤️', '💖', '💕', '💗', '💓', '😘', '💞'][i % 7]}
        </span>
      ))}
    </div>
  )
}

function Orbs() {
  return (
    <div className="orbs" aria-hidden="true">
      <span className="orb orb-1" />
      <span className="orb orb-2" />
      <span className="orb orb-3" />
    </div>
  )
}

function App() {
  const [yes, setYes] = useState(false)
  const [noStyle, setNoStyle] = useState({})
  const [dodges, setDodges] = useState(0)
  const [tease, setTease] = useState('Nei')
  const teaseIndex = useRef(0)
  const { playDodge, playYes } = useSound()

  const dodge = useCallback(() => {
    const padding = 40
    const btnW = 160
    const btnH = 66
    const maxX = window.innerWidth - btnW - padding
    const maxY = window.innerHeight - btnH - padding
    const x = padding + Math.random() * Math.max(0, maxX - padding)
    const y = padding + Math.random() * Math.max(0, maxY - padding)

    setNoStyle({
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      transform: `rotate(${(Math.random() - 0.5) * 36}deg) scale(${0.9 + Math.random() * 0.25})`,
    })

    teaseIndex.current = (teaseIndex.current + 1) % TEASES.length
    setTease(TEASES[teaseIndex.current])
    setDodges((d) => d + 1)
    playDodge()
  }, [playDodge])

  const sayYes = useCallback(() => {
    playYes()
    setYes(true)
  }, [playYes])

  const reset = useCallback(() => {
    setYes(false)
    setDodges(0)
    setTease('Nei')
    setNoStyle({})
  }, [])

  if (yes) {
    return (
      <main className="stage celebrate">
        <Orbs />
        <HeartConfetti />
        <div className="flash" aria-hidden="true" />
        <div className="card glow">
          <div className="emoji-burst">😍</div>
          <h1 className="title">Tusen takk, Merethe!</h1>
          <p className="subtitle">Du er rett og slett best 💖 Gleder meg til i kveld 😏</p>
          <button className="btn yes" onClick={reset}>
            Spør igjen 🔁
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="stage">
      <Orbs />
      <div className="card glow">
        <h1 className="title">Hei Merethe, kan jeg få en BJ i kveld? 🥺</h1>
        <p className="subtitle">
          {dodges === 0
            ? 'Velg ærlig 👇'
            : `Du har bommet på "Nei" ${dodges} ${dodges === 1 ? 'gang' : 'ganger'} 😂`}
        </p>

        <div className="buttons">
          <button className="btn yes pulse" onClick={sayYes}>
            Ja 😍
          </button>

          <button
            className="btn no"
            style={noStyle}
            onMouseEnter={dodge}
            onMouseDown={dodge}
            onTouchStart={(e) => {
              e.preventDefault()
              dodge()
            }}
            onClick={dodge}
          >
            {tease}
          </button>
        </div>
      </div>
      <footer className="footer">🔊 Skru på lyden · «Nei» er litt sjenert 🫣</footer>
    </main>
  )
}

export default App
