import { component } from '@dark-engine/core'
import { Link } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import Card from '../components/Card'
import Button from '../components/Button'

const Settings = component(() => {
  const { t } = useTranslation('settings')

  return (
    <>
      <Card>
        <Card.Header>
          <Card.HeaderTitle>{t('title')}</Card.HeaderTitle>
        </Card.Header>

        <Button type='button' $variant='primary'><Link to='/currencies'>currencies</Link></Button>
        <Button type='button' $variant='primary'>regions</Button>
        <Button type='button' $variant='primary'>languages</Button>
        <Button type='button' $variant='primary'>sales channels</Button>
        <Button type='button' $variant='primary'>taxes</Button>
        <Button type='button' $variant='primary'>store details</Button>
        {/* TODO team, api keys, returns */}
      </Card>
    </>
  )
})

export default Settings
