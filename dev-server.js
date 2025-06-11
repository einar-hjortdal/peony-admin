import { serve, file } from 'bun'

const server = serve({
  routes: {
    '/_public/*': async (req) => {
      const url = new URL(req.url)
      return new Response(file(`build/${url.pathname}`))
    },
    '/*': async (req) => {
      const url = new URL(req.url)
      if (url.pathname === '/favicon.ico') {
        return new Response(file(`build/${url.pathname}`))
      }
      return new Response(file('build/index.html'))
    }
  },
  development: true
})

console.log(`Listening on ${server.url}`)
