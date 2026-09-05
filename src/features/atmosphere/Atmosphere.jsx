import './atmosphere.css'

/**
 * Bakgrunnen som ett komponert lysrom i stedet for én blurret blob.
 *
 * Alle lagene er rent dekorative og animerer utelukkende `transform` —
 * mykheten ligger i gradientenes egne stopp-punkter, ikke i et `filter`,
 * så det koster ingenting per frame på mobil.
 */
export function Atmosphere() {
  return (
    <div className="atmos" aria-hidden="true">
      <div className="atmos__base" />
      <div className="atmos__light atmos__light--a" />
      <div className="atmos__light atmos__light--b" />
      <div className="atmos__veil" />
      <div className="atmos__grain" />
    </div>
  )
}
