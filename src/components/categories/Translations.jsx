import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'
import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'

const Translations = component(({ onChange }) => {
  const { t } = useTranslation('categories.translations')
  const { data: storeData } = useStore()

  if (storeData) {
    const { locales } = storeData.store
    if (locales.length === 1) {
      return null
    }

    return (
      <CardDefault>
        <CardHeader title={t('title')} />

      </CardDefault>
    )
  }
})

export default Translations
