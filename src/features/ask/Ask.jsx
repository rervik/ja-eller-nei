import { useCallback } from 'react'
import { NoButton } from './NoButton'
import { useDodge } from './useDodge'
import './ask.css'
import '../../shared/typography.css'

/**
 * Spørsmålet. Eier både teksten og jakten på Nei-knappen.
 */
export function Ask({ onYes, onDodgeSound, reduced, leaving }) {
  const handleDodge = useCallback(() => {
    onDodgeSound?.()
    navigator.vibrate?.([18, 12, 28])
  }, [onDodgeSound])

  const { slotRef, anchorRef, dodges, dodge, anchorStyle, buttonStyle } = useDodge({
    onDodge: handleDodge,
    reduced,
    leaving,
  })

  const sayYes = useCallback(
    (e) => {
      const r = e.currentTarget.getBoundingClientRect()
      onYes({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
    },
    [onYes]
  )

  return (
    <section className="ask">
      <span className="kicker rise">
        <span className="kicker__dot" aria-hidden="true" />
        et veldig viktig spørsmål
      </span>

      <h1 className="display question rise">
        Hei Merethe, blir det noe
        <em> sengehygge</em> i kveld?
      </h1>

      <div className="actions">
        <button type="button" className="cta rise" onClick={sayYes}>
          <span className="cta__sheen" aria-hidden="true" />
          <span className="cta__label">Ja</span>
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

        {/* Reserverer plassen Nei-knappen ville tatt, og definerer dermed
            hvileposisjonen den måles mot. Selve knappen ligger i portalen. */}
        <span ref={slotRef} className="no-slot" aria-hidden="true">
          Nei
        </span>
      </div>

      <p className="hint rise" aria-live="polite">
        {dodges > 0 && `«Nei» glapp unna ${dodges} ${dodges === 1 ? 'gang' : 'ganger'} 🫣`}
      </p>

      <NoButton
        anchorRef={anchorRef}
        anchorStyle={anchorStyle}
        buttonStyle={buttonStyle}
        onDodge={dodge}
        leaving={leaving}
      />
    </section>
  )
}
