import { component } from '@dark-engine/core'
import { Link } from '@dark-engine/web-router'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import Card from '../components/Card'

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

const SettingCardTitle = styled.h2`
  font-size: 130%;
  padding: 0 0 1.5rem;
`

const SettingCardDescription = styled.p`
  color: ${p => p.theme.secondary};
`

const SettingCard = component(({ to, title, description }) => {
  return (
    <Box>
      <Link to={to}>
        <Card>
          <SettingCardTitle>{title}</SettingCardTitle>
          <SettingCardDescription>{description}</SettingCardDescription>
        </Card>
      </Link>
    </Box>
  )
})

const Settings = component(() => {
  const { t } = useTranslation('settings')

  return (
    <>
      <SettingCard
        to='/regions'
        title={t('regions.title')}
        description={t('regions.description')}
      />
      <SettingCard
        to='/sales-channels'
        title={t('salesChannels.title')}
        description={t('salesChannels.description')}
      />
      {/* <SettingCard
        to='/taxes'
        title={t('taxes.title')}
        description={t('taxes.description')}
      />
      <SettingCard
        to='/users'
        title={t('users.title')}
        description={t('users.description')}
      /> */}
      <SettingCard
        to='/store'
        title={t('store.title')}
        description={t('store.description')}
      />
      {/* TODO team, api keys, returns */}
    </>
  )
})

export default Settings
