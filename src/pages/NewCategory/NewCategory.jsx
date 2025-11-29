import { component, detectIsBoolean, useEffect, useState } from '@dark-engine/core'
import { useHistory } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useCategoryCreateMutation } from '../../data'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import SetTitle from '../../components/SetTitle'
import ColumnLarge from '../../components/columns/ColumnLarge'
import ColumnSmall from '../../components/columns/ColumnSmall'
import Status from '../../components/categories/Status'
import Translations from './Translations'
import MetadataCard from '../../components/MetadataCard'
import SEOCard from '../../components/SEOCard'
import General from './General'

const NewCategory = component(() => {
  const { t } = useTranslation('newCategory')
  const history = useHistory()

  const [categoryData, setCategoryData] = useState({
    isActive: true,
    isInternal: false
  })

  const [createCategory, { data: createCategoryData }] = useCategoryCreateMutation()

  const handleClick = () => {
    createCategory(categoryData)
  }

  useEffect(() => {
    // on success navigate to categories
    if (createCategoryData) {
      history.push('/products/categories')
    }
  }, [createCategoryData])

  const handleStatusChange = (data) => {
    const { isActive, isInternal } = data
    setCategoryData((prevState) => {
      const newState = { ...prevState }
      if (detectIsBoolean(isInternal)) {
        newState.isInternal = isInternal
      }

      if (detectIsBoolean(isActive)) {
        newState.isActive = isActive
      }

      return newState
    })
  }

  const handleTranslationsChange = (newTranslations) => {
    setCategoryData((prevState) => {
      return { ...prevState, translations: newTranslations }
    })
  }

  const handleMetadataUpdate = (newMetadata) => {
    setCategoryData((prevState) => {
      return { ...prevState, metadata: newMetadata }
    })
  }

  const handleSEOChange = (data) => {
    const { handle, seoTranslations } = data
    setCategoryData((prevState) => {
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

  const {
    handle,
    isActive,
    isInternal,
    metadata,
    translations,
    seoTranslations
  } = categoryData

  console.log(categoryData)
  return (
    <>
      <SetTitle title={t('title')} />

      <ColumnLarge>
        <General translations={translations} onTranslationsChange={handleTranslationsChange} />
        <Translations translations={translations} onChange={handleTranslationsChange} />
        <MetadataCard metadata={metadata} onChange={handleMetadataUpdate} />
        <SEOCard handle={handle} seoTranslations={seoTranslations} onChange={handleSEOChange} />
      </ColumnLarge>

      <ColumnSmall>
        <Status isActive={isActive} isInternal={isInternal} onChange={handleStatusChange} />
      </ColumnSmall>

      <PrimaryButton type='button' onClick={handleClick}>{t('create')}</PrimaryButton>
    </>
  )
})

export default NewCategory
