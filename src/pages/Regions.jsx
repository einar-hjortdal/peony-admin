import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../components/SetTitle'

const Regions = component(() => {
  const { t } = useTranslation('regions')

  return (
    <>
      <SetTitle title={t('title')} />
      regions
    </>
  )
})

export default Regions
