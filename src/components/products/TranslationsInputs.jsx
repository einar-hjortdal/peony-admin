import { component, detectIsArray, detectIsUndefined, keys } from '@dark-engine/core'

import { useStore } from '../../data'
import { detectIsEmptyString } from '@wareme/utils'
import TranslationInputs from './TranslationInputs'

const TranslationsInputs = component(({ translations, onChange }) => {
  const { data: storeData } = useStore()

  if (storeData) {
    const { defaultLocaleId, locales } = storeData.store
    if (locales.length === 1) {
      return null
    }

    const translationsMap = {} // TODO why am I doing this?
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

    const handleInput = (event) => {
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

      rows.push(
        <li key={localeCode}>
          <TranslationInputs
            localeCode={localeCode}
            localeId={localeId}
            title={title}
            subtitle={subtitle}
            description={description}
            onInput={handleInput}
          />
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
