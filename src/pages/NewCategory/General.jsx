import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import TranslationDefaultInputs from '../../components/categories/TranslationDefaultInputs'

const General = component(({ translations, onTranslationsChange }) => {
  const { t } = useTranslation('newCategory.general')

  return (
    <CardDefault>
      <CardHeader title={t('title')} />
      <TranslationDefaultInputs translations={translations} onChange={onTranslationsChange} />
    </CardDefault>
  )
})

export default General
