import { detectIsBrowser } from '@dark-engine/platform-browser'

export const getPrefersReducedMotion = () => {
  if (detectIsBrowser()) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return true
}
