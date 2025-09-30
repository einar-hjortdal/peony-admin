import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'
import { nisha } from '@wareme/utils'

import { useSalesChannels } from '../../data'
import { formatLine } from '../../utils'
import CardHeader from '../../components/Cards/CardHeader'
import CardDefault from '../../components/Cards/CardDefault'

const StyledTable = styled.table`
  width: 100%;
  border-spacing: unset;
  & tbody tr {
    background-color: ${p => nisha(p.$isEven, 'unset', p.theme.neutral10)};
  }
  & thead tr th,
  & tbody tr td {
    padding-top: .875rem;
    padding-right: .7rem;
    padding-bottom:.875rem;
    padding-left: .7rem;
    border-bottom: 1px solid ${p => p.theme.neutral20};
  }
  & thead tr th {
    text-align: unset;
  }
`

const Status = styled.span`
  color: ${p => p.theme.bg};
  background-color: ${p => nisha(p.$isDisabled, p.theme.danger, p.theme.success)};
  padding-top: .3rem;
  padding-right: .2rem;
  padding-bottom:.3rem;
  padding-left: .2rem;
  border-radius: .4rem;
`

const SalesChannels = component(() => {
  const { t } = useTranslation('store.salesChannels')
  const {
    data: salesChannelsData,
    isFetching: salesChannelsIsFetching,
    error: salesChannelsError,
    salesChannelsObject
  } = useSalesChannels()

  const getStatus = (isDisabled) => {
    if (isDisabled) {
      return 'disabled'
    }
    return 'enabled'
  }

  if (salesChannelsData) {
    const { salesChannels } = salesChannelsData
    const rows = []
    for (let i = 0, len = salesChannels.length; i < len; i++) {
      const salesChannel = salesChannels[i]
      const { id, name, description, isDisabled } = salesChannel
      const isEven = (i % 2) === 0
      rows.push(
        <tr key={id} $isEven={isEven}>
          <td>{name}</td>
          <td>{formatLine(description)}</td>
          <td>
            <Status $isDisabled={isDisabled}>{getStatus(isDisabled)}</Status>
          </td>
        </tr>
      )
    }

    return (
      <CardDefault>
        <CardHeader title={t('title')} />
        <StyledTable>
          <thead>
            <tr>
              <th>{t('name')}</th>
              <th>{t('description')}</th>
              <th>{t('status')}</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </StyledTable>
      </CardDefault>
    )
  }

  return null
})

export default SalesChannels
