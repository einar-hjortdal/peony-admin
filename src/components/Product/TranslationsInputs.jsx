import { component, keys } from '@dark-engine/core'

import { useStore } from '../../data'

const TranslationsInputs = component(({ translations, onChange }) => {
  const { data: storeData } = useStore()

  if (storeData) {
    const { defaultLocaleId, locales } = storeData.store
    const translationsMap = {}
    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i]
      if (locale.id === defaultLocaleId) {
        continue
      }
      translationsMap[locale.id] = {
        localeCode: locale.code,
        localeId: locale.id
      }
    }

    for (let i = 0, len = translations.length; i < len; i++) {
      const { localeId, title, subtitle, description } = translations[i]
      translationsMap[localeId].title = title
      translationsMap[localeId].subtitle = subtitle
      translationsMap[localeId].description = description
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
      const translation = translationsMap[localeId]
      const { localeCode, title, subtitle, description } = translation
      rows.push(
        <li>
          <div>{localeCode}</div>
          <div>
            title:
            <input
              type='text'
              name='title'
              data-locale-id={localeId}
              value={title}
              onInput={handleChange}
            />
          </div>
          <div>
            subtitle:
            <input
              type='text'
              name='title'
              data-locale-id={localeId}
              value={subtitle}
              onInput={handleChange}
            />
          </div>
          <div>
            description:
            <input
              type='text'
              name='title'
              data-locale-id={localeId}
              value={description}
              onInput={handleChange}
            />
          </div>
        </li>
      )
    }
    // locales is an array of objects {id, code}
    // we have to ignore the locale with id === defaultLocaleId
    // existingTranslations is an array of object: {localeId, title, subtitle, description}
    // In each object, title, subtitle, description may be undefined.
    // The array may not contain all localeId in locales

    return (
      <ul>
        {rows}
        {/*
        For each locale I need: title, subtitle and description inputs
        each input needs an onInput handler: add the change to existingTranslations and call onChange callback
        */}
      </ul>
    )
  }
})

export default TranslationsInputs
