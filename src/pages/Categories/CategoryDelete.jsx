import { component } from '@dark-engine/core'

import { useProductCategoryDeleteMutation } from '../../data'

const CategoryDelete = component(({ id }) => {
  const [deleteCategory, { isFetching }] = useProductCategoryDeleteMutation(id)

  const handleDelete = () => {
    deleteCategory(id)
  }

  return (
    <button type='text' onClick={handleDelete} disabled={isFetching}>delete</button>
  )
})

export default CategoryDelete
