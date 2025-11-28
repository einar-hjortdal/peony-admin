import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'
import TranslationInputGroup from './TranslationInputs'

// Renders nothing if store.locales.length === 1
const TranslationsInputs = component(({ translations, onChange }) => {
  const { data: storeData } = useStore()
  const { translator } = useTranslation('categories.translationsInputs')

  if (storeData) {
    const { defaultLocaleId, locales } = storeData.store
    if (locales.length === 1) {
      return null
    }

    const res = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i]
      const { id, code } = locale
      if (id === defaultLocaleId) {
        continue
      }

      const languageName = translator.formatName(code, { type: 'language' })

      res.push(
        <li key={id}>
          <div>{languageName}</div>
          <TranslationInputGroup
            localeId={id}
            translations={translations}
            onChange={onChange}
          />
        </li>
      )
    }

    return (
      <ul>
        {res}
      </ul>
    )
  }
})

export default TranslationsInputs
