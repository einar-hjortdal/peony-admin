import { detectIsEmpty } from '@dark-engine/core'

import { languages } from './languages.js'

export const defaultLanguage = languages[0]

// TODO store preferences for each user
export const loadLanguage = () => {
  const preference = localStorage.getItem('language')
  if (detectIsEmpty(preference)) {
    localStorage.setItem('language', defaultLanguage)
    return defaultLanguage
  }
  return preference
}

export const changeLanguage = (newLanguage) => {
  localStorage.setItem('language', newLanguage)
}

export const isDefaultLanguage = (language) => {
  return language === defaultLanguage
}

export const isSupportedLanguage = (language) => {
  for (let i = 0, len = languages.length; i < len; i++) {
    const supportedLanguage = languages[i]
    if (supportedLanguage === language) {
      return true
    }
  }
  return false
}

export const isAlternateLanguage = (language) => {
  for (let i = 1, len = languages.length; i < len; i++) {
    const alternateLanguage = languages[i]
    if (alternateLanguage === language) {
      return true
    }
  }
  return false
}

// Note: string literals are used so that Bun can import these files as assets.
// Otherwise a function for the server must be created and messages should be kept in the `public` directory.
export const getMessages = async (lang) => {
  // if (lang === 'nl') {
  //   const messages = await import('./messages/nl.js')
  //   return messages.default
  // }

  // fallback language
  const messages = await import('./messages/en.js')
  return messages.default
}

export const dynamicMessagesLoading = async (translatorInstance, newLanguage) => {
  const { changeLanguage, localeData } = translatorInstance
  // do not load anything if locale data was already loaded.
  for (let i = 0, len = localeData.length; i < len; i++) {
    if (localeData[i].language === newLanguage) {
      changeLanguage(newLanguage)
      return
    }
  }

  const messages = await getMessages(newLanguage)
  changeLanguage(newLanguage, messages)
}

export const getDefaultTranslation = (translations, defaultLocaleId) => {
  for (let i = 0, len = translations.length; i < len; i++) {
    if (translations[i].localeId === defaultLocaleId) {
      return translations[i]
    }
  }
  return null
}
