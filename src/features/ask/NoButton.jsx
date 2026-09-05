import { createPortal } from 'react-dom'

/**
 * Nei-knappen, rendret i en portal på <body> gjennom hele livsløpet.
 *
 * Portalen er nødvendig fordi en `transform` på en forelder gjør
 * `position: fixed` relativt til forelderen i stedet for til skjermen — og
 * `.ask` transformeres når den kommer inn og går ut. Fordi knappen aldri
 * gjenskapes, animerer også aller første hopp.
 *
 * To lag med hver sin transform: ankeret flytter seg, knappen former seg.
 */
export function NoButton({ anchorRef, anchorStyle, buttonStyle, onDodge, leaving }) {
  return createPortal(
    <div
      ref={anchorRef}
      className={leaving ? 'no-anchor is-leaving' : 'no-anchor'}
      style={anchorStyle}
    >
      <button
        type="button"
        className="no-btn"
        style={buttonStyle}
        onMouseEnter={onDodge}
        onPointerDown={(e) => {
          // Uten dette rekker en rask tommel å treffe knappen før den flytter seg.
          e.preventDefault()
          onDodge(e)
        }}
        onClick={onDodge}
      >
        Nei
      </button>
    </div>,
    document.body
  )
}
