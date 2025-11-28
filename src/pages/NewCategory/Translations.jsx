import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../data'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import TranslationsInputs from '../../components/categories/TranslationsInputs'

const Translations = component(({ translations, onChange }) => {
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
        <TranslationsInputs translations={translations} onChange={onChange} />
      </CardDefault>
    )
  }
})

export default Translations
