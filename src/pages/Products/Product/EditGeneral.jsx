import { component, detectIsNull, useEffect, useRef, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductUpdateMutation } from '../../../data'
import ModalDefault from '../../../components/Modals/ModalDefault'
import TranslationDefaultInputs from '../../../components/Product/TranslationDefaultInputs'
import ModalHeader from '../../../components/Modals/ModalHeader'
import ModalFooter from '../../../components/Modals/ModalFooter'
import PrimaryButton from '../../../components/Buttons/PrimaryButton'
import HandleInput from '../../../components/input/Handle'
import Switch from '../../../components/Switch'

const EditGeneral = component(() => {
  const params = useParams()
  const productId = params.get('id')
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

  console.log(newProductData)
  if (productData) {
    const { translations } = productData.product
    const { handle, discountable } = newProductData
    return (
      <>
        <button type='button' onClick={handleOpenModal}>{t('edit')}</button>
        <ModalDefault ref={modalRef}>
          <ModalHeader title={t('title')} handleClose={handleCloseModal} />

          <TranslationDefaultInputs translations={translations} onChange={handleTranslationsChange} />
          <HandleInput value={handle} onChange={handleHandleChange} />
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
