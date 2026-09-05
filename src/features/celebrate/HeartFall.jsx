import { useState } from 'react'

const HEARTS = ['❤️', '💖', '💕', '💗', '💓', '😘', '💞', '🌹']

/* Tre dybdelag gir ekte parallakse: det som er nær faller stort, lyst og
   raskt, det som er fjernt lite, svakt og sakte. */
const LAYERS = [
  { name: 'far', scale: 0.62, opacity: 0.4, min: 7.5, span: 3 },
  { name: 'mid', scale: 1, opacity: 0.7, min: 5.5, span: 2.5 },
  { name: 'near', scale: 1.5, opacity: 1, min: 3.6, span: 2 },
]

/** Antall skaleres med skjermarealet — en telefon skal ikke male 70 lag. */
function heartCount() {
  if (typeof window === 'undefined') return 32
  const area = window.innerWidth * window.innerHeight
  return Math.round(Math.min(64, Math.max(24, area / 18000)))
}

// Tilfeldigheten trekkes én gang ved montering, aldri under render — ellers
// ville hjertene hoppe til nye posisjoner ved hver re-render.
function makeHearts(reduced) {
  const total = reduced ? 18 : heartCount()
  return Array.from({ length: total }, (_, i) => {
    const layer = LAYERS[i % LAYERS.length]
    return {
      id: i,
      char: HEARTS[i % HEARTS.length],
      layer: layer.name,
      style: {
        left: `${Math.random() * 100}%`,
        fontSize: `${(15 + Math.random() * 16) * layer.scale}px`,
        opacity: layer.opacity,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${layer.min + Math.random() * layer.span}s`,
        // Ved redusert bevegelse faller ingenting: hjertene ligger som en
        // rolig, statisk spredning i stedet.
        ...(reduced ? { top: `${8 + Math.random() * 78}%`, animation: 'none' } : null),
      },
    }
  })
}

export function HeartFall({ reduced }) {
  const [hearts] = useState(() => makeHearts(reduced))

  return (
    <div className="hearts" aria-hidden="true">
      {hearts.map((h) => (
        <span key={h.id} className={`heart heart--${h.layer}`} style={h.style}>
          {h.char}
        </span>
      ))}
    </div>
  )
}
