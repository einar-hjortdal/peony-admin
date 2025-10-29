import {
  component,
  detectIsUndefined,
  useState,
  useRef,
  detectIsNull,
  useEffect
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

const AddImage = component(({ onUpload }) => {
  const { t } = useTranslation('product.addImage')
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

        </ModalBody>
      </ModalDefault>
    </div>
  )
})

// TODO allow drag and drop to change imageRank
// TODO click to change alt translations
const Preview = component(({ images }) => {
  const { t } = useTranslation('product.images.preview')

  if (detectIsUndefined(images)) {
    return t('noImages')
  }

  const previews = []
  for (let i = 0, len = images.length; i < len; i++) {
    const image = images[i]
    previews.push(<ImagePreview src={image.url} alt={image.alt} />)
  }

  return (
    <div>
      {previews}
      {/* TODO mark thumbnail image */}
    </div>
  )
})

const Images = component(({ images, onChange }) => {
  const { t } = useTranslation('product.images')

  const handleUpload = (newImage) => {
    if (images) {
      return onChange([...images, newImage])
    }
    return onChange([newImage])
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <AddImage images={images} onUpload={handleUpload} />
      </CardHeader>
      <Preview images={images} onChange={onChange} />
    </CardDefault>
  )
})

export default Images
