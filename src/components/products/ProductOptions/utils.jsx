export const productOptionTitleLength = 63
export const productOptionValueNameLength = 63

export const getCreationId = () => {
  return Date.now() + Math.floor(Math.random() * 10000)
}
