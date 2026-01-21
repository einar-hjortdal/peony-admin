import { component, detectIsNull, detectIsUndefined, useRef, useState } from '@dark-engine/core'

import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'
import Handle from '../input/Handle'
import { useTranslation } from '@wareme/translations'
import SEOTitle from './SEOTitle'
import SEODescription from './SEODescription'
import KeyValueListPreview from '../products/KeyValueListPreview'
import ButtonMore from '../buttons/ButtonMore'
import ModalDefault from '../modals/ModalDefault'
import ModalHeader from '../modals/ModalHeader'
import ModalFooter from '../modals/ModalFooter'
import PrimaryButton from '../buttons/PrimaryButton'

// <SEOTranslations seo={seo} onChange={console.log} />
const SEOEditModal = component(
  ({
    modalRef,
    handleClose,
    handleSave,
    handle,
    seoData,
    handleInput,
    handleTranslationInput,
    disabled
  }) => {
    const { t } = useTranslation('product.seoUpdateCard')
    return (
      <ModalDefault ref={modalRef}>
        <ModalHeader title={t('modalTitle')} handleClose={handleClose} />

        <Handle
          name='handle'
          onInput={handleInput}
          value={handle}
          disabled={disabled}
        />

        <SEOTitle
          seo={seoData}
          onInput={handleInput}
          disabled={disabled}
        >{t('seoTitle')}
        </SEOTitle>

        <SEODescription
          seo={seoData}
          onInput={handleInput}
          disabled={disabled}
        >{t('seoDescription')}
        </SEODescription>

        <ModalFooter>
          <PrimaryButton type='button' onClick={handleSave}>{t('save')}</PrimaryButton>
        </ModalFooter>
      </ModalDefault>
    )
  })

// TODO preview data without input elements
// TODO button to open modal, modal does the editing, internal state is kept until saved
// TODO button to delete data
const SEOUpdateCard = component(
  ({
    handle,
    onHandleChange,
    seo,
    onSEOChange,
    onSEODelete,
    disabled
  }) => {
    const { t } = useTranslation('product.seoUpdateCard')

    const modalRef = useRef(null)
    const handleOpenModal = () => {
      if (detectIsNull(modalRef)) {
        return
      }
      modalRef.current.showModal()
    }

    const handleCloseModal = () => {
      if (detectIsNull(modalRef)) {
        return
      }
      modalRef.current.close()
    }

    const [seoData, setSeoData] = useState(seo)
    const [handleData, setHandleData] = useState(handle)

    const handleInput = (event) => {
      const { name, value } = event.target
      if (name === 'handle') {
        setHandleData(value)
      }

      if (name === 'title' || name === 'description') {
        setSeoData((prevState) => {
          return { ...prevState, [name]: value }
        })
      }
    }

    const handleTranslationInput = (event) => {
      const { name, value, dataset } = event.target
      const { localeId } = dataset
      setSeoData((prevState) => {
        const newSEOData = { ...prevState }
        const { translations } = newSEOData

        if (detectIsUndefined(translations)) {
          newSEOData.translations = [{ localeId, [name]: value }]
          return newSEOData
        }

        for (let i = 0, len = translations.length; i < len; i++) {
          const translation = translations[i]
          if (translation.localeId === localeId) {
            const newTranslations = [...translations]
            newTranslations[i] = { ...translation, [name]: value }
            newSEOData.translations = newTranslations
            return newSEOData
          }
        }

        newSEOData.translations = [...translations, { localeId, [name]: value }]
        return newSEOData
      })
    }

    const handleSave = () => {
      onHandleChange(handleData)
      onSEOChange(seoData)
    }

    const handleDelete = () => {
      onSEODelete()
    }

    const getTitle = () => {
      if (seo && seo.title) {
        return seo.title
      }
    }

    const getDescription = () => {
      if (seo && seo.description) {
        return seo.description
      }
    }

    const previewKeys = ['handle', 'title', 'description']
    const previewValues = [handle, getTitle(), getDescription()]

    return (
      <CardDefault>
        <CardHeader title={t('title')}>
          <ButtonMore type='button'>

            <li>
              <button type='button' onClick={handleOpenModal}>{t('edit')}</button>
              <SEOEditModal
                modalRef={modalRef}
                handleClose={handleCloseModal}
                handleData={handleData}
                seoData={seoData}
                handleInput={handleInput}
                handleTranslationInput={handleTranslationInput}
                handleSave={handleSave}
                disabled={disabled}
              />
            </li>
            <li>
              {/* TODO tooltip? tell user this deletes title and description, not handle */}
              <button type='button' onClick={handleDelete}>{t('delete')}</button>
            </li>
          </ButtonMore>
        </CardHeader>

        <KeyValueListPreview keys={previewKeys} values={previewValues} />
      </CardDefault>
    )
  })

export default SEOUpdateCard
