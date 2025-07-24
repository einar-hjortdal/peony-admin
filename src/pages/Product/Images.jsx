import {
  component,
  detectIsUndefined,
  useState,
  useRef,
  detectIsNull
} from '@dark-engine/core'

import { useProductById, useUploadsUploadMutation } from '../../data'

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
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadImage, { data: uploadImageData, error: uploadImageError }] = useUploadsUploadMutation()

  // Prevent file chooser from opening twice
  const handleLabelClick = (e) => {
    e.preventDefault()
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files)
  }

  const handleOpenModal = () => {
    if (detectIsNull(modalRef)) {
      return
    }
    modalRef.current.showModal()
  }

  const handleCloseModal = () => {
    setSelectedFile(null)
    modalRef.current.close()
  }

  const handleSubmit = async () => {
    const formData = new FormData()
    const file = selectedFile[0]
    formData.append('files', file)

    await uploadImage(formData, file.name)
    if (uploadImageData) {
      // once the upload is complete, create relation with product

    }

    if (uploadImageError) {
      // if upload fails, delete successfully uploaded image from server

    }

    handleCloseModal()
  }

  if (data) {
    const { images } = data
    return (
      <div>
        <button type='button' onClick={handleOpenModal}>add image</button>
        <dialog ref={modalRef}>
          <label onClick={handleLabelClick}>
            select image
            <input type='file' onChange={handleFileChange} />
          </label>
        </dialog>
        <ExistingImages images={images} />
      </div>
    )
  }

  return false
})

export default Images
