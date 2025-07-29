import { component, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../../components/SetTitle'
import { useStore } from '../../data'
import Languages from './Languages'
import Currencies from './Currencies'

const Store = component(() => {
  const { t } = useTranslation('store')
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()

  if (storeData) {
    const { name } = storeData.store
    return (
      <>
        <SetTitle title={t('title')} />
        <div>
          <h1>{t('title')}</h1>
          <div>
            <label>
              {t('name')}
              <input type='text' name='name' value={name} />
            </label>
          </div>
          <Languages />
          <Currencies />
        </div>
      </>
    )
  }

  return false
})

export default Store
