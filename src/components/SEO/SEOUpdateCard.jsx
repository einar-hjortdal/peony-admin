import { component, detectIsNull, useRef, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'
import Handle from '../input/Handle'
import SEOTitle from './SEOTitle'
import SEODescription from './SEODescription'
import KeyValueListPreview from '../products/KeyValueListPreview'
import ButtonMore from '../buttons/ButtonMore'
import ModalDefault from '../modals/ModalDefault'
import ModalHeader from '../modals/ModalHeader'
import ModalFooter from '../modals/ModalFooter'
import PrimaryButton from '../buttons/PrimaryButton'
import SEOTranslations from './SEOTranslations'

const SEOEditModal = component(
  ({
    modalRef,
    handleClose,
    handleSave,
    handle,
    seoData,
    handleHandleInput,
    handleSEOInput,
    handleTranslationInput,
    disabled
  }) => {
    const { t } = useTranslation('seoUpdateCard')

    return (
      <ModalDefault ref={modalRef}>
        <ModalHeader title={t('modalTitle')} handleClose={handleClose} />

        <Handle
          name='handle'
          onInput={handleHandleInput}
          value={handle}
          disabled={disabled}
        />

        <SEOTitle
          seo={seoData}
          onInput={handleSEOInput}
          disabled={disabled}
        >{t('seoTitle')}
        </SEOTitle>

        <SEODescription
          seo={seoData}
          onInput={handleSEOInput}
          disabled={disabled}
        >{t('seoDescription')}
        </SEODescription>

        <SEOTranslations seo={seoData} onInput={handleTranslationInput} />

        <ModalFooter>
          <PrimaryButton type='button' onClick={handleSave}>{t('save')}</PrimaryButton>
        </ModalFooter>
      </ModalDefault>
    )
  })

const SEOUpdateCard = component(
  ({
    handle,
    onHandleChange,
    seo,
    onSEOChange,
    onSEODelete,
    disabled
  }) => {
    const { t } = useTranslation('seoUpdateCard')

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

    const handleHandleInput = (newHandle) => {
      setHandleData(newHandle)
    }

    const handleSEOInput = (event) => {
      const { name, value } = event.target
      setSeoData((prevState) => {
        return { ...prevState, [name]: value }
      })
    }

    const handleTranslationInput = (newTranslations) => {
      setSeoData((prevState) => {
        return { ...prevState, translations: newTranslations }
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
    const previewValues = [handleData, getTitle(), getDescription()]

    return (
      <CardDefault>
        <CardHeader title={t('title')}>
          <ButtonMore type='button'>

            <li>
              <button type='button' onClick={handleOpenModal}>{t('edit')}</button>
              <SEOEditModal
                modalRef={modalRef}
                handleClose={handleCloseModal}
                handle={handleData}
                seoData={seoData}
                handleHandleInput={handleHandleInput}
                handleSEOInput={handleSEOInput}
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
