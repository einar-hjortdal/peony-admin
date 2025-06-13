import { freeze } from '@wareme/utils'

export const config = freeze({
  // URL used for all links, <head> elements, sitemap and JSON-LD.
  // Must not contain trailing `/`.
  // peonyUrl: 'https://api.peony.com', // production
  peonyUrl: 'http://localhost:8080', // development
  name: 'peony'
})
