import { HeartFall } from './HeartFall'
import './celebrate.css'
import '../../shared/typography.css'

/** Svaret. Alt her ligger på delight-nivået — det sees én gang. */
export function Celebrate({ onAgain, reduced }) {
  return (
    <>
      <HeartFall reduced={reduced} />
      <section className="celebrate">
        <span className="kicker rise">
          <span className="kicker__dot" aria-hidden="true" />
          svaret er ja 💋
        </span>

        <h1 className="display answer rise">
          Tusen takk,
          <em> Merethe</em>
        </h1>

        <p className="lead rise">Visste det 😏 Gleder meg til i kveld.</p>

        <button type="button" className="link-btn rise" onClick={onAgain}>
          spør igjen ↺
        </button>
      </section>
    </>
  )
}
