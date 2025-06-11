import { component } from '@dark-engine/core'

const Copyright = component(({ name }) => {
  const copyrightYear = new Date().getFullYear()
  return <>&#xa9; {copyrightYear} {name}</>
})

export default Copyright
