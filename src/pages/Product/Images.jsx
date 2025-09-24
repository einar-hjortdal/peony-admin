import {
  component,
  detectIsUndefined,
  useState,
  useRef,
  detectIsNull
} from '@dark-engine/core'

import { useProductById, useUploadProductImageMutation } from '../../data'
import { useTranslation } from '@wareme/translations'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import { useParams } from '@dark-engine/web-router'
import Card from '../../components/Card'
import { styled } from '@dark-engine/styled'

const PreviewWrapper = styled.div`
  display: inline-block;
  width: 10rem;
  height: 14rem;
`

const PreviewImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`

const Preview = component(({ ...props }) => {
  return (
    <PreviewWrapper>
      <PreviewImg {...props} />
    </PreviewWrapper>
  )
})

// TODO allow changing order and deletion
const ExistingImages = component(({ images }) => {
  if (detectIsUndefined(images)) {
    return null
  }

  const res = []
  for (let i = 0, len = images.length; i < len; i++) {
    const image = images[i]
    res.push(<Preview src={image.url} alt={image.alt} />)
  }
  return res
})

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
        <dialog ref={modalRef}>
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
          <ExistingImages images={images} />
        </dialog>
      </div>
    )
  }

  return null
})

const ImagesPreview = component(({ productId }) => {
  const { data: productData } = useProductById(productId)

  if (productData) {
    const { product } = productData
    const { images } = product
    if (detectIsUndefined(images)) {
      return null
    }

    const previews = []
    for (let i = 0, len = images.length; i < len; i++) {
      const image = images[i]
      previews.push(<Preview src={image.url} alt={image.alt} />)
    }

    return (
      <div>
        {previews}
        {JSON.stringify(images)}
        {/* TODO mark thumbnail image */}
      </div>
    )
  }

  return null
})

const Images = component(() => {
  const { t } = useTranslation('product.images')
  const params = useParams()
  const productId = params.get('id')

  return (
    <Card>
      <Card.Header title={t('title')}>
        <AddImageButton productId={productId} />
      </Card.Header>
      <ImagesPreview productId={productId} />
    </Card>

  )
})

export default Images
