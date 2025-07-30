import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../components/SetTitle'
import { useRegions } from '../data'

// TODO each row opens modal to update region: currency, tax...
const RegionRow = component(({ region }) => {
  const { name, currencyCode, includesTax } = region
  return (
    <li>
      <span>{name}</span>
      <span>{currencyCode}</span>
      <span>{includesTax}</span>
    </li>
  )
})

const Regions = component(() => {
  const { t } = useTranslation('regions')
  const { data: regionsData } = useRegions()

  if (regionsData) {
    const { regions } = regionsData
    const listItems = []
    for (let i = 0, len = regions.length; i < len; i++) {
      const region = regions[i]
      listItems.push(<RegionRow regions={region} />)
    }

    return (
      <>
        <SetTitle title={t('title')} />
        <h1>{t('heading')}</h1>
        <div>
          <ul>
            {listItems}
          </ul>
        </div>
      </>
    )
  }

  return false
})

export default Regions
