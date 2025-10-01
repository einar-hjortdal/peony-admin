import { component, detectIsString } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useLocaleById, useProductById, useStore } from '../../data'
import If from '../../components/If'

const Translation = component(({ localeId, title, subtitle, description }) => {
  const { data: localeData } = useLocaleById(localeId)
  const { t, translator } = useTranslation('product.translationGroup')

  if (localeData) {
    const { code } = localeData.locale
    return (
      <div>
        <span>{translator.formatName(code, { type: 'language' })}</span>

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
  }
})

const Translations = component(({ productId }) => {
  const { data: productData } = useProductById(productId)
  const { data: storeData } = useStore()

  if (storeData && productData) {
    const { translations } = productData.product
    const { defaultLocaleId } = storeData.store

    if (translations.length === 1) {
      return null
    }

    const res = []
    for (let i = 0, len = translations.length; i < len; i++) {
      const translation = translations[i]
      const { localeId, title, subtitle, description } = translation

      if (localeId === defaultLocaleId) {
        continue
      }

      res.push(
        <Translation
          localeCode={localeId}
          title={title}
          subtitle={subtitle}
          description={description}
        />
      )
    }
  }
})

export default Translations
