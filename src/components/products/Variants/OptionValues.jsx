import { component, keys, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useProductOptions } from '../../../data'
import PrimaryButton from '../../buttons/PrimaryButton'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'

const OptionSelect = component(({ optionId, optionTitle, values, selected, onChange, disabled }) => {
  const selectOptions = []
  for (let i = 0, len = values.length; i < len; i++) {
    const value = values[i]
    const { id, name } = value
    selectOptions.push(<option key={id} value={id}>{name}</option>)
  }

  const handleChange = (e) => {
    const { value } = e.target
    onChange(optionId, value)
  }

  return (
    <select
      defaultValue={selected}
      aria-label={optionTitle}
      onChange={handleChange}
      disabled={disabled}
    >{selectOptions}
    </select>
  )
})

// This component will not be shown when there exists only one option with only one value.
// This component could get the whole product, so that it could immediately check if a variant already
// exists with the selected option values.
// This can be handled by the parent component instead, or just by the server on submission.
const OptionValues = component(({ productId, optionValues, onChange, disabled }) => {
  const { t } = useTranslation('variants.optionValues')
  const { data: optionsData } = useProductOptions(productId)

  // transform array to map optionId -> {title: string, values: [], selected: string}
  const [optionsMap, setOptionsMap] = useState({})
  useEffect(() => {
    if (optionsData) {
      const { options } = optionsData

      // build map
      const newOptionsMap = {}
      for (let i = 0, len = options.length; i < len; i++) {
        const option = options[i]
        const { id, title, values } = option
        newOptionsMap[id] = { title, values }
      }

      // mark selected
      for (let i = 0, len = optionValues.length; i < len; i++) {
        const optionValue = optionValues[i]
        const { id, optionId } = optionValue
        newOptionsMap[optionId].selected = id
      }

      setOptionsMap(newOptionsMap)
    }
  }, [productId, optionValues, optionsData])

  const handleChange = (optionId, selected) => {
    setOptionsMap((prevState) => {
      const newOptionsMap = { ...prevState }
      newOptionsMap[optionId].selected = selected
      return newOptionsMap
    })
  }

  const handleSave = () => {
    // transform map to array of ids and call onChange
    const optionValueIds = []
    const optionsMapKeys = keys(optionsMap)
    for (let i = 0, len = optionsMapKeys.length; i < len; i++) {
      const optionId = optionsMapKeys[i]
      const optionValueId = optionsMap[optionId].selected
      optionValueIds.push(optionValueId)
    }
    onChange(optionValueIds)
  }

  if (optionsData) {
    const { options } = optionsData
    if (options.length === 1 && options[0].values.length === 1) {
      return null
    }

    const selectComponents = []
    const optionsMapKeys = keys(optionsMap)
    for (let i = 0, len = optionsMapKeys.length; i < len; i++) {
      const optionId = optionsMapKeys[i]
      const { title, values, selected } = optionsMap[optionId]
      selectComponents.push(
        <OptionSelect
          key={optionId}
          optionId={optionId}
          optionTitle={title}
          values={values}
          selected={selected}
          onChange={handleChange}
          disabled={disabled}
        />
      )
    }
    return (
      <CardDefault>
        <CardHeader title={t('identification')} />

        {selectComponents}

        <div>
          <PrimaryButton
            type='button'
            onClick={handleSave}
            disabled={disabled}
          >{t('save')}
          </PrimaryButton>
        </div>
      </CardDefault>
    )
  }
})

export default OptionValues
