import {
  component,
  detectIsNull,
  useEffect,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import { useProductCreateMutation } from '../../../data'

import TranslationDefaultInputs from '../../../components/products/TranslationDefaultInputs'
import TranslationsInputs from '../../../components/products/TranslationsInputs'
import Handle from '../../../components/input/Handle'
import CardDefault from '../../../components/cards/CardDefault'
import CardHeader from '../../../components/cards/CardHeader'
import Checkbox from '../../../components/input/Checkbox'
import ColumnLarge from '../../../components/columns/ColumnLarge'
import ColumnSmall from '../../../components/columns/ColumnSmall'
import SetTitle from '../../../components/SetTitle'
import Status from '../../../components/products/Status'
import RowRight from '../../../components/rows/RowRight'
import PrimaryButton from '../../../components/buttons/PrimaryButton'
import ProductOptions from '../../../components/products/ProductOptions'

const ProductNew = component(({ modalRef }) => {
  const { t } = useTranslation('products.new')

  const [productData, setProductData] = useState({ discountable: true })

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
      return setProductData({ ...productData, [name]: value })
    }
  }

  const handleTranslationsChange = (newTranslations) => {
    setProductData((prevState) => {
      const newState = { ...prevState, translations: newTranslations }
      return newState
    })
  }

  const handleStatusChange = (newStatus) => {
    setProductData((prevState) => {
      return { ...prevState, status: newStatus }
    })
  }

  const handleHandleChange = (newHandle) => {
    setProductData((prevState) => {
      return { ...prevState, handle: newHandle }
    })
  }

  const handleOptionsChange = (data) => {
    setProductData((prevState) => {
      return { ...prevState, options: data.options }
    })
  }

  const [
    createProduct,
    {
      isFetching: createProductIsFetching,
      data: createProductData,
      error: createProductError
    }
  ] = useProductCreateMutation()

  // TODO validate inputs: require a title in the default language
  const handleSubmit = (e) => {
    e.preventDefault()
    if (createProductIsFetching) {
      return
    }

    const data = { ...productData }
    createProduct(data)
  }

  const handleCloseModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }

    setProductData({ discountable: true })
    modalRef.current.close()
  }

  useEffect(() => {
    if (createProductData) {
      handleCloseModal()
    }
  }, [createProductData])

  if (createProductError) {
    return null // TODO handle error
  }

  return (
    <>
      <SetTitle title={t('title')} />

      <ColumnLarge>
        <CardDefault>
          <CardHeader title={t('general.title')} />

          <fieldset disabled={createProductIsFetching}>
            <TranslationDefaultInputs
              translations={productData.translations}
              onChange={handleTranslationsChange}
            />

            <Handle value={productData.handle} onChange={handleHandleChange} />

            <Checkbox
              name='discountable'
              checked={productData.discountable}
              onChange={handleInput}
            >{t('general.discountable')}
            </Checkbox>
          </fieldset>
        </CardDefault>

        <TranslationsInputs
          translations={productData.translations}
          onChange={handleTranslationsChange}
        />

        {/* TODO images */}

        <ProductOptions options={productData.options} onChange={handleOptionsChange} />
      </ColumnLarge>

      <ColumnSmall>
        <Status defaultValue={productData.status} onChange={handleStatusChange} />
        {/* TODO sales channels */}
        {/* TODO regions */}
        {/* TODO organize */}
      </ColumnSmall>

      <RowRight>
        <PrimaryButton
          type='submit'
          data-status='published'
          disabled={createProductIsFetching}
          onClick={handleSubmit}
        >{t('save')}
        </PrimaryButton>
      </RowRight>
    </>
  )
})

export default ProductNew
