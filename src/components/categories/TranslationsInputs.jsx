import { component, detectIsUndefined, keys } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'
import TranslationInputGroup from './TranslationInputs'
import PrimaryButton from '../buttons/PrimaryButton'

// Renders nothing if store.locales.length === 1
const TranslationsInputs = component(({ translations, onChange }) => {
  const { data: storeData } = useStore()
  const { t, translator } = useTranslation('categories.translationsInputs')

  const handleChange = (newTranslations) => {
    const localeIds = keys(newTranslations)
    if (localeIds.length === 0) {
      return onChange({})
    }

    // eliminate empty translations
    const cleanedTranslations = {}
    for (let i = 0, len = localeIds.length; i < len; i++) {
      const localeId = localeIds[i]
      const newTranslation = newTranslations[localeId]
      const { name, description } = newTranslation
      if (detectIsUndefined(name) && detectIsUndefined(description)) {
        continue
      }
      cleanedTranslations[localeId] = newTranslation
    }
    onChange(cleanedTranslations)
  }

  const handleDelete = (localeId) => {
    const newTranslations = { ...translations }
    delete newTranslations[localeId]
    onChange(newTranslations)
  }

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

          <div>
            <TranslationInputGroup
              localeId={id}
              translations={translations}
              onChange={handleChange}
            />
          </div>

          <div>
            <PrimaryButton onClick={handleDelete}>{t('delete')}</PrimaryButton>
          </div>
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
