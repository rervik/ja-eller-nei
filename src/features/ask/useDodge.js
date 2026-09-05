import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const MARGIN = 14
const MIN_HOP = 150
const MAX_HOP = 270
const CANDIDATES = 10

/** Eskalering: knappen krymper og blekner jo lengre jakten varer. */
const SCALE_FLOOR = 0.78
const SCALE_STEP = 0.022
const OPACITY_FLOOR = 0.5
const OPACITY_STEP = 0.05

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/**
 * Nei-knappens unnvikelse.
 *
 * Knappen er én stabil node som ligger i en portal på <body> gjennom hele
 * livsløpet, forankret til en usynlig plassholder i layouten. All bevegelse
 * skjer med `transform` på ankeret — aldri `left`/`top` — slik at hoppene
 * verken utløser layout eller restarter når hun jager raskt: CSS-transisjoner
 * retargeter fra der knappen faktisk er.
 */
export function useDodge({ onDodge, reduced, leaving }) {
  const slotRef = useRef(null)
  const anchorRef = useRef(null)
  const [anchor, setAnchor] = useState(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [stretch, setStretch] = useState(null)
  const [dodges, setDodges] = useState(0)
  const [entered, setEntered] = useState(false)
  const stretchTimer = useRef(0)

  // Synlig område. visualViewport tar høyde for mobilens nettleserlinjer og
  // for pinch-zoom, så knappen holder seg innenfor det hun faktisk ser.
  const viewport = useCallback(() => {
    const vv = window.visualViewport
    return {
      left: vv?.offsetLeft ?? 0,
      top: vv?.offsetTop ?? 0,
      width: vv?.width ?? window.innerWidth,
      height: vv?.height ?? window.innerHeight,
    }
  }, [])

  /** Lovlig forskyvning fra hvileposisjonen, i skjermkoordinater. */
  const bounds = useCallback(
    (rest, size) => {
      const vp = viewport()
      return {
        minX: vp.left + MARGIN - rest.left,
        maxX: Math.max(vp.left + MARGIN, vp.left + vp.width - size.w - MARGIN) - rest.left,
        minY: vp.top + MARGIN - rest.top,
        maxY: Math.max(vp.top + MARGIN, vp.top + vp.height - size.h - MARGIN) - rest.top,
      }
    },
    [viewport]
  )

  // Plassholderen definerer hvileposisjonen. Den måles på nytt når layouten
  // kan ha flyttet seg, og forskyvningen klampes inn i det nye rommet.
  const measure = useCallback(() => {
    const slot = slotRef.current
    if (!slot) return
    const r = slot.getBoundingClientRect()
    const rest = { left: r.left, top: r.top, w: r.width, h: r.height }
    setAnchor(rest)
    setOffset((prev) => {
      const b = bounds(rest, rest)
      return { x: clamp(prev.x, b.minX, b.maxX), y: clamp(prev.y, b.minY, b.maxY) }
    })
  }, [bounds])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const vv = window.visualViewport
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)
    vv?.addEventListener('resize', measure)
    vv?.addEventListener('scroll', measure)
    return () => {
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      vv?.removeEventListener('resize', measure)
      vv?.removeEventListener('scroll', measure)
    }
  }, [measure])

  // Webfonten endrer plassholderens bredde når den svaier inn. Uten dette
  // ville ankeret vært målt mot fallback-fonten og knappen stått litt feil.
  useEffect(() => {
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })
    return () => {
      cancelled = true
    }
  }, [measure])

  // Inngangen kjøres som transisjon, ikke keyframe: trykker hun Ja med én
  // gang, må knappen kunne tone ut midt i sin egen inntoning. En keyframe
  // med utfylt slutt-tilstand ville låst opasiteten og gitt et hopp.
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => () => clearTimeout(stretchTimer.current), [])

  const dodge = useCallback(
    (e) => {
      const rest = anchor
      if (!rest) return

      const el = anchorRef.current
      const r = el?.getBoundingClientRect()
      const size = { w: r?.width || rest.w || 120, h: r?.height || rest.h || 56 }
      const b = bounds(rest, size)

      // Hvor knappen står nå, og hvor fingeren/musa er.
      const nowX = rest.left + offset.x
      const nowY = rest.top + offset.y
      // Kun et tastaturutløst klikk kombinerer type 'click' med detail 0 og
      // bærer ingen ekte koordinater — da rømmer knappen fra sitt eget
      // sentrum. (Et mouseenter har også detail 0, men gyldig clientX/Y.)
      const fromKeyboard = !e || (e.type === 'click' && e.detail === 0)
      const cx = fromKeyboard ? nowX + size.w / 2 : e.clientX
      const cy = fromKeyboard ? nowY + size.h / 2 : e.clientY

      // Smett et kort stykke unna, men bli på skjermen: prøv flere retninger
      // og velg den som havner lengst fra fingeren etter klamping.
      const hop = MIN_HOP + Math.random() * (MAX_HOP - MIN_HOP)
      let best = { x: offset.x, y: offset.y }
      let bestDist = -1
      for (let i = 0; i < CANDIDATES; i++) {
        const ang = Math.random() * Math.PI * 2
        const x = clamp(cx - size.w / 2 + Math.cos(ang) * hop - rest.left, b.minX, b.maxX)
        const y = clamp(cy - size.h / 2 + Math.sin(ang) * hop - rest.top, b.minY, b.maxY)
        const d = Math.hypot(rest.left + x + size.w / 2 - cx, rest.top + y + size.h / 2 - cy)
        if (d > bestDist) {
          bestDist = d
          best = { x, y }
        }
      }

      // Squash-and-stretch: strekk langs faktisk reiseretning, tilbake i hvile
      // når spretten har landet.
      if (!reduced) {
        const dx = best.x - offset.x
        const dy = best.y - offset.y
        if (Math.hypot(dx, dy) > 6) {
          setStretch({ angle: (Math.atan2(dy, dx) * 180) / Math.PI, sx: 1.14, sy: 0.86 })
          clearTimeout(stretchTimer.current)
          stretchTimer.current = setTimeout(() => setStretch(null), 190)
        }
      }

      setOffset(best)
      setDodges((d) => d + 1)
      onDodge?.()
    },
    [anchor, bounds, offset, onDodge, reduced]
  )

  const shrink = Math.max(SCALE_FLOOR, 1 - dodges * SCALE_STEP)
  const fade = Math.max(OPACITY_FLOOR, 1 - dodges * OPACITY_STEP)

  return {
    slotRef,
    anchorRef,
    dodges,
    dodge,
    // Ankeret eier forflytningen, knappen eier sin egen form. To lag, to
    // transforms — de kan aldri overskrive hverandre.
    anchorStyle: {
      left: `${anchor?.left ?? 0}px`,
      top: `${anchor?.top ?? 0}px`,
      width: `${anchor?.w ?? 0}px`,
      height: `${anchor?.h ?? 0}px`,
      transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
      opacity: anchor && entered && !leaving ? 1 : 0,
      pointerEvents: anchor && entered && !leaving ? 'auto' : 'none',
    },
    buttonStyle: {
      opacity: fade,
      transform: stretch
        ? `rotate(${stretch.angle}deg) scale(${stretch.sx}, ${stretch.sy}) rotate(${-stretch.angle}deg) scale(${shrink})`
        : `scale(${shrink})`,
    },
  }
}
