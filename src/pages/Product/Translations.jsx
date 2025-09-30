import { component, detectIsString, detectIsUndefined } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useProductById, useStore } from '../../data'
import If from '../../components/If'

const TranslationGroup = component(({ locale, title, subtitle, description }) => {
  const { t, translator } = useTranslation('product.translationGroup')

  return (
    <div>
      {t('locale')}: {locale} <span>{translator.formatName(locale, { type: 'language' })}</span>

      <If condition={detectIsString(title)}>
        <div>
          {t('title')}: {title}
        </div>
      </If>

      <If condition={detectIsString(subtitle)}>
        <div>
          {t('subtitle')}: {subtitle}
        </div>
      </If>

      <If condition={detectIsString(description)}>
        <div>
          {t('description')}: {description}
        </div>
      </If>
    </div>
  )
})

const Translations = component(({ productId }) => {
  const { translationsObject } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()
  const { defaultLocaleId, locales } = storeData.store

  const res = []
  for (let i = 0, len = locales.length; i < len; i++) {
    const { id } = locales[i]
    if (defaultLocaleId === id) {
      continue
    }

    const translation = translationsObject[id]
    if (detectIsUndefined(translation)) {
      continue
    }

    res.push(
      <TranslationGroup
        locale={localesObject[id]}
        title={translation.title}
        subtitle={translation.subtitle}
        description={translation.description}
      />
    )
  }

  return res
})

export default Translations
