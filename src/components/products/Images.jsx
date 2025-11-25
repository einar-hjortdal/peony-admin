import {
  component,
  detectIsUndefined,
  useState,
  useRef,
  detectIsNull,
  useEffect,
  useId
} from '@dark-engine/core'

import { useUploadOneMutation } from '../../data'
import { useTranslation } from '@wareme/translations'
import PrimaryButton from '../buttons/PrimaryButton'
import { styled } from '@dark-engine/styled'
import ModalDefault from '../modals/ModalDefault'
import ModalHeader from '../modals/ModalHeader'
import ModalBody from '../modals/ModalBody'
import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'

const AddImage = component(({ onUpload }) => {
  const { t } = useTranslation('product.addImage')
  const id = useId()
  const modalRef = useRef(null)
  const inputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [
    upload,
    {
      data: uploadData,
      isFetching: uploadIsFetching,
      error: uploadError
    }
  ] = useUploadOneMutation()

  useEffect(() => {
    if (uploadData) {
      const { url } = uploadData.upload
      const newImage = { url }
      onUpload(newImage)
    }
  }, [uploadData])

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
    return uploadIsFetching || detectIsNull(selectedFile)
  }

  const handleSubmit = async () => {
    await upload(selectedFile)
    // TODO display error
    if (detectIsNull(uploadError)) {
      handleCloseModal()
    }
  }

  return (
    <div>
      <PrimaryButton type='button' onClick={handleOpenModal}>{t('add')}</PrimaryButton>
      <ModalDefault ref={modalRef}>
        <ModalHeader title={t('title')} handleClose={handleCloseModal} />

        <ModalBody>
          <div>
            <label for={id} onClick={handleLabelClick}>{t('selectImage')}</label>
            <input
              id={id}
              ref={inputRef}
              type='file'
              onChange={handleFileChange}
            />

            <PrimaryButton
              type='button'
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
            >{t('upload')}
            </PrimaryButton>
          </div>

        </ModalBody>
      </ModalDefault>
    </div>
  )
})

const ImagePreviewWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 10rem;
  height: 14rem;
`

const StyledImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`

// TODO style right, show only when hovering image
const DeleteButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  background: rgba(0,0,0,0.5);
  color: white;
  border-radius: 50%;
  cursor: pointer;
`

const ImagePreview = component(({ index, onDelete, ...props }) => {
  const handleClick = (e) => {
    e.stopPropagation()
    onDelete(index)
  }

  return (
    <ImagePreviewWrapper>
      <DeleteButton
        type='button'
        aria-label='Remove image'
        title='Remove image'
        onClick={handleClick}
      >
        {/* Put your trash SVG here */}
        {/* Example placeholder: */}
        <svg width='14' height='14' viewBox='0 0 24 24' fill='none' aria-hidden>
          <path d='M3 6h18' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
          <path d='M8 6v12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
          <path d='M10 11v6M14 11v6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
        </svg>
      </DeleteButton>
      <StyledImg {...props} />
    </ImagePreviewWrapper>
  )
})

// TODO allow drag and drop to change imageRank
// TODO click to change alt translations
const Preview = component(({ images, onOrderChange, onDelete }) => {
  const { t } = useTranslation('product.images.preview')

  if (detectIsUndefined(images)) {
    return t('noImages')
  }

  const previews = []
  for (let i = 0, len = images.length; i < len; i++) {
    const image = images[i]
    const { id } = image
    previews.push(
      <ImagePreview
        key={id}
        onDelete={onDelete}
        index={i}
        src={image.url}
        alt={image.alt}
      />
    )
  }

  return (
    <div>
      {previews}
    </div>
  )
})

// TODO thumbnail
// TODO order
// TODO delete
const Images = component(({ images, thumbnail, onImagesChange, onThumbnailChange }) => {
  const { t } = useTranslation('product.images')

  const handleUpload = (newImage) => {
    if (images) {
      return onImagesChange([...images, newImage])
    }
    return onImagesChange([newImage])
  }

  const handleOrderChange = (newImages) => {
    onImagesChange(newImages)
  }

  const handleDelete = (deletedImageIndex) => {
    const newImages = [
      ...images.slice(0, deletedImageIndex),
      ...images.slice(deletedImageIndex + 1)
    ]
    onImagesChange(newImages)
  }

  // TODO rewrite thumbnail database handling: should be a table with a relation between product and image
  // create table product_thumbnail (product_id, image_id)
  // handle thumbnail independently so that a thumbnail can hidden from product images if user wishes
  // then implement handling admin app
  const handleThumbnailChange = (newThumbnail) => {
    onImagesChange(newThumbnail)
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <AddImage images={images} onUpload={handleUpload} />
      </CardHeader>

      {/* TODO thumbnail preview */}

      <Preview
        images={images}
        onOrderChange={handleOrderChange}
        onDelete={handleDelete}
      />
    </CardDefault>
  )
})

export default Images
