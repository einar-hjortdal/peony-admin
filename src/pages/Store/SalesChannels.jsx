import { component } from '@dark-engine/core'

import { useSalesChannels } from '../../data'

const SalesChannels = component(() => {
  const {
    data: salesChannelsData,
    isFetching: salesChannelsIsFetching,
    error: salesChannelsError,
    salesChannelsObject
  } = useSalesChannels()

  if (salesChannelsData) {
    const { salesChannels } = salesChannelsData
    const listItems = []
    for (let i = 0, len = salesChannels.length; i < len; i++) {
      const salesChannel = salesChannels[i]
      const { id, name, description, isDisabled } = salesChannel
      listItems.push(
        <li>
          <span>{name}</span>
          <span>{description}</span>
          <span>{isDisabled}</span>
        </li>
      )
    }

    return (
      <div>
        sales channels
        <ul>
          {listItems}
        </ul>
      </div>
    )
  }

  return false
})

export default SalesChannels
