import {
  component,
  detectIsNull,
  detectIsString,
  useEffect,
  useMemo,
  useRef,
  useState
} from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useLocaleById, useProductById, useProductUpdateMutation, useStore } from '../../data'
import If from '../../components/If'
import CardDefault from '../../components/Cards/CardDefault'
import CardHeader from '../../components/Cards/CardHeader'
import ButtonMore from '../../components/Buttons/ButtonMore'
import ModalDefault from '../../components/Modals/ModalDefault'
import ModalHeader from '../../components/Modals/ModalHeader'
import ModalFooter from '../../components/Modals/ModalFooter'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import TranslationsInputs from '../../components/Product/TranslationsInputs'

const TranslationsEdit = component(({ productId, title, slot }) => {
  const [updateProduct] = useProductUpdateMutation(productId)
  const { data: productData } = useProductById(productId)
  const { data: storeData } = useStore()

  const [translationsData, setTranslationsData] = useState([])
  useEffect(() => {
    if (productData && storeData) {
      const { translations } = productData.product
      const { defaultLocaleId } = storeData.store
      const newTranslationsData = []
      for (let i = 0, len = translations.length; i < len; i++) {
        const translation = translations[i]
        if (translation.localeId === defaultLocaleId) {
          continue
        }
        newTranslationsData.push(translation)
      }
      setTranslationsData(newTranslationsData)
    }
  }, [productData, storeData])

  const defaultTranslation = useMemo(() => {
    if (productData && storeData) {
      const { translations } = productData.product
      const { defaultLocaleId } = storeData.store
      for (let i = 0, len = translations.length; i < len; i++) {
        const translation = translations[i]
        if (translation.localeId === defaultLocaleId) {
          return translation
        }
      }
    }
  }, [productData, storeData])

  const modalRef = useRef(null)

  const handleOpenModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }
    return modalRef.current.showModal()
  }

  const handleCloseModal = () => {
    return modalRef.current.close()
  }

  const handleChange = (newTranslationsData) => {
    setTranslationsData(newTranslationsData)
  }

  const handleSave = () => {
    const newTranslations = [...translationsData, defaultTranslation]
    updateProduct({ translations: newTranslations })
  }

  if (productData && storeData) {
    return (
      <>
        <button type='button' onClick={handleOpenModal}>{slot}</button>
        <ModalDefault ref={modalRef}>
          <ModalHeader title={title} handleClose={handleCloseModal} />
          <TranslationsInputs translations={translationsData} onChange={handleChange} />
          <ModalFooter>
            <PrimaryButton type='button' onClick={handleSave}>save</PrimaryButton>
          </ModalFooter>
        </ModalDefault>
      </>
    )
  }
})

const Translation = component(({ localeId, title, subtitle, description }) => {
  const { data: localeData } = useLocaleById(localeId)
  const { t, translator } = useTranslation('product.translationGroup')

  if (localeData) {
    const { code } = localeData.locale
    return (
      <div>
        <span>{translator.formatName(code, { type: 'language' })}</span>

        <If condition={detectIsString(title)}>
          <div>
            {t('title')}: {title}
          </div>
        </If>

        <If condition={detectIsString(subtitle)}>
          <div>
            {t('subtitle')}: {subtitle}
          </div>
        </If>

        <If condition={detectIsString(description)}>
          <div>
            {t('description')}: {description}
          </div>
        </If>
      </div>
    )
  }
})

const Translations = component(() => {
  const params = useParams()
  const productId = params.get('id')
  const { t } = useTranslation('product.translations')
  const [updateProduct] = useProductUpdateMutation(productId)
  const { data: productData } = useProductById(productId)
  const { data: storeData } = useStore()

  if (storeData && productData) {
    const { translations } = productData.product
    const { defaultLocaleId, locales } = storeData.store

    // Don't do any more work if store only has one locale
    if (locales.length === 1) {
      return null
    }

    const res = []
    for (let i = 0, len = translations.length; i < len; i++) {
      const translation = translations[i]
      const { localeId, title, subtitle, description } = translation

      if (localeId === defaultLocaleId) {
        continue
      }

      res.push(
        <Translation
          localeCode={localeId}
          title={title}
          subtitle={subtitle}
          description={description}
        />
      )
    }

    const handleDeleteAll = () => {
      for (let i = 0, len = translations.length; i < len; i++) {
        const translation = translations[i]
        if (translation.localeId === defaultLocaleId) {
          updateProduct({ translations: [translation] })
          break
        }
      }
    }

    return (
      <CardDefault>
        <CardHeader title={t('title')}>
          <ButtonMore>
            <ul>
              <li>
                <TranslationsEdit productId={productId} title={t('modalTitle')}>
                  <If condition={translations.length === 1}>
                    {t('add')}
                  </If>
                  <If condition={translations.length > 1}>
                    {t('edit')}
                  </If>
                </TranslationsEdit>
              </li>
              <If condition={translations.length > 1}>
                <li>
                  <button type='button' onClick={handleDeleteAll}>{t('deleteAll')}</button>
                </li>
              </If>
            </ul>
          </ButtonMore>
        </CardHeader>
        {res}
      </CardDefault>
    )
  }
})

export default Translations
