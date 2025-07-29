import {
  component,
  detectIsNull,
  detectIsObject,
  detectIsString,
  detectIsUndefined,
  keys,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import {
  useStore,
  useProductById,
  useUpdateProductMutation
} from '../../data'

const EditableOption = component(({ index, option, handleInput, handleDeleteOption }) => {
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()
  const { defaultLocaleId } = storeData.store
  const { translations } = option

  const defaultTranslation = translations[defaultLocaleId]
  let defaultTranslationTitle
  if (defaultTranslation) {
    defaultTranslationTitle = defaultTranslation.title
  }

  return (
    <fieldset>
      <legend>title</legend>
      <label>
        TODO label with default locale.code
        <input
          type='text'
          placeholder='color'
          data-locale-id={defaultLocaleId}
          data-index={index}
          onInput={handleInput}
          value={defaultTranslationTitle}
          required
        />
      </label>
      {/* TODO handle other translations */}
      <button type='button' data-index={index} onClick={handleDeleteOption}>delete</button>
    </fieldset>
  )
})

const EditableOptions = component(({ productId }) => {
  const { t } = useTranslation('product.editableOptions')
  const { data, isFetching, error } = useProductById(productId)
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError, localesObject
  } = useStore()
  const [updateProduct, {
    data: updateProductData,
    isFetching: updateProductIsFetching,
    error: updateProductError
  }] = useUpdateProductMutation(productId)

  const [options, setOptions] = useState([])
  useEffect(() => {
    if (detectIsUndefined(data.options)) {
      return setOptions([])
    }

    const newOptions = []
    for (let i = 0, len = data.options.length; i < len; i++) {
      const { id, translations } = data.options[i]
      const translationsObject = {}
      for (let j = 0, len = translations.length; j < len; j++) {
        const { localeId, title } = translations[j]
        translationsObject[localeId] = { title }
      }
      newOptions.push({ id, translations: translationsObject })
    }
    return setOptions([...newOptions])
  }, [data])

  const handleInput = (e) => {
    const { index, localeId } = e.target.dataset
    const { value } = e.target
    const newOptions = [...options]
    const newOption = { ...newOptions[index] }
    let newTranslations = {}
    if (detectIsObject(newOption.newTranslations)) {
      newTranslations = { ...newOption.newTranslations }
    }

    if (detectIsObject(newTranslations[localeId])) {
      newTranslations[localeId].title = value
    } else {
      newTranslations[localeId] = { title: value }
    }

    newOption.translations = newTranslations
    newOptions[index] = newOption
    return setOptions(newOptions)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const updatedOptions = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = {}
      const { id, translations } = options[i]
      if (detectIsString(id)) {
        option.id = id
      }
      option.translations = []
      const localeIds = keys(translations)
      for (let k = 0, len = localeIds.length; k < len; k++) {
        const localeId = localeIds[k]
        const { title } = translations[localeId]
        option.translations.push({ localeId, title })
      }
      updatedOptions.push(option)
    }
    const data = { options: updatedOptions }
    updateProduct(data)
  }

  const handleAddOption = (e) => {
    return setOptions([...options, {
      translations: [{ localeId: storeData.defaultLocaleId }]
    }])
  }

  const handleDeleteOption = (e) => {
    const { index } = e.target.dataset
    return setOptions([
      ...options.slice(0, index),
      ...options.slice(index + 1)
    ])
  }

  const editableOptions = []
  for (let i = 0, len = options.length; i < len; i++) {
    const option = options[i]
    editableOptions.push(
      <EditableOption
        key={i}
        index={i}
        handleInput={handleInput}
        handleDeleteOption={handleDeleteOption}
        option={option}
      />
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} disabled={updateProductIsFetching}>
        {editableOptions}
        <button type='button' onClick={handleAddOption}>{t('addOption')}</button>
        <button type='submit'>save changes</button>
      </form>
    </div>
  )
})

const EditOptions = component(({ productId }) => {
  const { t } = useTranslation('product.editOptions')
  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }
    modalRef.current.showModal()
  }

  const handleCloseModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }
    modalRef.current.close()
  }

  return (
    <>
      <button type='button' onClick={handleOpenModal}>{t('edit')}</button>
      <dialog ref={modalRef}>
        <button type='button' onClick={handleCloseModal}>x</button>
        <div>
          <EditableOptions productId={productId} />
        </div>
      </dialog>
    </>
  )
})

export default EditOptions
