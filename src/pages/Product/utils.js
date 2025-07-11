import { detectIsUndefined } from '@dark-engine/core'

export const formatLine = (v) => {
  if (detectIsUndefined(v)) {
    return '-'
  }
  return v
}
