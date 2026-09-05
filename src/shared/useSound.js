import { useRef, useCallback } from 'react'

// Genererer alle lyder live med Web Audio API – ingen lydfiler trengs.
export function useSound() {
  const ctxRef = useRef(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (!AudioCtx) return null
      ctxRef.current = new AudioCtx()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }, [])

  // Ett enkelt tone-"blipp"
  const tone = useCallback(
    (ctx, { freq, start = 0, dur = 0.15, type = 'sine', gain = 0.25, slideTo }) => {
      const t0 = ctx.currentTime + start
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, t0)
      if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur)
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
      osc.connect(g).connect(ctx.destination)
      osc.start(t0)
      osc.stop(t0 + dur + 0.02)
    },
    []
  )

  // "Boing"-aktig unnvikelse: rask nedadgående pitch
  const playDodge = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    tone(ctx, { freq: 720, slideTo: 180, dur: 0.18, type: 'square', gain: 0.18 })
    tone(ctx, { freq: 1100, slideTo: 300, dur: 0.12, type: 'triangle', gain: 0.08, start: 0.01 })
  }, [getCtx, tone])

  // Feiring: glad oppadgående arpeggio + sparkle
  const playYes = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    notes.forEach((f, i) =>
      tone(ctx, { freq: f, start: i * 0.11, dur: 0.32, type: 'sawtooth', gain: 0.16 })
    )
    // sparkle på toppen
    ;[1568, 2093, 2637].forEach((f, i) =>
      tone(ctx, { freq: f, start: 0.45 + i * 0.06, dur: 0.5, type: 'sine', gain: 0.07 })
    )
  }, [getCtx, tone])

  return { playDodge, playYes }
}
