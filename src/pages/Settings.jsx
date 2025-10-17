import { component } from '@dark-engine/core'
import { Link } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import CardDefault from '../components/cards/CardDefault'
import CardHeader from '../components/cards/CardHeader'

const Box = styled.div`
  display: inline-block;
  width: 50%;
  padding: .75rem;
  box-sizing: border-box;
  & a {
    color: unset;
    text-decoration: none;
  }
`

const SettingCard = component(({ to, title, description }) => {
  return (
    <Box>
      <Link to={to}>
        <CardDefault>
          <CardHeader title={title} subtitle={description} />
        </CardDefault>
      </Link>
    </Box>
  )
})

const Settings = component(() => {
  const { t } = useTranslation('settings')

  return (
    <>
      <SettingCard
        to='/settings/regions'
        title={t('regions.title')}
        description={t('regions.description')}
      />
      {/* <SettingCard
        to='/settings/taxes'
        title={t('taxes.title')}
        description={t('taxes.description')}
      />
      <SettingCard
        to='/settings/users'
        title={t('users.title')}
        description={t('users.description')}
      /> */}
      <SettingCard
        to='/settings/store'
        title={t('store.title')}
        description={t('store.description')}
      />
      {/* TODO team, api keys, returns */}
    </>
  )
})

export default Settings
