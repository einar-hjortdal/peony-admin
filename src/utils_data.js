export const totalPages = (count, fetched) => {
  return Math.ceil(count / fetched)
}

export const currentPage = (offset, fetched) => {
  return Math.floor(offset / fetched) + 1
}
