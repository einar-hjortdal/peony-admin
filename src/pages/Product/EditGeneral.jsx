import { component, detectIsNull, useEffect, useRef, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductById, useProductUpdateMutation } from '../../data'
import ModalDefault from '../../components/modals/ModalDefault'
import ModalHeader from '../../components/modals/ModalHeader'
import ModalFooter from '../../components/modals/ModalFooter'
import PrimaryButton from '../../components/buttons/PrimaryButton'
import Switch from '../../components/Switch'
import Text from '../../components/input/Text'
import Textarea from '../../components/input/Textarea'

const EditGeneral = component(() => {
  const params = useParams()
  const productId = params.get('productId')
  const { t } = useTranslation('product.editGeneral')
  const { data: productData } = useProductById(productId)
  const [updateProduct] = useProductUpdateMutation(productId)

  const [newProductData, setNewProductData] = useState({})
  useEffect(() => {
    if (productData) {
      const { title, subtitle, description, handle, discountable } = productData.product
      setNewProductData({ title, subtitle, description, handle, discountable })
    }
  }, [productData])

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

  const handleInput = (e) => {
    const { type, name, checked } = e.target
    // TODO if name === 'title' error (required)
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
    const { discountable } = newProductData
    return (
      <>
        <button type='button' onClick={handleOpenModal}>{t('edit')}</button>
        <ModalDefault ref={modalRef}>
          <ModalHeader title={t('title')} handleClose={handleCloseModal} />

          <Text
            name='title'
            onInput={productData}
            value={newProductData.title}
          >{t('title')}
          </Text>

          <Text
            name='subtitle'
            onInput={handleInput}
            value={newProductData.subtitle}
          >{t('subtitle')}
          </Text>

          <Textarea
            name='description'
            onInput={handleInput}
            value={newProductData.description}
          >{t('description')}
          </Textarea>

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
