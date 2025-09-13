import { component } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { Translate, useTranslation } from '@wareme/translations'

import Card from '../../components/Card'
import { useProductById, useSalesChannels } from '../../data'
import { styled } from '@dark-engine/styled'
import ButtonMore from '../../components/Buttons/ButtonMore'

const SalesChannelsList = component(({ salesChannels }) => {
  if (salesChannels.length === 0) {
    return null
  }

  const li = []
  for (let i = 0, len = salesChannels.length; i < len; i++) {
    const salesChannel = salesChannels[i]
    const { id, name, isDisabled } = salesChannel
    li.push(
      <li key={id}>
        <span>{name}</span>
      </li>
    )
  }

  return <ul>{li}</ul>
})

const StyledSpan = styled.span`
  display: block;
  padding-top: 1.5rem;
  color: ${p => p.theme.neutral70};
`

const SalesChannelAvailability = component(({ productSalesChannels }) => {
  const { data: salesChannelsData } = useSalesChannels()

  if (salesChannelsData) {
    const { salesChannels } = salesChannelsData
    return (
      <StyledSpan>
        <Translate
          id='product.salesChannels.availability'
          values={{
            available: productSalesChannels.length,
            total: salesChannels.length
          }}
        />
      </StyledSpan>
    )
  }

  return null
})

const SalesChannels = component(() => {
  const { t } = useTranslation('product.salesChannels')
  const params = useParams()
  const productId = params.get('id')
  const {
    data: productData,
    isFetching: productIsFetching,
    error: productError
  } = useProductById(productId)

  if (productData) {
    const { salesChannels } = productData.product
    return (
      <Card>
        <Card.Header title={t('title')}>
          {/* TODO edit product sales channels */}
          <ButtonMore type='button' />
        </Card.Header>
        <SalesChannelsList salesChannels={salesChannels} />
        <SalesChannelAvailability productSalesChannels={salesChannels} />
        {/* TODO available in x out of y sales channels */}
      </Card>
    )
  }

  return null
})

export default SalesChannels
