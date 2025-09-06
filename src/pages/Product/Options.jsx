import { component, useState } from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import Card from '../../components/Card'
import EditOptions from './EditOptions'
import If from '../../components/If'

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
        <button type='button' onClick={toggleMenu}>...</button>
        <If condition={isOpen}>
          <div>
            <ul>
              <li><EditOptions productId={productId} /></li>
            </ul>
          </div>
        </If>
      </Card.Header>
    </Card>
  )
})
export default Options
