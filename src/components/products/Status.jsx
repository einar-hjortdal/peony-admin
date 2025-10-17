import { component, detectIsUndefined, useEffect } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'

const statusDraft = 'draft'
const statusProposed = 'proposed'
const statusPublished = 'published'
const statusRejected = 'rejected'
const allowedStatuses = [
  statusDraft,
  statusProposed,
  statusPublished,
  statusRejected
]
const defaultStatus = statusDraft

const Status = component(({ defaultValue, onChange }) => {
  const { t } = useTranslation('status')

  useEffect(() => {
    if (detectIsUndefined(defaultValue)) {
      onChange(defaultStatus)
    }
  }, [defaultValue])

  const handleChange = (e) => {
    const { value } = e.target
    onChange(value)
  }

  const options = []
  for (let i = 0, len = allowedStatuses.length; i < len; i++) {
    const status = allowedStatuses[i]
    options.push(<option key={status} value={status}>{status}</option>)
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />
      <select
        name='status'
        aria-label={t('label')}
        onChange={handleChange}
        defaultValue={defaultValue}
      >{options}
      </select>
    </CardDefault>
  )
})

export default Status
