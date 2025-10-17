import {
  component,
  detectIsArray,
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
  useProductOptionDeleteMutation,
  useProductOptionCreateMutation,
  useProductOptionUpdateMutation
} from '../../../data'
import If from '../../../components/If'
import ModalDefault from '../../../components/modals/ModalDefault'
import ModalHeader from '../../../components/modals/ModalHeader'
import ModalBody from '../../../components/modals/ModalBody'

const OptionTranslation = component(({ locale, onInput, onBlur, value, handleDelete }) => {
  const { t, translator } = useTranslation('product.editOptions.optionTranslation')
  const { id, code } = locale
  const handleLabelClick = (e) => {
    e.preventDefault()
  }

  return (
    <label onClick={handleLabelClick}>
      {translator.formatName(code, { type: 'language' })}
      <input
        type='text'
        placeholder='color'
        data-locale-id={id}
        onInput={onInput}
        onBlur={onBlur}
        value={value}
      />
      <button
        type='button'
        data-locale-id={id}
        onClick={handleDelete}
      >{t('delete')}
      </button>
    </label>
  )
})

const NewOption = component(({ productId, handleCloseNewOption }) => {
  const { t } = useTranslation('product.newOption')
  const { data: storeData, isFetching: storeIsFetching, error: storeError } = useStore()
  const { defaultLocaleId, locales } = storeData.store
  const [optionTitleTranslations, setOptionTitleTranslations] = useState({ [defaultLocaleId]: '' })
  const [createOption, { error: createOptionError }] = useProductOptionCreateMutation(productId)

  const handleInput = (e) => {
    const localeId = e.target.dataset.localeId
    setOptionTitleTranslations((prevState) => {
      const newState = { ...prevState }
      newState[localeId] = e.target.value
      return newState
    })
  }

  const handleDeleteTranslation = (e) => {
    const localeId = e.target.dataset.localeId
    setOptionTitleTranslations((prevState) => {
      const newState = { ...prevState }
      delete newState[localeId]
      return newState
    })
  }

  const handleCreate = () => {
    const translations = []
    const localeIds = keys(optionTitleTranslations)
    for (let i = 0, len = localeIds.length; i < len; i++) {
      const localeId = localeIds[i]
      const title = optionTitleTranslations[localeId]
      translations.push({ localeId, title })
    }
    createOption({ translations })
    handleCloseNewOption()
  }

  const titleTranslations = []
  for (let i = 0, len = locales.length; i < len; i++) {
    const locale = locales[i]
    if (locale.id === defaultLocaleId) {
      continue
    }

    titleTranslations.push(
      <OptionTranslation
        locale={locale}
        onInput={handleInput}
        value={optionTitleTranslations[locale.id]}
        handleDelete={handleDeleteTranslation}
      />
    )
  }

  if (storeData) {
    return (
      <fieldset>
        <legend>{t('title')}</legend>
        <input
          type='text'
          placeholder='color'
          data-locale-id={defaultLocaleId}
          onInput={handleInput}
          value={optionTitleTranslations[defaultLocaleId]}
          required
        />
        <button type='button' onClick={handleCreate}>{t('create')}</button>
        <If condition={titleTranslations.length > 0}>
          <fieldset>
            <legend>{t('translations')}</legend>
            {titleTranslations}
          </fieldset>
        </If>
      </fieldset>
    )
  }

  return null
})

const EditableOption = component(({ productId, option }) => {
  const { t } = useTranslation('product.editableOption')
  const { id, translations } = option
  const { data: storeData, isFetching: storeIsFetching, error: storeError } = useStore()
  const { defaultLocaleId, locales } = storeData.store
  const [optionTitleTranslations, setOptionTitleTranslations] = useState({ [defaultLocaleId]: '' })
  const [updateOption, { error: updateOptionError }] = useProductOptionUpdateMutation(productId)
  const [deleteOption, { error: deleteOptionError }] = useProductOptionDeleteMutation(productId)

  useEffect(() => {
    const initialState = {}
    for (let i = 0, len = translations.length; i < len; i++) {
      const translation = translations[i]
      const { localeId, title } = translation
      initialState[localeId] = title
    }
    setOptionTitleTranslations(initialState)
  }, [option])

  const handleInput = (e) => {
    const localeId = e.target.dataset.localeId
    setOptionTitleTranslations((prevState) => {
      const newState = { ...prevState }
      newState[localeId] = e.target.value
      return newState
    })
  }

  const getTranslationsArray = (translationsMap) => {
    const translations = []
    const localeIds = keys(translationsMap)
    for (let i = 0, len = localeIds.length; i < len; i++) {
      const localeId = localeIds[i]
      const title = translationsMap[localeId]
      translations.push({ localeId, title })
    }
    return translations
  }

  const handleUpdate = () => {
    const translations = getTranslationsArray(optionTitleTranslations)
    updateOption(id, { translations })
  }

  const handleDeleteTranslation = (e) => {
    const localeId = e.target.dataset.localeId
    const translationsMap = { ...optionTitleTranslations }
    delete translationsMap[localeId]
    const translations = getTranslationsArray(translationsMap)
    updateOption(id, { translations })
  }

  const handleDeleteOption = () => {
    deleteOption(id)
  }

  const titleTranslations = []
  for (let i = 0, len = locales.length; i < len; i++) {
    const locale = locales[i]
    if (locale.id === defaultLocaleId) {
      continue
    }

    titleTranslations.push(
      <OptionTranslation
        locale={locale}
        onInput={handleInput}
        onBlur={handleUpdate}
        value={optionTitleTranslations[locale.id]}
        handleDelete={handleDeleteTranslation}
      />
    )
  }

  return (
    <fieldset>
      <legend>{t('title')}</legend>
      <input
        type='text'
        placeholder={optionTitleTranslations[defaultLocaleId]}
        data-locale-id={defaultLocaleId}
        onInput={handleInput}
        onBlur={handleUpdate}
        value={optionTitleTranslations[defaultLocaleId]}
        required
      />
      <If condition={titleTranslations.length > 0}>
        <fieldset>
          <legend>{t('translations')}</legend>
          {titleTranslations}
        </fieldset>
      </If>
      <button type='button' onClick={handleDeleteOption}>{t('delete')}</button>
    </fieldset>
  )
})

// Apply each change independently: each change happens in its own transaction.
// Applying all changes at once could result in some changes failing and some succeeding.
// This partial-success would result in poor UX.
const ProductOptions = component(({ productId }) => {
  const { t } = useTranslation('product.productOptions')
  const { data: productData } = useProductById(productId)

  const [showNewOption, setShowNewOption] = useState(false)

  const handleShowNewOption = () => {
    return setShowNewOption(true)
  }

  const handleCloseNewOption = () => {
    return setShowNewOption(false)
  }

  if (productData) {
    const { options } = productData.product
    const editableOptions = []
    if (detectIsArray(options)) {
      for (let i = 0, len = options.length; i < len; i++) {
        const option = options[i]
        editableOptions.push(<EditableOption key={option.id} option={option} productId={productId} />
        )
      }
    }

    return (
      <div>
        {editableOptions}
        <If condition={!showNewOption}>
          <button type='button' onClick={handleShowNewOption}>{t('addOption')}</button>
        </If>
        <If condition={showNewOption}>
          <NewOption productId={productId} handleCloseNewOption={handleCloseNewOption} />
          <button type='button' onClick={handleCloseNewOption}>{t('removeOption')}</button>
        </If>
      </div>
    )
  }

  return null
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
      <ModalDefault ref={modalRef}>
        <ModalHeader title={t('title')} handleClose={handleCloseModal} />

        <ModalBody>
          <ProductOptions productId={productId} />
        </ModalBody>

      </ModalDefault>
    </>
  )
})

export default EditOptions
