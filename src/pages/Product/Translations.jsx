import {
  component,
  detectIsNull,
  detectIsUndefined,
  useRef,
  useState
} from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import {
  useProductById,
  useProductUpdateMutation,
  useStore
} from '../../data'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import ButtonMore from '../../components/buttons/ButtonMore'
import ModalDefault from '../../components/modals/ModalDefault'
import ModalHeader from '../../components/modals/ModalHeader'
import ModalFooter from '../../components/modals/ModalFooter'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import TranslationInputs from '../../components/products/TranslationInputs'
import SEOTranslationInputs from '../../components/SEO/SEOTranslationInputs'
import KeyValueListPreview from '../../components/products/KeyValueListPreview'

const TranslationsEdit = component(
  ({
    locales,
    defaultLocaleId,
    productId,
    seo,
    translations
  }) => {
    const [updateProduct] = useProductUpdateMutation(productId)

    const getInitialTranslations = () => {
      if (detectIsUndefined(translations)) {
        return {}
      }
      return translations
    }

    const getInitialSEOTranslations = () => {
      if (detectIsUndefined(seo)) {
        return {}
      }

      const { translations: seoTranslations } = seo
      if (detectIsUndefined(seoTranslations)) {
        return {}
      }
      return seoTranslations
    }

    const [translationsData, setTranslationsData] = useState(getInitialTranslations())

    const [seoTranslationsData, setSEOTranslationsData] = useState(getInitialSEOTranslations())

    const { t, translator } = useTranslation('product.translations')

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

    const handleTranslationInput = (newTranslation) => {
      const { localeId, title, subtitle, description } = newTranslation
      setTranslationsData((prevState) => {
        const newState = { ...prevState }
        if (
          detectIsUndefined(title) &&
          detectIsUndefined(subtitle) &&
          detectIsUndefined(description)
        ) {
          delete newState[localeId]
        } else {
          newState[localeId] = newTranslation
        }
        return newState
      })
    }

    const handleSEOTranslationInput = (newSEOTranslation) => {
      const { localeId, title, description } = newSEOTranslation
      setSEOTranslationsData((prevState) => {
        const newState = { ...prevState }
        if (detectIsUndefined(title) && detectIsUndefined(description)) {
          delete newState[localeId]
        } else {
          newState[localeId] = newSEOTranslation
        }
        return newState
      })
    }

    // TODO only update fields if changed
    const handleSave = () => {
      const newSeoData = { ...seo, translations: seoTranslationsData }
      updateProduct({ translations: translationsData, seo: newSeoData })
    }

    const translationsInputs = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i]
      if (locale.id === defaultLocaleId) {
        continue
      }

      const languageName = translator.formatName(locale.code, {
        type: 'language'
      })

      translationsInputs.push(
        <li key={locale.id}>
          <span>{languageName}</span>
          <TranslationInputs
            generalTranslation={translationsData[locale.id]}
            onInput={handleTranslationInput}
          />
          <SEOTranslationInputs
            seoTranslation={seoTranslationsData[locale.id]}
            onInput={handleSEOTranslationInput}
          />
        </li>
      )
    }

    return (
      <>
        <PrimaryButton type='button' onClick={handleOpenModal}>
          {t('edit')}
        </PrimaryButton>
        <ModalDefault ref={modalRef}>
          <ModalHeader title={t('modalTitle')} handleClose={handleCloseModal} />

          <ul>{translationsInputs}</ul>

          <ModalFooter>
            <PrimaryButton type='button' onClick={handleSave}>
              {t('save')}
            </PrimaryButton>
          </ModalFooter>
        </ModalDefault>
      </>
    )
  }
)

const TranslationPreview = component(
  ({ locale, translation, seoTranslation }) => {
    const { t, translator } = useTranslation('product.translations')
    const languageName = translator.formatName(locale.code, {
      type: 'language'
    })

    const previewKeys = []
    const previewValues = []

    if (!detectIsUndefined(translation)) {
      previewKeys.push(('title'), t('subtitle'), t('description'))
      previewValues.push(translation.title, translation.subtitle, translation.description)
    }

    if (!detectIsUndefined(seoTranslation)) {
      previewKeys.push(t('seoTitle'), t('seoDescription'))
      previewValues.push(seoTranslation.title, seoTranslation.description)
    }

    return (
      <li>
        <span>{languageName}</span>
        <KeyValueListPreview keys={previewKeys} values={previewValues} />
      </li>
    )
  }
)

const TranslationsPreview = component(
  ({ translations, seo, defaultLocaleId, locales }) => {
    const { t } = useTranslation('product.translations')

    if (
      detectIsUndefined(translations) &&
      (detectIsUndefined(seo) || detectIsUndefined(seo.translations))
    ) {
      return <span>{t('noTranslations')}</span>
    }

    const res = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const locale = locales[i]
      if (locale.id === defaultLocaleId) {
        continue
      }

      let seoTranslations = {}
      if (!detectIsUndefined(seo) && !detectIsUndefined(seo.translations)) {
        seoTranslations = seo.translations
      }

      res.push(
        <TranslationPreview
          key={locale.id}
          locale={locale}
          translation={translations[locale.id]}
          seoTranslation={seoTranslations[locale.id]}
        />
      )
    }

    return <ul>{res}</ul>
  }
)

// display existing translations if any
// open modal to edit translations
const Translations = component(() => {
  const params = useParams()
  const productId = params.get('productId')
  const { t } = useTranslation('product.translations')
  const { data: productData } = useProductById(productId)
  const { data: storeData } = useStore()

  const handleDelete = () => { }

  if (storeData && productData) {
    const { translations, seo } = productData.product
    const { defaultLocaleId, locales } = storeData.store

    if (locales.length === 1) {
      return null
    }

    return (
      <CardDefault>
        <CardHeader title={t('title')}>
          <ButtonMore>
            <li>
              <TranslationsEdit
                locales={locales}
                defaultLocaleId={defaultLocaleId}
                productId={productId}
                seo={seo}
                translations={translations}
              />
            </li>
            <li>
              <button type='button' onClick={handleDelete}>
                {t('deleteAll')}
              </button>
            </li>
          </ButtonMore>
        </CardHeader>

        <TranslationsPreview
          translations={translations}
          seo={seo}
          defaultLocaleId={defaultLocaleId}
          locales={locales}
        />
      </CardDefault>
    )
  }
})

export default Translations
