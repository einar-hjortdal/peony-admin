import { component, detectIsString } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useLocaleById, useProductById, useStore } from '../../data'
import If from '../../components/If'
import CardDefault from '../../components/Cards/CardDefault'
import CardHeader from '../../components/Cards/CardHeader'
import { useParams } from '@dark-engine/web-router'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import ButtonMore from '../../components/Buttons/ButtonMore'

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

const Translations = component(() => {
  const params = useParams()
  const productId = params.get('id')
  const { t } = useTranslation('product.translations')
  const { data: productData } = useProductById(productId)
  const { data: storeData } = useStore()

  if (storeData && productData) {
    const { translations } = productData.product
    const { defaultLocaleId, locales } = storeData.store

    // Don't do any more work if store only has one locale
    if (locales.length === 1) {
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

    return (
      <CardDefault>
        <CardHeader title={t('title')}>
          <ButtonMore>
            <ul>
              <li>
                edit
              </li>
              <li>
                delete all
              </li>
            </ul>
          </ButtonMore>
        </CardHeader>
        {res}
      </CardDefault>
    )
  }
})

export default Translations
