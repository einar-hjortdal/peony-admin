import {
  component,
  detectIsUndefined,
  useState,
  useRef,
  detectIsNull
} from '@dark-engine/core'

import { useProductById, useUploadProductImageMutation } from '../../data'

const ExistingImages = component(({ images }) => {
  if (detectIsUndefined(images)) {
    return false
  }

  const res = []
  for (let i = 0, len = images.length; i < len; i++) {
    const image = images[i]
    res.push(<img src={image.url} />)
  }
  return res
})

const Images = component(({ productId }) => {
  const { data } = useProductById(productId)
  const modalRef = useRef(null)
  const inputRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const {
    uploadProductImages,
    isFetching: uploadProductImagesIsFetching,
    error: uploadProductImagesError
  } = useUploadProductImageMutation(productId)

  // Prevent file chooser from opening twice
  const handleLabelClick = (e) => {
    e.preventDefault()
  }

  const handleFileChange = (e) => {
    const filesArray = []
    const fileList = e.target.files
    for (let i = 0, len = fileList.length; i < len; i++) {
      filesArray.push(fileList[i])
    }
    setSelectedFiles(filesArray)
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
    setSelectedFiles([])
    modalRef.current.close()
  }

  const isSubmitDisabled = () => {
    return uploadProductImagesIsFetching || (selectedFiles.length === 0)
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    for (let i = 0, len = selectedFiles.length; i < len; i++) {
      formData.append('files', selectedFiles[i])
    }

    await uploadProductImages(formData)
    // maybe keep modal open on error?
    handleCloseModal()
  }

  if (data) {
    const { images } = data.product
    return (
      <div>
        <button type='button' onClick={handleOpenModal}>add image</button>
        <dialog ref={modalRef}>
          <label onClick={handleLabelClick}>
            select image
            <input
              ref={inputRef}
              type='file'
              multiple
              onChange={handleFileChange}
            />
          </label>
          <button
            type='button'
            onClick={handleSubmit}
            disabled={isSubmitDisabled()}
          >upload
          </button>
        </dialog>
        <ExistingImages images={images} />
      </div>
    )
  }

  return false
})

export default Images
