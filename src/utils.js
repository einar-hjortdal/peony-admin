import { detectIsEmpty, detectIsUndefined, formatErrorMsg } from '@dark-engine/core'
import { detectIsBrowser } from '@dark-engine/platform-browser'

const lib = 'peony-admin'

export const formatError = (errorMsg) => formatErrorMsg(errorMsg, lib)

export const throwError = (errorMsg) => {
  throw new Error(formatError(errorMsg))
}

export const getPrefersReducedMotion = () => {
  if (detectIsBrowser()) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  return true
}

export const totalPages = (count, fetched) => {
  return Math.ceil(count / fetched)
}

export const currentPage = (offset, fetched) => {
  return Math.floor(offset / fetched) + 1
}

export const valueOrDefault = (providedValue, defaultValue) => {
  if (detectIsEmpty(providedValue)) {
    return defaultValue
  }
  return providedValue
}

export const formatLine = (v) => {
  if (detectIsUndefined(v)) {
    return '-'
  }
  return v
}

export const getTranslation = (translations, localeId) => {
  for (let i = 0, len = translations.length; i < len; i++) {
    if (translations[i].localeId === localeId) {
      return {
        translation: translations[i],
        index: i
      }
    }
  }
}
