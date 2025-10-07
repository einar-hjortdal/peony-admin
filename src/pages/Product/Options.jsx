import { component, detectIsUndefined, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useProductById } from '../../data'
import CardDefault from '../../components/Cards/CardDefault'
import EditOptions from './EditOptions'
import If from '../../components/If'
import ButtonMore from '../../components/Buttons/ButtonMore'
import CardHeader from '../../components/Cards/CardHeader'

const Existing = component(({ productId }) => {
  const { data: productData } = useProductById(productId)
  const { t } = useTranslation('product.options.existing')

  if (productData) {
    const { product } = productData
    const { options } = product
    if (detectIsUndefined(options)) {
      return t('noOptions')
    }

    const rows = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      const { translations, values } = option
      rows.push(
        <li>
          TODO name
          TODO values
          <ButtonMore>
            actions
          </ButtonMore>
        </li>
      )
    }

    return (<ul>{rows}</ul>)
  }
})

const Options = component(() => {
  const { t } = useTranslation('product.options')
  const params = useParams()
  const productId = params.get('id')

  return (
    <CardDefault>
      <CardHeader title={t('title')}>
        <ButtonMore>
          <li><EditOptions productId={productId} /></li>
        </ButtonMore>
      </CardHeader>

      <Existing productId={productId} />
    </CardDefault>
  )
})
export default Options
