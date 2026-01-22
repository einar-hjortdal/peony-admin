import { component, detectIsArray, detectIsUndefined, keys } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'
import { detectIsEmptyString } from '@wareme/utils'

const TranslationsInputs = component(({ translations, onChange }) => {
  const { data: storeData } = useStore()
  const { t, translator } = useTranslation('products.translationsInputs')

  if (storeData) {
    const { defaultLocaleId, locales } = storeData.store
    if (locales.length === 1) {
      return null
    }

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

    const handleChange = (event) => {
      const { name, value, dataset } = event.target
      const { localeId } = dataset

      if (detectIsEmptyString(value)) {
        if (detectIsUndefined(translations)) {
          return
        }

        const newTranslations = [...translations]
        for (let i = 0, len = newTranslations.length; i < len; i++) {
          const translation = newTranslations[i]
          if (translation.localeId === localeId) {
            const newTranslation = { ...translation }
            delete newTranslation[name]

            const { title, subtitle, description } = newTranslation
            if (
              detectIsUndefined(title) &&
              detectIsUndefined(subtitle) &&
              detectIsUndefined(description)
            ) {
              newTranslations.splice(i, 1)
              onChange(newTranslations)
              return
            }

            newTranslations[i] = newTranslation
            onChange(newTranslations)
            return
          }
        }
      }

      if (detectIsUndefined(translations)) {
        const newTranslations = [{ localeId, [name]: value }]
        onChange(newTranslations)
        return
      }

      const newTranslations = [...translations]

      for (let i = 0, len = newTranslations.length; i < len; i++) {
        const translation = newTranslations[i]
        if (translation.localeId === localeId) {
          newTranslations[i] = { ...translation, [name]: value }
          onChange(newTranslations)
          return
        }
      }

      newTranslations.push({ localeId, [name]: value })
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
