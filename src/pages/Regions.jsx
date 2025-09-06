import { component, detectIsNull, useRef } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../components/SetTitle'
import { useRegions } from '../data'

const AddRegion = component(() => {
  const modalRef = useRef(null)
  const { t } = useTranslation('regions.addRegion')

  const handleOpenModal = () => {
    if (detectIsNull(modalRef.current)) {
      return
    }
    return modalRef.current.showModal()
  }

  const handleCloseModal = () => {
    return modalRef.current.close()
  }

  return (
    <>
      <button
        type='button'
        onClick={handleOpenModal}
      >{t('add')}
      </button>
      <dialog ref={modalRef}>
        <div>
          <button type='button' onClick={handleCloseModal}>{t('close')}</button>
          <div>
            {/* country_codes   []string */}
            {/* currency_code   string */}
            {/* includes_tax    ?bool */}
            {/* name            string */}
            {/* rate_id         string */}
          </div>
        </div>
      </dialog>
    </>
  )
})

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
          <AddRegion />
          <ul>
            {listItems}
          </ul>
        </div>
      </>
    )
  }

  return null
})

export default Regions
