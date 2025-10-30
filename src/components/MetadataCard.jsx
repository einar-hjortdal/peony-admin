import { component, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Metadata from './input/Metadata'
import PrimaryButton from './buttons/PrimaryButton'
import CardDefault from './cards/CardDefault'
import CardHeader from './cards/CardHeader'

const MetadataCard = component(({ metadata, onChange }) => {
  const { t } = useTranslation('metadataCard')
  const [newMetadata, setNewMetadata] = useState(metadata)
  useEffect(() => {
    setNewMetadata(metadata)
  }, [metadata])

  const handleChange = (newState) => {
    setNewMetadata(newState)
  }

  const handleUpdate = () => {
    onChange({ metadata: newMetadata })
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />
      <Metadata metadata={newMetadata} onChange={handleChange} />
      <PrimaryButton type='button' onClick={handleUpdate}>{t('save')}</PrimaryButton>
    </CardDefault>
  )
})

export default MetadataCard
