import { formatErrorMsg } from '@dark-engine/core'

const lib = 'peony-admin'

export const formatError = (errorMsg) => formatErrorMsg(errorMsg, lib)

export const throwError = (errorMsg) => {
  throw new Error(formatError(errorMsg))
}
