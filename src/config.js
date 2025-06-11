import { freeze } from '@wareme/utils'

export const config = freeze({
  // URL used for all links, <head> elements, sitemap and JSON-LD.
  // Must not contain trailing `/`.
  // baseUrl: 'https://admin.peony.com', // production
  baseUrl: 'http://localhost:8081', // development
  // baseUrl: 'https://peony.com', // production
  peonyUrl: 'http://localhost:8080', // development
  name: 'peony'
})
