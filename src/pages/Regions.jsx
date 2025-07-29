import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../components/SetTitle'

const Regions = component(() => {
  const { t } = useTranslation('regions')

  return (
    <>
      <SetTitle title={t('title')} />
      <div>
        TODO list regions, each row opens modal to update region: currency, tax...
      </div>
    </>
  )
})

export default Regions
