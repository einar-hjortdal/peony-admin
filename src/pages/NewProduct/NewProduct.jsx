import { component, useEffect, useState } from '@dark-engine/core'
import { useHistory } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import { useProductCreateMutation } from '../../data'
import TranslationDefaultInputs from '../../components/products/TranslationDefaultInputs'
import TranslationsInputs from '../../components/products/TranslationsInputs'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import Checkbox from '../../components/input/Checkbox'
import ColumnLarge from '../../components/columns/ColumnLarge'
import ColumnSmall from '../../components/columns/ColumnSmall'
import SetTitle from '../../components/SetTitle'
import Status from '../../components/products/Status'
import RowRight from '../../components/rows/RowRight'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import ProductOptions from '../../components/products/ProductOptions'
import Metadata from '../../components/input/Metadata'
import Images from '../../components/products/Images'
import Organize from '../../components/products/Organize'
import SEOCard from '../../components/SEOCard'

const MetadataCard = component(({ metadata, onChange }) => {
  const { t } = useTranslation('products.new.metadata')
  return (
    <CardDefault>
      <CardHeader title={t('title')} />
      <Metadata metadata={metadata} onChange={onChange} />
    </CardDefault>
  )
})

const ProductNew = component(() => {
  const { t } = useTranslation('products.new')
  const history = useHistory()

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

  const handleImagesChange = (newImages) => {
    setProductData((prevState) => {
      if (newImages.length > 0) {
        return {
          ...prevState,
          images: newImages,
          thumbnail: 0
        }
      }

      const newState = { ...prevState, images: newImages }
      delete newState.thumbnail
      return newState
    })
  }

  const handleThumbnailChange = (newThumbnailIndex) => {
    setProductData((prevState) => {
      return { ...prevState, thumbnail: newThumbnailIndex }
    })
  }

  const handleOptionsChange = (data) => {
    setProductData((prevState) => {
      return { ...prevState, options: data.options }
    })
  }

  const handleMetadataChange = (newMetadata) => {
    setProductData((prevstate) => {
      return { ...prevstate, metadata: newMetadata }
    })
  }

  const handleOrganizeChange = (data) => {
    const { categoryIds } = data
    if (categoryIds) {
      setProductData((prevState) => {
        return { ...prevState, categoryIds }
      })
    }
  }

  const handleSEOChange = (data) => {
    const { handle, seoTranslations } = data
    setProductData((prevState) => {
      const newState = { ...prevState }
      if (handle) {
        newState.handle = handle
      }

      if (seoTranslations) {
        newState.seoTranslations = seoTranslations
      }

      return newState
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

  useEffect(() => {
    // on success navigate to products
    if (createProductData) {
      history.push('/products')
    }
  }, [createProductData])

  if (createProductError) {
    // TODO handle error
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

        <Images
          images={productData.images}
          thumbnail={productData.thumbnail}
          onImagesChange={handleImagesChange}
          onThumbnailChange={handleThumbnailChange}
        />
        <ProductOptions options={productData.options} onChange={handleOptionsChange} />
        <MetadataCard metadata={productData.metadata} onChange={handleMetadataChange} />
        <SEOCard
          handle={productData.handle}
          seoTranslations={productData.seoTranslations}
          onChange={handleSEOChange}
        />
      </ColumnLarge>

      <ColumnSmall>
        <Status defaultValue={productData.status} onChange={handleStatusChange} />

        {/* TODO sales channels */}
        {/* TODO regions */}

        <Organize
          categoryIds={productData.categoryIds}
          onChange={handleOrganizeChange}
          disabled={createProductIsFetching}
        />
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
