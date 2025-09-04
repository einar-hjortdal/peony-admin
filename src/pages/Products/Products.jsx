import {
  component,
  useState,
  useRef,
  detectIsNull,
  keys,
  hasKeys,
  detectIsEmpty,
  useEffect
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { styled } from '@dark-engine/styled'
import { detectIsEmptyString } from '@wareme/utils'

import Card from '../../components/Card'
import Dialog from '../../components/Dialog'
import Button from '../../components/Button'
import AccordionItem from '../../components/AccordionItem'
import Input from '../../components/Input'
import Switch from '../../components/Switch'
import If from '../../components/If'
import Table from './Table'
import {
  constants,
  useProducts,
  useProductCreateMutation,
  useStore,
  useUpdateProductMutation,
  useDeleteProductMutation
} from '../../data'
import { getDefaultTranslation } from '../../translations'
import { valueOrDefault } from '../../utils'
import { Link } from '@dark-engine/web-router'

const NewProductBody = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`

const Translation = component(({ localeId, localeCode, onInput, disabled }) => {
  const { t, translator } = useTranslation('newProduct')
  return (
    <fieldset disabled={disabled}>
      <legend>{translator.formatName(localeCode, { type: 'language' })}</legend>
      <Input
        name='title'
        data-locale-id={localeId}
        onInput={onInput}
      >{t('general.title')}
      </Input>
      <Input
        name='subtitle'
        data-locale-id={localeId}
        onInput={onInput}
      >{t('general.subtitle')}
      </Input>
      <Input
        name='description'
        data-locale-id={localeId}
        onInput={onInput}
      >{t('general.description')}
      </Input>
    </fieldset>
  )
})

const Translations = component(({ locales, defaultLocaleId, onInput, disabled }) => {
  const translations = []
  for (let i = 0, len = locales.length; i < len; i++) {
    const { id, code } = locales[i]
    if (id === defaultLocaleId) {
      continue
    }

    translations.push(
      <Translation
        key={id}
        localeId={id}
        localeCode={code}
        onInput={onInput}
        disabled={disabled}
      />
    )
  }
  return translations
})

const NewProduct = component(({ modalRef }) => {
  const { t } = useTranslation('newProduct')
  const formRef = useRef(null)
  const { isFetching: storeIsFetching, data: storeData, error: storeError } = useStore()

  const [productData, setProductData] = useState({ discountable: true })
  const [productTranslations, setProductTranslations] = useState({})

  const handleInput = (e) => {
    const { type, name, checked, value } = e.target
    if (type === 'checkbox') {
      return setProductData({ ...productData, [name]: checked })
    }

    if (type === 'text') {
      if (detectIsEmptyString(value)) {
        const { [name]: omitted, ...rest } = productData
        return setProductData(rest)
      }
      // TODO slugify handle
      return setProductData({ ...productData, [name]: value })
    }
  }

  const handleTranslationInput = (e) => {
    const { name, value } = e.target
    const { localeId } = e.target.dataset
    const newTranslations = { ...productTranslations }
    const newTranslation = { ...productTranslations[localeId] }

    if (detectIsEmptyString(value)) {
      delete newTranslation[name]
      if (hasKeys(newTranslation)) {
        return setProductTranslations({ ...newTranslations, [localeId]: { ...newTranslation } })
      }

      delete newTranslations[localeId]
      return setProductTranslations({ ...newTranslations })
    }

    return setProductTranslations({
      ...productTranslations,
      [localeId]: { ...productTranslations[localeId], [name]: value }
    })
  }

  const [createProduct, { isFetching, data, error }] = useProductCreateMutation()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isFetching) {
      return
    }

    const { status } = e.target.dataset
    const translations = []
    const localeIds = keys(productTranslations)
    for (let i = 0, len = localeIds.length; i < len; i++) {
      const localeId = localeIds[i]
      translations.push({
        localeId,
        ...productTranslations[localeId]
      })
    }
    const data = { ...productData, translations, status }
    console.log(data)
    createProduct(data)
  }

  const handleCloseModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }

    formRef.current.reset()
    setProductData({ discountable: true })
    setProductTranslations({})
    modalRef.current.close()
  }

  useEffect(() => {
    if (data) {
      handleCloseModal()
    }
  }, [data])

  if (storeIsFetching) {
    return null // TODO return skeleton
  }

  if (storeError) {
    return null // TODO handle error
  }

  if (error) {
    return null // TODO handle error
  }

  return (
    <Dialog ref={modalRef}>
      <form ref={formRef}>
        <Dialog.Header>
          <Dialog.Title>{t('title')}</Dialog.Title>
          <Dialog.Close
            type='button'
            disabled={isFetching}
            onClick={handleCloseModal}
          >x
          </Dialog.Close>
        </Dialog.Header>

        <NewProductBody>
          <AccordionItem title={t('general')} defaultOpen>
            <fieldset disabled={isFetching}>
              <Input
                name='title'
                data-locale-id={storeData.store.defaultLocaleId}
                onInput={handleTranslationInput}
              >{t('general.title')}
              </Input>
              <Input
                name='subtitle'
                data-locale-id={storeData.store.defaultLocaleId}
                onInput={handleTranslationInput}
              >{t('general.subtitle')}
              </Input>
              <Input
                name='description'
                data-locale-id={storeData.store.defaultLocaleId}
                onInput={handleTranslationInput}
              >{t('general.description')}
              </Input>
              <Input
                name='handle'
                onInput={handleInput}
              >{t('general.handle')}
              </Input>
              <Switch
                name='discountable'
                checked={productData.discountable}
                onChange={handleInput}
              >{t('general.discountable')}
              </Switch>
            </fieldset>
          </AccordionItem>

          <If condition={storeData.store.locales.length > 1}>
            <AccordionItem title={t('translations')}>
              <Translations
                locales={storeData.store.locales}
                defaultLocaleId={storeData.store.defaultLocaleId}
                onInput={handleTranslationInput}
                disabled={isFetching}
              />
            </AccordionItem>
          </If>

          <AccordionItem title={t('organize')}>
            <fieldset disabled={isFetching}>
              {/* TODO tags */}
              {/* TODO create type */}
              type, collection, categories, sales channels
            </fieldset>
          </AccordionItem>

          <AccordionItem title={t('media')}>
            <fieldset disabled={isFetching}>
              {/* TODO upload */}
              thumbnail, images
            </fieldset>
          </AccordionItem>
        </NewProductBody>

        <Dialog.Footer>
          <Button
            $variant='secondary'
            type='submit'
            data-status='draft'
            disabled={isFetching}
            onClick={handleSubmit}
          >{t('save')}
          </Button>
          <Button
            $variant='primary'
            type='submit'
            data-status='publish'
            disabled={isFetching}
            onClick={handleSubmit}
          >{t('publish')}
          </Button>
        </Dialog.Footer>
      </form>
    </Dialog>
  )
})

const Products = component(() => {
  // TODO implement filters that are commented out
  const [params, setParams] = useState({
    // id: null,
    // handle: null,
    // is_giftcard: null,
    status: null,
    collection_id: null,
    // type_id: null,
    // tag_id: null,
    title: null,
    // description: null,
    // category_id: null,
    // price_list_id: null,
    // sales_channel_id: null,
    // region_id: null,
    // currency_code: null,
    offset: null,
    fetch: 15,
    order: constants.orderDesc
  })

  const { isFetching: storeIsFetching, data: storeData, error: storeError } = useStore()
  // TODO show skeleton while fetching
  // TODO show error message
  const { data: productsData, error: productsError, isFetching: productsIsFetching } = useProducts(params)

  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }
    modalRef.current.showModal()
  }

  const { t } = useTranslation('products')
  // keep state to build request query params
  // no sort, just filter (this simplifies a great deal)
  if (productsData && storeData) {
    const { products } = productsData
    const { defaultLocaleId } = storeData

    return (
      <>
        <Card>
          <Card.Header title={t('title')}>
            <Button
              $variant='primary'
              type='button'
              disabled={detectIsNull(modalRef)}
              onClick={handleOpenModal}
            >{t('addProduct')}
            </Button>
          </Card.Header>
          {/* TODO change to Table.Title */}
          <Card.Body>
            <Table products={products} defaultLocaleId={defaultLocaleId} />
          </Card.Body>
        </Card>
        <NewProduct modalRef={modalRef} />
      </>
    )
  }
})

export default Products
