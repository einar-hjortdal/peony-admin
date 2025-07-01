import {
  component,
  detectIsNull,
  detectIsUndefined,
  useMemo,
  useRef,
  useState
} from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useStore, useProductById, useCreateProductOptionMutation } from '../data'
import Card from '../components/Card'
import Input from '../components/Input'

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
  const { data, translationsMap } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localeMap } = useStore()
  const { defaultLocaleId, locales } = storeData

  const defaultTranslation = translationsMap[defaultLocaleId]
  const res = []
  res.push(
    <TranslationGroup
      locale={localeMap[defaultLocaleId]}
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

    const translation = translationsMap[id]
    if (detectIsUndefined(translation)) {
      continue
    }

    res.push(
      <TranslationGroup
        locale={localeMap[id]}
        title={translation.title}
        subtitle={translation.subtitle}
        description={translation.description}
      />
    )
  }

  return res
})

const EditableOption = component(({ data }) => {
  if (detectIsUndefined(data)) {
    return (
      <div>
        <label>
          title
          <input type='text' placeholder='color' />
        </label>
      </div>
    )
  }
})

const EditableOptions = component(({ productId }) => {
  const { t } = useTranslation('product.editableOptions')
  const { data, isFetching, error } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localeMap } = useStore()
  const [createOption, {
    data: createOptionData,
    isFetching: createOptionIsFetching,
    error: createOptionError
  }] = useCreateProductOptionMutation(productId)
  // show the list of options that already exist
  // require one title in defaultLocaleId for each option
  // allow modification of options title (translations)
  // delete option button
  // always show create option input (or show on click?)

  const { options } = data
  if (detectIsUndefined(options)) {
    const handleCreateOption = (e) => {
      e.preventDefault()
      console.log(e.target.elements.title.value)
    }
    return (
      <div>
        <form onSubmit={handleCreateOption}>
          <label>
            {t('createOption')}
            <input
              type='text'
              name='title'
              placeholder={t('placeholder')}
              required
            />
          </label>
          <button
            type='submit'
            disabled={createOptionIsFetching}
          >create
          </button>
        </form>
      </div>
    )
  }

  const editableOptions = []
  for (let i = 0, len = options.length; i < len; i++) {
    editableOptions.push(<EditableOption data={options[i]} />)
  }
  return (<>{editableOptions}</>)
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
