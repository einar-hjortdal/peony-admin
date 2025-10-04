import { component, detectIsArray, keys } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'

const TranslationsInputs = component(({ translations, onChange }) => {
  const { data: storeData } = useStore()
  const { t, translator } = useTranslation('translationsInputs')

  if (storeData) {
    const { defaultLocaleId, locales } = storeData.store
    const translationsMap = {}
    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i]
      translationsMap[locale.id] = {
        localeCode: locale.code,
        localeId: locale.id
      }
    }

    if (detectIsArray(translations)) {
      for (let i = 0, len = translations.length; i < len; i++) {
        const { localeId, title, subtitle, description } = translations[i]
        translationsMap[localeId].title = title
        translationsMap[localeId].subtitle = subtitle
        translationsMap[localeId].description = description
      }
    }

    const handleChange = (e) => {
      const { name, value } = e.target
      const { localeId } = e.target.dataset
      const newTranslations = [...translations]

      let found = false
      for (let i = 0, len = newTranslations.length; i < len; i++) {
        const translation = newTranslations[i]
        if (translation.localeId === localeId) {
          newTranslations[i] = { ...translation, [name]: value }
          found = true
          break
        }
      }

      if (!found) {
        newTranslations.push({ localeId, [name]: value })
      }

      onChange(newTranslations)
    }

    const rows = []
    const localeIds = keys(translationsMap)
    for (let i = 0, len = localeIds.length; i < len; i++) {
      const localeId = localeIds[i]
      if (localeId === defaultLocaleId) {
        continue
      }

      const translation = translationsMap[localeId]
      const { localeCode, title, subtitle, description } = translation
      const languageName = translator.formatName(localeCode, { type: 'language' })

      rows.push(
        <li>
          <div>{languageName}</div>
          <div>
            {t('title')}:
            <input
              type='text'
              name='title'
              data-locale-id={localeId}
              value={title}
              onInput={handleChange}
            />
          </div>
          <div>
            {t('subtitle')}:
            <input
              type='text'
              name='subtitle'
              data-locale-id={localeId}
              value={subtitle}
              onInput={handleChange}
            />
          </div>
          <div>
            {t('description')}:
            <input
              type='text'
              name='description'
              data-locale-id={localeId}
              value={description}
              onInput={handleChange}
            />
          </div>
        </li>
      )
    }

    return (
      <ul>
        {rows}
      </ul>
    )
  }
})

export default TranslationsInputs
