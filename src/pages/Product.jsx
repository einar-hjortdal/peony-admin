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
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useStore, useProductById, useUpdateProductMutation } from '../data'
import Card from '../components/Card'

const TranslationGroup = component(({ locale, title, subtitle, description }) => {
  const { t, translator } = useTranslation('product.translationGroup')
  const formatLine = (v) => {
    if (detectIsUndefined(v)) {
      return '-'
    }
    return v
  }

  return (
    <div>
      {t('locale')}: {locale} <span>{translator.formatName(locale, { type: 'language' })}</span>
      <div>
        {t('title')}: {formatLine(title)}
      </div>
      <div>
        {t('subtitle')}: {formatLine(subtitle)}
      </div>
      <div>
        {t('description')}: {formatLine(description)}
      </div>
    </div>
  )
})

const Translations = component(({ productId }) => {
  const { t } = useTranslation('product.translation')
  const { data, translationsObject } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()
  const { defaultLocaleId, locales } = storeData

  const defaultTranslation = translationsObject[defaultLocaleId]
  const res = []
  res.push(
    <TranslationGroup
      locale={localesObject[defaultLocaleId]}
      title={defaultTranslation.title}
      subtitle={defaultTranslation.subtitle}
      description={defaultTranslation.description}
    />
  )

  for (let i = 0, len = locales.length; i < len; i++) {
    const { id } = locales[i]
    if (defaultLocaleId === id) {
      continue
    }

    const translation = translationsObject[id]
    if (detectIsUndefined(translation)) {
      continue
    }

    res.push(
      <TranslationGroup
        locale={localesObject[id]}
        title={translation.title}
        subtitle={translation.subtitle}
        description={translation.description}
      />
    )
  }

  return res
})

const EditableOption = component(({ index, option, handleInput, handleDeleteOption }) => {
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()
  const { defaultLocaleId } = storeData
  const { translations } = option
  const defaultTranslation = translations[defaultLocaleId]
  let defaultTranslationTitle
  if (defaultTranslation) {
    defaultTranslationTitle = defaultTranslation.title
  }

  return (
    <fieldset>
      <label>
        title
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
      <button type='button' data-index={index} onClick={handleDeleteOption}>delete</button>
      {/* TODO handle other languages */}
    </fieldset>
  )
})

const EditableOptions = component(({ productId }) => {
  const { t } = useTranslation('product.editableOptions')
  const { data, isFetching, error } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()
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
      <form onSubmit={handleSubmit}>
        {editableOptions}
        <button type='button' onClick={handleAddOption}>{t('addOption')}</button>
        <button
          type='submit'
        >save changes
        </button>
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
        <div>
          <button type='button' onClick={handleCloseModal}>x</button>
        </div>
        <div>
          <EditableOptions productId={productId} />
        </div>
      </dialog>
    </>
  )
})

const Options = component(({ productId, slot }) => {
  const { t } = useTranslation('product.options')
  const { data, isFetching, error } = useProductById(productId)

  if (data) {
    const options = { data }
    // TODO list options
    return (
      <div>
        {t('options')}
        {slot}
      </div>
    )
  }
})

const Product = component(() => {
  const { t, translator } = useTranslation('product')
  const params = useParams()
  const productId = params.get('id')
  const { data, isFetching, error } = useProductById(productId)

  // display data and allow updating
  // display variants as a table (title, sku ean), buttons: add, edit prices, edit variants, edit options
  // display attributes from variant with rank 0
  // check database changes when adding prices
  if (data) {
    return (
      <>
        <Card>
          <div>
            {t('details')}
            <Translations productId={productId} />
            {/* <div>
              {t('type')}
            </div>
            <div>
              {t('collection')}
            </div>
            <div>
              {t('category')}
            </div> */}
            <div>
              {t('discountable')}: {String(data.discountable)}
            </div>
            <div>
              {t('salesChannels')}
            </div>
          </div>
          <div>
            {t('translations')}
            <div>
              TODO component
            </div>
          </div>
        </Card>
        <Card>
          <div>
            {t('variants')}
            <Options productId={productId}>
              <EditOptions productId={productId} />
            </Options>
          </div>
        </Card>
      </>
    )
  }
})

export default Product
