import { component, useMemo } from '@dark-engine/core'
import { DataClient, InMemoryCache, DataClientProvider } from '@dark-engine/data'
import { Router } from '@dark-engine/web-router'
import { RafNexusProvider } from '@wareme/raf-nexus'
import { TranslationsProvider } from '@wareme/translations'

import { routes } from '../routes'

const App = component(({ translator, api }) => {
  const client = useMemo(() => {
    return new DataClient({ api, cache: new InMemoryCache() })
  }, [])

  return (
    <RafNexusProvider>
      <TranslationsProvider translator={translator}>
        <DataClientProvider client={client}>
          <Router routes={routes}>
            {slot => slot}
          </Router>
        </DataClientProvider>
      </TranslationsProvider>
    </RafNexusProvider>
  )
})

export default App
