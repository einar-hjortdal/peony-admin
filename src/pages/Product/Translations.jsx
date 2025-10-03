import {
  component,
  detectIsFunction,
  detectIsNull,
  detectIsString,
  detectIsUndefined,
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
import { styled } from '@dark-engine/styled'

const TranslationsEdit = component(({ productId, title, renderButton, slot }) => {
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

  let Button = 'button'
  if (detectIsFunction(renderButton)) {
    Button = renderButton
  }

  if (productData && storeData) {
    return (
      <>
        <Button type='button' onClick={handleOpenModal}>{slot}</Button>
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

const Column = styled.div`
  display: inline-block;
  width: 50%;
`

const TopLeft = styled.div`
  display: inline-block;
`

const LanguageName = styled.span`
  font-size: 120%;
`

const TopRight = styled.div`
  float: right;
`

const StyledLi = styled.li`
  padding-top: .75rem;
  padding-bottom: .75rem;
  border-bottom: 1px solid ${(p) => p.theme.neutral20};
`

const Translation = component(({ localeId, title, subtitle, description }) => {
  const { data: localeData } = useLocaleById(localeId)
  const { t, translator } = useTranslation('product.translation')

  if (localeData) {
    const { code } = localeData.locale
    const languageName = translator.formatName(code, { type: 'language' })

    return (
      <div>
        <TopLeft>
          <LanguageName>{languageName}</LanguageName>
        </TopLeft>
        <TopRight>
          {/*
          <ButtonMore>
            <li>delete language translations</li>
          </ButtonMore>
          */}
        </TopRight>

        <ul>
          <If condition={detectIsString(title)}>
            <StyledLi>
              <Column>{t('title')}</Column>
              <Column>{title}</Column>
            </StyledLi>
          </If>

          <If condition={detectIsString(subtitle)}>
            <StyledLi>
              <Column>{t('subtitle')}</Column>
              <Column>{subtitle}</Column>
            </StyledLi>
          </If>

          <If condition={detectIsString(description)}>
            <StyledLi>
              <Column>{t('description')}</Column>
              <Column>{description}</Column>
            </StyledLi>
          </If>
        </ul>
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
      const { localeId, title, subtitle, description } = translations[i]

      if (localeId === defaultLocaleId) {
        continue
      }

      res.push(
        <Translation
          localeId={localeId}
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
          <If condition={translations.length === 1}>
            <TranslationsEdit
              productId={productId}
              title={t('modalTitle')}
              renderButton={(props) => <PrimaryButton {...props} />}
            >{t('add')}
            </TranslationsEdit>
          </If>

          <If condition={translations.length > 1}>
            <ButtonMore>
              <li>
                <TranslationsEdit
                  productId={productId}
                  title={t('modalTitle')}
                >{t('edit')}
                </TranslationsEdit>
              </li>
              <li>
                <button type='button' onClick={handleDeleteAll}>{t('deleteAll')}</button>
              </li>
            </ButtonMore>
          </If>
        </CardHeader>

        <If condition={translations.length === 1}>{t('noTranslations')}</If>
        <If condition={translations.length > 1}>{res}</If>
      </CardDefault>
    )
  }
})

export default Translations
