import {
  component,
  detectIsUndefined,
  useState,
  useRef,
  detectIsNull,
  useEffect,
  useId
} from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useUploadOneMutation } from '../../data'
import PrimaryButton from '../buttons/PrimaryButton'
import ModalDefault from '../modals/ModalDefault'
import ModalHeader from '../modals/ModalHeader'
import ModalBody from '../modals/ModalBody'
import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'
import HorizontalDots from '../svg/HorizontalDots'
import If from '../If'

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
  cursor: grab;

  &:hover button {
    opacity: 1;
  }

  &.dragging { 
    opacity: 0.6; 
  }
`

// Style differs from ButtonMore, but isn't used elsewhere.
const ActionsButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  background: rgba(0,0,0,0.5);
  color: white;
  border-radius: 50%;
  opacity: 0;
  cursor: pointer;
`

const StyledUl = styled.ul`
  position: absolute;
  border-radius: .3rem;
  top: 1.5rem;
  right: 0;
  white-space: nowrap;
  background-color: ${p => p.theme.bg};
  box-shadow: 0 .2rem 1.5rem 0 rgba(0, 0, 0, 0.25);
  padding-top: .3rem;
  padding-right: .3rem;
  padding-bottom: .3rem;
  padding-left: .3rem;
  min-width: 8rem;

  & li button {
    width: 100%;
    border-radius: .3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    text-align: left;
    cursor: pointer;
    color: inherit;
    background-color: inherit;
  }

  & li button:disabled {
    background-color: ${p => p.theme.neutral20};
  }

  & li button:hover {
    color: ${p => p.theme.bg};
    background-color: ${p => p.theme.active};
  }

  & li button:hover:disabled {
    color: inherit;
    background-color: ${p => p.theme.neutral20};
    cursor: auto;
  }
`

const ImagePreviewButton = component(({ slot }) => {
  const { t } = useTranslation('buttons.more')
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      <ActionsButton aria-label={t('label')} type='button' onClick={handleClick}>
        <HorizontalDots />
      </ActionsButton>

      <If condition={isOpen}>
        <StyledUl>
          {slot}
        </StyledUl>
      </If>
    </div>
  )
})

const StyledImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`

const ImagePreview = component(({ index, isThumbnail, onDelete, onThumbnailChange, ...props }) => {
  const { t } = useTranslation('product.images.preview')

  const handleDelete = () => {
    onDelete(index)
  }

  const handleThumbnailChange = () => {
    onThumbnailChange(index)
  }

  return (
    <ImagePreviewWrapper>
      <ImagePreviewButton>
        <li>
          <button
            type='button'
            onClick={handleDelete}
          >{t('delete')}
          </button>
        </li>
        <li>
          <button
            type='button'
            onClick={handleThumbnailChange}
            disabled={isThumbnail}
          >{t('setThumbnail')}
          </button>
        </li>
      </ImagePreviewButton>
      <StyledImg {...props} />
    </ImagePreviewWrapper>
  )
})

// TODO allow drag and drop to change imageRank
// Use https://github.com/trycatch-labs/dark/blob/master/examples/spring-draggable-list/index.tsx
const Preview = component(({ images, thumbnail, onOrderChange, onThumbnailChange, onDelete }) => {
  const { t } = useTranslation('product.images.preview')

  if (detectIsUndefined(images)) {
    return t('noImages')
  }

  const isThumbnail = (imageId, index) => {
    if (thumbnail) {
      return thumbnail.id === imageId
    }
    return index === 0
  }

  const previews = []
  for (let i = 0, len = images.length; i < len; i++) {
    const image = images[i]
    const { id, url, alt } = image
    previews.push(
      <ImagePreview
        key={id}
        index={i}
        isThumbnail={isThumbnail(id, i)}
        onDelete={onDelete}
        onThumbnailChange={onThumbnailChange}
        src={url}
        alt={alt}
      />
    )
  }

  return (
    <div>
      {previews}
    </div>
  )
})

// TODO on add: allow insert alt text (and translations) before confirming
// TODO edit button: allow editing alt text (and translations)
// TODO info for users:
// Every time images are uploaded and/or updated and/or order changes, thumbnail is reset.
// First upload, update, order images, then set thumbnail.
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

  const handleThumbnailChange = (thumbnailIndex) => {
    onThumbnailChange(thumbnailIndex)
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <AddImage images={images} onUpload={handleUpload} />
      </CardHeader>

      <Preview
        images={images}
        thumbnail={thumbnail}
        onOrderChange={handleOrderChange}
        onThumbnailChange={handleThumbnailChange}
        onDelete={handleDelete}
      />
    </CardDefault>
  )
})

export default Images
