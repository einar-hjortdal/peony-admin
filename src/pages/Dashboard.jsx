import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useUser } from '../data'
import SetTitle from '../components/SetTitle'

const Dashboard = component(() => {
  const { t } = useTranslation('dashboard')
  const { data } = useUser()

  return (
    <>
      <SetTitle title={t('title')} />
      {data.first_name}
    </>
  )
})

export default Dashboard
