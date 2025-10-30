import { component } from '@dark-engine/core'

import { useProductOptions } from '../../../data'

const OptionSelect = component((option) => {
  const { values } = option

  const selectOptions = []
  for (let i = 0, len = values.length; i < len; i++) {
    const value = values[i]
    const { id, name } = value
    selectOptions.push(<option key={id} value={id}>{name}</option>)
  }

  return (
    <select>
      {selectOptions}
    </select>
  )
})

// This component will not be shown when there exists only one option with only one value.
// This component could get the whole product, so that it could immediately check if a variant already
// exists with the selected option values.
// This can be handled by the parent component instead, or just by the server on submission.
const OptionValues = component(({ productId, variantData, onChange }) => {
  const { data: optionsData } = useProductOptions(productId)
  if (optionsData) {
    const { options } = optionsData
    if (options.length === 1 && options[0].values.length === 1) {
      return null
    }

    const selectComponents = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      const { id } = option
      selectComponents.push(<OptionSelect key={id} productOption={option} />)
    }
    return selectComponents
  }
})

export default OptionValues
