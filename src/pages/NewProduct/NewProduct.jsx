import { component, detectIsUndefined, useEffect, useState } from '@dark-engine/core'
import { useHistory } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import { useProductCreateMutation } from '../../data'
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
import SEOCard from '../../components/SEO/SEOCard'
import Textarea from '../../components/input/Textarea'
import Text from '../../components/input/Text'
import Translations from './Translations'

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

    if (type === 'text' || type === 'textarea') {
      if (detectIsEmptyString(value)) {
        // TODO if name === 'title' show error (title is required)
        const { [name]: omitted, ...rest } = productData
        return setProductData(rest)
      }
      return setProductData({ ...productData, [name]: value })
    }
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

  const handleHandleInput = (newHandle) => {
    setProductData((prevState) => {
      const newState = { ...prevState }
      if (detectIsEmptyString(newHandle)) {
        delete newState.handle
      } else {
        newState.handle = newHandle
      }
      return newState
    })
  }

  const handleSEOInput = (newSeo) => {
    setProductData((prevState) => {
      const newState = { ...prevState }
      const { title, description } = newSeo
      if (detectIsUndefined(title) && detectIsUndefined(description)) {
        delete newState.seo
      } else {
        newState.seo = newSeo
      }
      return newState
    })
  }

  const handleGeneralTranslationInput = (newGeneralTranslation) => {
    setProductData((prevState) => {
      const newState = { ...prevState }
      const { translations } = newState
      if (detectIsUndefined(translations)) {
        newState.translations = [newGeneralTranslation]
        return newState
      }

      for (let i = 0, len = translations.length; i < len; i++) {
        const translation = translations[i]
        if (translation.localeId !== newGeneralTranslation.localeId) {
          continue
        }

        const { title, subtitle, description } = newGeneralTranslation
        if (
          detectIsUndefined(title) &&
          detectIsUndefined(subtitle) &&
          detectIsUndefined(description)
        ) {
          newState.translations.splice(i, 1)

          if (newState.translations.length === 0) {
            delete newState.translations
          }
        } else {
          newState.translations[i] = newGeneralTranslation
        }
        return newState
      }

      newState.translations.push(newGeneralTranslation)
      return newState
    })
  }

  const handleSEOTranslationInput = (newSEOTranslation) => {
    setProductData((prevState) => {
      const newState = { ...prevState }
      const { seo } = newState
      if (detectIsUndefined(seo)) {
        newState.seo = { translations: [newSEOTranslation] }
        return newState
      }

      const { translations } = seo
      if (detectIsUndefined(translations)) {
        newState.seo = { translations: [newSEOTranslation] }
        return newState
      }

      for (let i = 0, len = translations.length; i < len; i++) {
        const translation = translations[i]
        if (translation.localeId !== newSEOTranslation.localeId) {
          continue
        }

        const { title, description } = newSEOTranslation
        if (detectIsUndefined(title) && detectIsUndefined(description)) {
          newState.seo.translations.splice(i, 1)
          if (newState.seo.translations.length === 0) {
            delete newState.seo.translations
            if (detectIsUndefined(newState.seo.title) &&
              detectIsUndefined(newState.seo.description)) {
              delete newState.seo
            }
          }
        } else {
          newState.seo.translations[i] = newSEOTranslation
        }
        return newState
      }

      newState.seo.translations.push(newSEOTranslation)
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

  // TODO validate inputs: require a title
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

  console.log(productData)
  return (
    <>
      <SetTitle title={t('title')} />

      <ColumnLarge>
        <CardDefault>
          <CardHeader title={t('general.title')} />

          <Text
            name='title'
            onInput={handleInput}
            value={productData.title}
            disabled={createProductIsFetching}
          >{t('inputTitle')}
          </Text>

          <Text
            name='subtitle'
            onInput={handleInput}
            value={productData.subtitle}
            disabled={createProductIsFetching}
          >{t('inputSubtitle')}
          </Text>

          <Textarea
            name='description'
            onInput={handleInput}
            value={productData.description}
            disabled={createProductIsFetching}
          >{t('inputDescription')}
          </Textarea>

          <Checkbox
            name='discountable'
            checked={productData.discountable}
            onChange={handleInput}
            disabled={createProductIsFetching}
          >{t('general.discountable')}
          </Checkbox>
        </CardDefault>

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
          seo={productData.seo}
          onHandleInput={handleHandleInput}
          onSEOInput={handleSEOInput}
        />

        <Translations
          productData={productData}
          handleGeneralTranslationInput={handleGeneralTranslationInput}
          handleSEOTranslationInput={handleSEOTranslationInput}
        />
      </ColumnLarge>

      <ColumnSmall>
        {/* TODO block status public with no prices. To immediately publish a product provide prices */}
        <Status defaultValue={productData.status} onChange={handleStatusChange} />

        {/* TODO sales channels */}

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
