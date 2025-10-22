import { component, detectIsUndefined, useEffect, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../../data'
import { getTranslation } from '../../../utils'
import ProductOptionEdit from './ProductOptionEdit'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import PrimaryButton from '../../buttons/PrimaryButton'

const OptionTitle = styled.span`
  font-weight: 700;
`

// TODO preview non-default translations
const OptionValuesPreview = component(({ values }) => {
  const { data: storeData } = useStore()

  if (storeData) {
    const { defaultLocaleId } = storeData.store
    const valuesPreview = []
    for (let i = 0, len = values.length; i < len; i++) {
      const value = values[i]
      const { translations } = value
      const translation = getTranslation(translations, defaultLocaleId).translation
      const name = translation.name
      valuesPreview.push(<span key={name}>{name}</span>)
    }
    return valuesPreview
  }
})

const LeftListItem = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const RightListItem = styled.div`
  display: inline-block;
  vertical-align: middle;
`

const Option = component(({ option, onOptionUpdate, onOptionDelete }) => {
  const { t } = useTranslation('productOptions')
  const { data: storeData } = useStore()
  const [isEditing, setIsEditing] = useState(false)

  const handleStartEditing = () => {
    setIsEditing(true)
  }

  const handleStopEditing = () => {
    setIsEditing(false)
  }

  const handleUpdate = (optionUpdated) => {
    onOptionUpdate(optionUpdated)
    handleStopEditing()
  }

  const handleDelete = (optionDeleted) => {
    onOptionDelete(optionDeleted)
    handleStopEditing()
  }

  if (storeData) {
    const { defaultLocaleId } = storeData.store
    const { values, translations } = option
    const translation = getTranslation(translations, defaultLocaleId).translation
    const title = translation.title

    if (isEditing) {
      return (
        <>
          <LeftListItem>
            <ProductOptionEdit
              option={option}
              onOptionUpdate={handleUpdate}
              onOptionDelete={handleDelete}
            />
          </LeftListItem>

          <RightListItem>
            <PrimaryButton
              type='button'
              onClick={handleStopEditing}
            >{t('cancel')}
            </PrimaryButton>
          </RightListItem>
        </>
      )
    }

    return (
      <>
        <LeftListItem>
          <OptionTitle>{title}</OptionTitle>
          <div>
            <OptionValuesPreview values={values} />
          </div>
        </LeftListItem>

        <RightListItem>
          <PrimaryButton
            type='button'
            onClick={handleStartEditing}
          >{t('edit')}
          </PrimaryButton>
        </RightListItem>
      </>
    )
  }
})

// TODO preview non-default translations
// TODO implement change logic (need component with internal state)
const AddOption = component(({ onAdd, slot }) => {
  const { data: storeData } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [optionData, setOptionData] = useState({})

  const getInitialData = () => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store
      return {
        creationId: Date.now(), // to identify changes to created options
        translations: [{ localeId: defaultLocaleId, title: '' }],
        values: [{ translations: [{ localeId: defaultLocaleId, name: '' }] }]
      }
    }
  }

  useEffect(() => {
    const initialData = getInitialData()
    if (initialData) {
      setOptionData(initialData)
    }
  }, [storeData])

  const handleOpen = () => {
    setIsOpen(!isOpen)
  }

  const handleCancel = () => {
    const initialData = getInitialData()
    setOptionData(initialData)
    setIsOpen(false)
  }

  const handleSave = (newOptionData) => {
    onAdd(newOptionData)
    handleCancel()
  }

  if (storeData && isOpen) {
    return (
      <ProductOptionEdit
        option={optionData}
        onOptionUpdate={handleSave}
        onOptionDelete={handleCancel}
      />
    )
  }

  return (
    <PrimaryButton
      type='button'
      disabled={isOpen}
      onClick={handleOpen}
    >{slot}
    </PrimaryButton>
  )
})

// Manages product options for both new product creation (options = undefined)
// and existing product editing (options = array).
//
// PROP: options
// - The current list of product options. Be prepared to handle 'undefined'
//   for a newly created product.
//
// PROP: onChange(payload)
// - Callback called on any change (add, edit, delete).
// - PAYLOAD always contains the FULL, updated 'options' array.
// - PAYLOAD also contains ONE change object: e.g., 'optionCreated',
//   'optionUpdated', 'optionDeleted', 'optionValueCreated', etc., depending on the action.
const ProductOptions = component(({ options, onChange }) => {
  const { t } = useTranslation('productOptions')

  const handleOptionCreate = (optionCreated) => {
    if (detectIsUndefined(options)) {
      return onChange({
        options: [optionCreated],
        optionCreated
      })
    }

    return onChange({
      options: [...options, optionCreated],
      optionCreated
    })
  }

  const getChangedId = (changedOption) => {
    const { id, creationId } = changedOption
    if (id) {
      return id
    }
    return creationId
  }

  const findOptionIndex = (id) => {
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      if (option.id === id || option.creationId === id) {
        return i
      }
    }
  }

  const handleOptionUpdate = (optionChanged) => {
    const id = getChangedId(optionChanged)
    const index = findOptionIndex(id)
    const newOptions = [...options]
    newOptions[index] = optionChanged
    return onChange({
      options: newOptions,
      optionChanged
    })
  }

  const handleOptionDelete = (optionDeleted) => {
    return onChange({ options, optionDeleted })
  }

  const handleOptionValueCreate = () => {

  }

  const handleOptionValueUpdate = () => {

  }

  const handleOptionValueDelete = () => {

  }

  let buttonText = t('addFromSome')
  if (detectIsUndefined(options)) {
    buttonText = t('addFromZero')
  }

  const optionListItems = []
  if (options) {
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      optionListItems.push(
        <li>
          <Option
            option={option}
            onOptionUpdate={handleOptionUpdate}
            onOptionDelete={handleOptionDelete}
          />
        </li>
      )
    }
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <ul>
        {optionListItems}
      </ul>

      <AddOption onAdd={handleOptionCreate}>{buttonText}</AddOption>
    </CardDefault>
  )
})

export default ProductOptions
