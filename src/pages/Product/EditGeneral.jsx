import { component, detectIsNull, useEffect, useRef, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductUpdateMutation } from '../../data'
import ModalDefault from '../../components/modals/ModalDefault'
import TranslationDefaultInputs from '../../components/products/TranslationDefaultInputs'
import ModalHeader from '../../components/modals/ModalHeader'
import ModalFooter from '../../components/modals/ModalFooter'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import Handle from '../../components/input/Handle'
import Switch from '../../components/Switch'

const EditGeneral = component(() => {
  const params = useParams()
  const productId = params.get('productId')
  const { t } = useTranslation('product.editGeneral')
  const { data: productData } = useProductById(productId)
  const [updateProduct] = useProductUpdateMutation(productId)

  const [newProductData, setNewProductData] = useState({})
  useEffect(() => {
    if (productData) {
      const { handle, discountable, translations } = productData.product
      setNewProductData({ handle, discountable, translations })
    }
  }, [productData])

  const modalRef = useRef(null)

  const handleTranslationsChange = (newTranslations) => {
    setNewProductData((prevState) => {
      return { ...prevState, translations: newTranslations }
    })
  }

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

  const handleHandleChange = (newHandle) => {
    setNewProductData((prevState) => {
      return { ...prevState, handle: newHandle }
    })
  }

  const handleInput = (e) => {
    const { type, name, checked } = e.target
    if (type === 'checkbox') {
      return setNewProductData((prevState) => {
        return { ...prevState, [name]: checked }
      })
    }
  }

  const handleSave = () => {
    updateProduct(newProductData)
  }

  if (productData) {
    const { translations } = productData.product
    const { handle, discountable } = newProductData
    return (
      <>
        <button type='button' onClick={handleOpenModal}>{t('edit')}</button>
        <ModalDefault ref={modalRef}>
          <ModalHeader title={t('title')} handleClose={handleCloseModal} />

          <TranslationDefaultInputs translations={translations} onChange={handleTranslationsChange} />
          <Handle value={handle} onInput={handleHandleChange} />
          <Switch
            name='discountable'
            checked={discountable}
            onChange={handleInput}
          >{t('discountable')}
          </Switch>

          <ModalFooter>
            <PrimaryButton type='button' onClick={handleSave}>{t('save')}</PrimaryButton>
          </ModalFooter>
        </ModalDefault>
      </>
    )
  }
})

export default EditGeneral
