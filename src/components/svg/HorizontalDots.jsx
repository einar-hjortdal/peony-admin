import { component } from '@dark-engine/core'

const HorizontalDots = component(() => {
  return (
    <svg viewBox='0 0 24 8' aria-hidden='true'>
      <circle cx='4' cy='4' r='3' />
      <circle cx='12' cy='4' r='3' />
      <circle cx='20' cy='4' r='3' />
    </svg>
  )
})

export default HorizontalDots
