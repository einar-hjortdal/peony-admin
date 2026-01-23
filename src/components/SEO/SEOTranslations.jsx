import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'
import SEOTranslationInputs from './SEOTranslationInputs'

const SEOTranslations = component(({ seo, onInput }) => {
  const { translator } = useTranslation()
  const { data: storeData } = useStore()
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
          <SEOTranslationInputs
            seo={seo}
            localeId={id}
            onInput={onInput}
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

export default SEOTranslations
