export const getTranslation = (translations, localeId) => {
  for (let i = 0, len = translations.length; i < len; i++) {
    const translation = translations[i]
    if (translation.localeId === localeId) {
      return { index: i, translation }
    }
  }
  // returns undefined if the translations array does not contain the translation with localeId
}
