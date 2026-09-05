/**
 * Lysringen som slår ut fra Ja-knappen i det hun trykker.
 * Engangs, rent dekorativ, kun transform og opacity.
 */
export function Bloom({ origin }) {
  if (!origin) return null

  return (
    <div
      className="bloom"
      aria-hidden="true"
      style={{ left: `${origin.x}px`, top: `${origin.y}px` }}
    >
      <span className="bloom__ring" />
      <span className="bloom__glow" />
    </div>
  )
}
