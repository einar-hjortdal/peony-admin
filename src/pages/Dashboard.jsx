import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useUser } from '../data'
import SetTitle from '../components/SetTitle'

const Dashboard = component(() => {
  const { t } = useTranslation('dashboard')
  const { data } = useUser()

  const res = []
  for (let i = 30; i > 0; i--) {
    res.push(JSON.stringify(data))
  }

  return (
    <>
      <SetTitle title={t('title')} />
      {res}
    </>
  )
})

export default Dashboard
