import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../components/SetTitle'

const Orders = component(() => {
  const { t } = useTranslation('orders')

  return (
    <>
      <SetTitle title={t('title')} />
    </>
  )
})

export default Orders
