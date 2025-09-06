import { component, detectIsUndefined, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useProductById } from '../../data'
import Card from '../../components/Card'
import EditOptions from './EditOptions'
import If from '../../components/If'
import ButtonMore from '../../components/Buttons/ButtonMore'

const ExistingOptions = component(({ productId }) => {
  const { data: productData } = useProductById(productId)

  if (productData) {
    const { product } = productData
    const { options } = product
    if (detectIsUndefined(options)) {
      return null
    }

    const rows = []
    for (let i = 0, len = options.length; i < len; i++) {
      const option = options[i]
      const { translations, values } = option
      rows.push(
        <li>
          TODO name
          TODO values
          <ButtonMore type='button'>
            actions
          </ButtonMore>
        </li>
      )
    }

    return (<ul>{rows}</ul>)
  }

  return null
})

const Options = component(() => {
  const { t } = useTranslation('product.options')
  const params = useParams()
  const productId = params.get('id')
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Card>
      <Card.Header title={t('title')}>
        <ButtonMore type='button' onClick={toggleMenu}>
          <If condition={isOpen}>
            <ButtonMore.Container>
              <ul>
                <li><EditOptions productId={productId} /></li>
              </ul>
            </ButtonMore.Container>
          </If>
        </ButtonMore>
      </Card.Header>

      <ExistingOptions productId={productId} />
    </Card>
  )
})
export default Options
