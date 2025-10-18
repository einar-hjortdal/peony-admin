import { component, detectIsUndefined, useEffect, useState } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import CardDefault from '../../../components/cards/CardDefault'
import CardHeader from '../../../components/cards/CardHeader'
import ButtonMore from '../../../components/buttons/ButtonMore'
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import If from '../../../components/If'
import { useStore } from '../../../data'
import ProductOptionEdit from '../../../components/products/ProductOptionEdit'
import { getTranslation } from '../../../utils'

const OptionContainer = styled.div`

`

const OptionTitle = styled.span`
  font-weight: 700;
`

const OptionValuesContainer = styled.div``

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

// TODO preview non-default translations
const OptionsPreview = component(({ options }) => {
  const { data: storeData } = useStore()

  if (options && storeData) {
    const { defaultLocaleId } = storeData.store

    const optionsPreview = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      const { values, translations } = option
      const translation = getTranslation(translations, defaultLocaleId).translation
      const title = translation.title
      optionsPreview.push(
        <OptionContainer>
          <OptionTitle>{title}</OptionTitle>
          <OptionValuesContainer>
            <OptionValuesPreview values={values} />
          </OptionValuesContainer>
        </OptionContainer>
      )
    }
    return optionsPreview
  }
})

const AddOption = component(({ onAdd, slot }) => {
  const { data: storeData } = useStore()
  const [isOpen, setIsOpen] = useState(false)
  const [optionData, setOptionData] = useState({})

  const getInitialData = () => {
    if (storeData) {
      const { defaultLocaleId } = storeData.store
      return {
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
        saveOption={handleSave}
        deleteOption={handleCancel}
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

const Options = component(({ options, onChange }) => {
  const { t } = useTranslation('productsNew.options')

  const handleChange = (newOptions) => {
    onChange(newOptions)
  }

  const handleAdd = (newOption) => {
    if (detectIsUndefined(options)) {
      return onChange([newOption])
    }
    return onChange([...options, newOption])
  }

  let buttonText = t('addFromSome')
  if (detectIsUndefined(options)) {
    buttonText = t('addFromZero')
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <OptionsPreview options={options} onChange={handleChange} />

      <AddOption onAdd={handleAdd}>{buttonText}</AddOption>
    </CardDefault>
  )
})

export default Options
