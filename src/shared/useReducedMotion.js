import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Følger brukerens bevegelsespreferanse live (den kan endres mens siden er åpen).
 * CSS håndterer det meste selv via @media, men enkelte valg må tas i JS —
 * f.eks. hvor mange hjerter vi i det hele tatt monterer.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(QUERY).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
