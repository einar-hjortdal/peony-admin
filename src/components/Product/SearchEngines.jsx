import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import CardDefault from '../Cards/CardDefault'
import CardHeader from '../Cards/CardHeader'

const SearchEngines = component(({ handle, onHandleChange }) => {
  const { t } = useTranslation('SearchEngines')

  return (
    <CardDefault>
      <CardHeader title={t('title')} />
    </CardDefault>
  )
})

export default SearchEngines
