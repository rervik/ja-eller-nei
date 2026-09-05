import { useCallback, useEffect, useRef, useState } from 'react'
import { Atmosphere } from './features/atmosphere/Atmosphere'
import { Ask } from './features/ask/Ask'
import { Bloom } from './features/celebrate/Bloom'
import { Celebrate } from './features/celebrate/Celebrate'
import { useReducedMotion } from './shared/useReducedMotion'
import { useSound } from './shared/useSound'

/* Må matche --duration-exit i index.css: spørsmålet skal være ute før
   svaret kommer inn, ellers overlapper de to tilstandene. */
const PART_MS = 260

/**
 * Orkestrerer de tre fasene.
 *
 *   asking → parting → celebrating
 *
 * `parting` finnes fordi overgangen tidligere var et hardt kutt: hele treet
 * ble byttet momentant, akkurat i det øyeblikket siden handler om.
 */
export default function App() {
  const [phase, setPhase] = useState('asking')
  const [origin, setOrigin] = useState(null)
  const { playDodge, playYes } = useSound()
  const reduced = useReducedMotion()
  const timer = useRef(0)

  const sayYes = useCallback(
    (buttonCenter) => {
      playYes()
      navigator.vibrate?.([12, 30, 12, 30, 80])
      setOrigin(buttonCenter)
      setPhase('parting')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setPhase('celebrating'), PART_MS)
    },
    [playYes]
  )

  const again = useCallback(() => {
    clearTimeout(timer.current)
    setOrigin(null)
    setPhase('asking')
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <main className="scene" data-phase={phase}>
      <Atmosphere />

      {phase !== 'celebrating' && (
        <Ask
          onYes={sayYes}
          onDodgeSound={playDodge}
          reduced={reduced}
          leaving={phase === 'parting'}
        />
      )}

      {phase !== 'asking' && <Bloom origin={origin} />}

      {phase === 'celebrating' && <Celebrate onAgain={again} reduced={reduced} />}
    </main>
  )
}
