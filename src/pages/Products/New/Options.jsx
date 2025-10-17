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

const AddButton = styled.button`
  text-align: unset;
  cursor: pointer;
  padding-top: .5725rem;
  padding-bottom: .5725rem;
  padding-right: 1.125rem;
  padding-left: 1.125rem;
  background-color: unset;
  border-radius: .3125rem;
  transition: background-color 0.2s;
  
  &:hover{
    background-color: ${p => p.theme.neutral20};
  }

  &:disabled{
    color: ${p => p.theme.neutral80};
    background-color: ${p => p.theme.neutral20};
  }
`

const Preview = component(({ option }) => {
  const { title, values } = option

  const valuesPreview = []
  for (let i = 0, len = values.length; i < len; i++) {
    const value = values[i]
    const { name } = value
    valuesPreview.push(<span key={name}>{name}</span>)
  }

  return (
    <div>
      <span>{title}</span>
      {valuesPreview}
    </div>
  )
})

const OptionsPreview = component(({ options }) => {
  if (detectIsUndefined(options)) {
    return
  }

  const optionsPreview = []
  for (let i = 0, len = options.length; i < len; i++) {
    const option = options[i]
    const { id } = option
    optionsPreview.push(<Preview key={id} />)
  }

  return optionsPreview
})

const AddOption = component(({ buttonText, onAdd }) => {
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

  const handleDelete = () => {
    const initialData = getInitialData()
    setOptionData(initialData)
    setIsOpen(false)
  }

  const handleSave = () => {
    onAdd(optionData)
    handleDelete()
  }
  console.log(optionData)

  if (storeData && isOpen) {
    return (
      <ProductOptionEdit
        option={optionData}
        saveOption={handleSave}
        deleteOption={handleDelete}
      />
    )
  }

  return (
    <AddButton
      type='button'
      disabled={isOpen}
      onClick={handleOpen}
    >{buttonText}
    </AddButton>
  )
})

const Options = component(({ options, onChange }) => {
  const { t } = useTranslation('productsNew.options')

  const handleChange = (newOptions) => {
    onChange(newOptions)
  }

  const handleAdd = (newOption) => {
    const newOptions = { ...options, newOption }
    onChange(newOptions)
  }

  let buttonText = t('addFromSome')
  if (detectIsUndefined(options)) {
    buttonText = t('addFromZero')
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />

      <OptionsPreview options={options} />

      <AddOption buttonText={buttonText} onAdd={handleAdd} />
    </CardDefault>
  )
})

export default Options
