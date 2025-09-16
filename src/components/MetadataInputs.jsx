import { component, detectIsFunction, detectIsUndefined, hasKeys, keys, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

const MetadataInputs = component(({ metadata, onChange }) => {
  const { t } = useTranslation('metadataInputs')
  const [newMetadata, setNewMetadata] = useState({})

  const handleChange = (newState) => {
    setNewMetadata(newState)
    if (detectIsFunction(onChange)) {
      onChange(newState)
    }
  }

  useEffect(() => {
    if (detectIsUndefined(metadata)) {
      return
    }
    handleChange(metadata)
  }, [metadata])

  const handleDeleteKey = (e) => {
    const { name } = e.target
    const newState = { ...newMetadata }
    delete newState[name]
    handleChange(newState)
  }

  const handleAddKey = (e) => {
    const { value } = e.target
    const newState = { ...newMetadata }
    newState[value] = ''
    handleChange(newState)
  }

  const handleInputKey = (e) => {
    const { name, value } = e.target
    const newState = { ...newMetadata }
    const oldValue = newState[name]
    delete newState[name]
    newState[value] = oldValue
    handleChange(newState)
  }

  const handleInputValue = (e) => {
    const { name, value } = e.target
    const newState = { ...newMetadata }
    newState[name] = value
    handleChange(newState)
  }

  const rows = []

  if (hasKeys(newMetadata)) {
    const metadataKeys = keys(newMetadata)
    for (let i = 0, len = metadataKeys.length; i < len; i++) {
      const key = metadataKeys[i]
      const value = newMetadata[key]
      rows.push(
        <li key={key}>
          <input
            type='text'
            name={key}
            value={key}
            onInput={handleInputKey}
          />
          <input
            type='text'
            name={key}
            value={value}
            onInput={handleInputValue}
            placeholder={t('data')}
          />
          <button
            type='button'
            name={key}
            onClick={handleDeleteKey}
          >{t('delete')}
          </button>
        </li>
      )
    }
  }

  rows.push(
    <li>
      <input type='text' onBlur={handleAddKey} placeholder={t('newKey')} />
    </li>
  )

  return (<ul>{rows}</ul>)
})

export default MetadataInputs
