import { component, useState, useRef, detectIsNull } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { styled } from '@dark-engine/styled'

import Card from '../components/Card'
import Dialog from '../components/Dialog'
import Button from '../components/Button'
import AccordionItem from '../components/AccordionItem'
import Input from '../components/Input'
import { useProducts, useCreateProductMutation, useStore } from '../data'

// links: 'edit', 'publish/unpublish', 'duplicate', 'delete'

const NewProductBody = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`

const NewProduct = component(({ modalRef }) => {
  const { t } = useTranslation('newProduct')
  const { isFetching: storeIsFetching, data: storeData, error: storeError } = useStore()

  const [productData, setProductData] = useState({
    // handle            ?string
    // is_giftcard       ?bool
    // status            ?string
    // thumbnail         ?string
    // collection_id     ?string
    // type_id           ?string
    discountable: true
    // images            ?[]string
    // tag_ids           ?[]string
    // sales_channel_ids ?[]string
    // category_ids      ?[]string
    // translations      [{
    //    locale_code string
    //    title string
    //    subtitle string
    //    description string }]
  })
  const handleInput = (e) => {
    const { type, name, checked, value } = e.target
    if (type === 'checkbox') {
      return setProductData({ ...productData, [name]: checked })
    }

    if (type === 'text') {
      if (value === '') {
        const { [name]: omitted, ...rest } = productData
        return setProductData(rest)
      }
      // TODO slugify handle
      return setProductData({ ...productData, [name]: value })
    }
  }

  const handleTranslationInput = (e) => {
    const { localeCode } = e.target.dataset
    if (localeCode) {
      // if productData.translations is defined, check
      return console.log(localeCode)
    }
  }

  const [createProduct, { isFetching, data, error }] = useCreateProductMutation()

  const handleSubmit = (e) => {
    const { status } = e.target.dataset
    const data = { ...productData, status }
    console.log(data)
    // createProduct(data)
  }

  const handleCloseModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    setProductData({})
    modalRef.current.close()
  }

  if (storeIsFetching) {
    return null // TODO return skeleton
  }

  if (storeError) {
    return null // TODO handle error
  }

  if (data) {
    handleCloseModal()
    return null
  }

  if (isFetching) {
    return null // TODO disable everything
  }

  if (error) {
    return null // TODO handle error
  }

  console.log(productData)

  return (
    <Dialog ref={modalRef}>
      <Dialog.Header>
        <Dialog.Title>{t('title')}</Dialog.Title>
        <Dialog.Close
          type='button'
          disabled={detectIsNull(modalRef)}
          onClick={handleCloseModal}
        >x
        </Dialog.Close>
      </Dialog.Header>

      <NewProductBody>
        <AccordionItem title={t('general')} defaultOpen>
          <Input>
            <Input.Text
              name='title'
              data-locale-code={storeData.defaultLocaleCode}
              onInput={handleInput}
            >{t('general.title')}
            </Input.Text>
          </Input>
          <Input>
            <Input.Text
              name='subtitle'
              data-locale_code={storeData.defaultLocaleCode}
              onInput={handleInput}
            >{t('general.subtitle')}
            </Input.Text>
          </Input>
          <Input>
            <Input.Text
              name='description'
              data-locale_code={storeData.defaultLocaleCode}
              onInput={handleInput}
            >{t('general.description')}
            </Input.Text>
          </Input>
          <Input>
            <Input.Text
              name='handle'
              onInput={handleInput}
            >{t('general.handle')}
            </Input.Text>
          </Input>
          <Input>
            <Input.Switch
              name='discountable'
              checked={productData.discountable}
              onChange={handleInput}
            >{t('general.discountable')}
            </Input.Switch>
          </Input>
        </AccordionItem>

        {/* if store_languages has more than one language: display AccordionItem for translations */}

        <AccordionItem title={t('organize')}>
          {/* TODO tags */}
          type, collection, categories, sales channels
        </AccordionItem>

        <AccordionItem title={t('media')}>
          thumbnail, images
        </AccordionItem>
      </NewProductBody>

      <Dialog.Footer>
        <Button
          $variant='secondary'
          type='button'
          data-status='draft'
          disabled={detectIsNull(modalRef)}
          onClick={handleSubmit}
        >{t('save')}
        </Button>
        <Button
          $variant='primary'
          type='button'
          data-status='publish'
          disabled={detectIsNull(modalRef)}
          onClick={handleSubmit}
        >{t('publish')}
        </Button>
      </Dialog.Footer>
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
    fetch: 15
    // order: null
  })

  // TODO show skeleton while fetching
  // TODO show error message
  const { data, error, isFetching } = useProducts(params)

  const modalRef = useRef(null)
  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  const { t } = useTranslation('products')
  // keep state to build request query params
  // no sort, just filter (this simplifies a great deal)
  const headings = [
    t('name'),
    t('collection'),
    t('status'),
    t('availability'),
    t('inventory')
  ]

  return (
    <>
      <Card>
        <Card.Header>
          <Card.HeaderTitle>{t('title')}</Card.HeaderTitle>
          {/* <Filter /> */}
          <Button
            $variant='primary'
            type='button'
            disabled={detectIsNull(modalRef)}
            onClick={handleOpenModal}
          >{t('addProduct')}
          </Button>
        </Card.Header>
        <Card.Table
          headings={headings}
        >
          table
          <Card.TableFooter />
        </Card.Table>
      </Card>
      <NewProduct modalRef={modalRef} />
    </>
  )
})

export default Products
