import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'
import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'

const SearchEngines = component(({ handle, onHandleChange }) => {
  const { t } = useTranslation('SearchEngines')

  return (
    <CardDefault>
      <CardHeader title={t('title')} />
    </CardDefault>
  )
})

export default SearchEngines
