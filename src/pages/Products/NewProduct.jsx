import {
  component,
  detectIsNull,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'
import { detectIsEmptyString } from '@wareme/utils'

import { useProductCreateMutation } from '../../data'

import AccordionItem from '../../components/AccordionItem'
import Switch from '../../components/Switch'
import Input from '../../components/Input'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import SecondaryButton from '../../components/Buttons/SecondaryButton'
import ModalFull from '../../components/Modals/ModalFull'
import ModalHeader from '../../components/Modals/ModalHeader'
import ModalBody from '../../components/Modals/ModalBody'
import ModalFooter from '../../components/Modals/ModalFooter'
import TranslationDefaultInputs from '../../components/Product/TranslationDefaultInputs'
import TranslationsInputs from '../../components/Product/TranslationsInputs'

const NewProductBody = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`

const NewProduct = component(({ modalRef }) => {
  const { t } = useTranslation('newProduct')
  const formRef = useRef(null)

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
      // TODO slugify handle
      return setProductData({ ...productData, [name]: value })
    }
  }

  const handleTranslationsChange = (newTranslations) => {
    setProductData((prevState) => {
      const newState = { ...prevState, translations: newTranslations }
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (createProductIsFetching) {
      return
    }

    const { status } = e.target.dataset
    const data = { ...productData, status }
    createProduct(data)
  }

  const handleCloseModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }

    formRef.current.reset()
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
    <ModalFull ref={modalRef}>
      <form ref={formRef}>
        <ModalHeader title={t('title')} handleClose={handleCloseModal} />

        <ModalBody>
          <NewProductBody>
            <AccordionItem title={t('general')} defaultOpen>
              <fieldset disabled={createProductIsFetching}>
                <TranslationDefaultInputs
                  translations={productData.translations}
                  onChange={handleTranslationsChange}
                />

                <Input
                  name='handle'
                  onInput={handleInput}
                >{t('general.handle')}
                </Input>

                <Switch
                  name='discountable'
                  checked={productData.discountable}
                  onChange={handleInput}
                >{t('general.discountable')}
                </Switch>
              </fieldset>
            </AccordionItem>

            {/* <TranslationsInputs
                              translations={productData.translations}
                  onChange={handleTranslationsChange}
 /> */}

            <AccordionItem title={t('organize')}>
              <fieldset disabled={createProductIsFetching}>
                {/* TODO tags */}
                {/* TODO create type */}
                type, collection, categories, sales channels
              </fieldset>
            </AccordionItem>

            <AccordionItem title={t('media')}>
              <fieldset disabled={createProductIsFetching}>
                {/* TODO upload */}
                thumbnail, images
              </fieldset>
            </AccordionItem>
          </NewProductBody>
        </ModalBody>

        <ModalFooter>
          <SecondaryButton
            type='submit'
            data-status='draft'
            disabled={createProductIsFetching}
            onClick={handleSubmit}
          >{t('save')}
          </SecondaryButton>
          <PrimaryButton
            type='submit'
            data-status='published'
            disabled={createProductIsFetching}
            onClick={handleSubmit}
          >{t('publish')}
          </PrimaryButton>
        </ModalFooter>
      </form>
    </ModalFull>
  )
})

export default NewProduct
