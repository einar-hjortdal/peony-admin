import {
  component,
  detectIsUndefined,
  useState,
  useRef,
  detectIsNull
} from '@dark-engine/core'

import { useProductById, useUploadProductImageMutation } from '../../data'
import { useTranslation } from '@wareme/translations'
import PrimaryButton from '../Buttons/PrimaryButton'
import { useParams } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import ModalDefault from '../Modals/ModalDefault'
import ModalHeader from '../Modals/ModalHeader'
import ModalBody from '../Modals/ModalBody'
import CardDefault from '../Cards/CardDefault'
import CardHeader from '../Cards/CardHeader'

const ImagePreviewWrapper = styled.div`
  display: inline-block;
  width: 10rem;
  height: 14rem;
`

const StyledImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`

const ImagePreview = component(({ ...props }) => {
  return (
    <ImagePreviewWrapper>
      <StyledImg {...props} />
    </ImagePreviewWrapper>
  )
})

// TODO allow changing order and deletion
// TODO allow changing alt and alt translations
const ExistingImages = component(({ images }) => {
  if (detectIsUndefined(images)) {
    return null
  }

  const res = []
  for (let i = 0, len = images.length; i < len; i++) {
    const image = images[i]
    res.push(
      <ImagePreview src={image.url} alt={image.alt} />
    )
  }

  return (
    <div>
      {res}
    </div>
  )
})

// TODO split add images from edit images
const AddImageButton = component(({ productId }) => {
  const { t } = useTranslation('product.addImage')
  const { data } = useProductById(productId)
  const modalRef = useRef(null)
  const inputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const {
    uploadProductImage,
    isFetching: uploadProductImagesIsFetching,
    error: uploadProductImagesError
  } = useUploadProductImageMutation(productId)

  // Prevent file chooser from opening twice
  const handleLabelClick = (e) => {
    e.preventDefault()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (detectIsUndefined(file)) {
      return
    }
    setSelectedFile(file)
  }

  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  const handleCloseModal = () => {
    // prevent input from showing previously selected file data
    // TODO hide native input and show selected previews
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    setSelectedFile(null)
    modalRef.current.close()
  }

  const isSubmitDisabled = () => {
    return uploadProductImagesIsFetching || detectIsNull(selectedFile)
  }

  const handleSubmit = async () => {
    await uploadProductImage(selectedFile)
    // TODO display error
    if (detectIsNull(uploadProductImagesError)) {
      handleCloseModal()
    }
  }

  if (data) {
    const { images } = data.product
    return (
      <div>
        <PrimaryButton type='button' onClick={handleOpenModal}>
          {t('add')}
        </PrimaryButton>
        <ModalDefault ref={modalRef}>
          <ModalHeader title={t('title')} handleClose={handleCloseModal} />

          <ModalBody>
            <div>
              <label onClick={handleLabelClick}>
                select image
                <input
                  ref={inputRef}
                  type='file'
                  onChange={handleFileChange}
                />
              </label>
              <PrimaryButton
                type='button'
                onClick={handleSubmit}
                disabled={isSubmitDisabled()}
              >upload
              </PrimaryButton>
            </div>

            <ExistingImages images={images} />
          </ModalBody>
        </ModalDefault>
      </div>
    )
  }
})

const Preview = component(({ productId }) => {
  const { data: productData } = useProductById(productId)
  const { t } = useTranslation('product.images.preview')

  if (productData) {
    const { product } = productData
    const { images } = product
    if (detectIsUndefined(images)) {
      return t('noImages')
    }

    const previews = []
    for (let i = 0, len = images.length; i < len; i++) {
      const image = images[i]
      previews.push(<Preview src={image.url} alt={image.alt} />)
    }

    return (
      <div>
        {previews}
        {/* TODO mark thumbnail image */}
      </div>
    )
  }
})

const Images = component(() => {
  const { t } = useTranslation('product.images')
  const params = useParams()
  const productId = params.get('id')

  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <AddImageButton productId={productId} />
      </CardHeader>
      <Preview productId={productId} />
    </CardDefault>

  )
})

export default Images
