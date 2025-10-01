import { component } from '@dark-engine/core'

import { useStore } from '../../data'
import If from '../If'
import AccordionItem from '../AccordionItem'

const TranslationsInputs = component(() => {
  const { data: storeData } = useStore()

  if (storeData) {
    const { store } = storeData
    const { defaultLocaleId, locales } = store

    return (
      <If condition={locales.length > 1}>
        <AccordionItem title={t('translations')}>
          <Translations
            locales={locales}
            defaultLocaleId={defaultLocaleId}
            onInput={handleTranslationInput}
            disabled={createProductIsFetching}
          />
        </AccordionItem>
      </If>
    )
  }
})

export default TranslationsInputs
