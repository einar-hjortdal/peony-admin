import { component, detectIsUndefined, useEffect } from '@dark-engine/core'

import { useStore } from '../../data'
import TranslationInputs from './TranslationInputs'

const TranslationDefaultInputs = component(({ translations, onChange }) => {
  const { data: storeData } = useStore()

  useEffect(() => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store

      if (detectIsUndefined(translations)) {
        onChange([{ localeId: defaultLocaleId }])
      }
    }
  }, [translations, storeData])

  if (storeData) {
    const { defaultLocaleId } = storeData.store
    return (
      <TranslationInputs
        localeId={defaultLocaleId}
        translations={translations}
        onChange={onChange}
      />
    )
  }
})

export default TranslationDefaultInputs
