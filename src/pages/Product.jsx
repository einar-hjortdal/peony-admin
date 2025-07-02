import {
  component,
  detectIsNull,
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
  const [translations, setTranslations] = useState({})
  useEffect(() => {
    const newTranslations = {}
    for (let i = 0, len = option.translations.length; i < len; i++) {
      const translation = option.translations[i]
      newTranslations[translation.localeId] = translation
    }
    setTranslations(newTranslations)
  }, [option])

  return (
    <fieldset>
      <label>
        title
        <input
          type='text'
          placeholder='color'
          data-locale-id={storeData.defaultLocaleId}
          data-index={index}
          onInput={(e) => handleInput(e, translations)}
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
    return setOptions([...data.options])
  }, [data])

  const handleInput = (e, translations) => {
    // TODO converting translations from array to map and back at every input is dumb
    // make conversion persist until submission instead
    const { value } = e.target
    const { index, localeId } = e.target.dataset
    const editedOption = options[index]
    const newTranslations = { ...translations }
    newTranslations[localeId].title = value
    const translationsKeys = keys(newTranslations)
    const newTranslationsArray = []
    for (let i = 0, len = translationsKeys.length; i < len; i++) {
      const k = translationsKeys[i]
      newTranslationsArray.push(translations[k])
    }
    editedOption.translations = newTranslationsArray
    setOptions([
      ...options.slice(0, index),
      editedOption,
      ...options.slice(index + 1)
    ])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(options)
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
