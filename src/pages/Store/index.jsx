import { component, detectIsEmpty, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../../components/SetTitle'
import { useStore, useStoreUpdateMutation } from '../../data'
import Languages from './Languages'
import Currencies from './Currencies'

const Store = component(() => {
  const { t } = useTranslation('store')
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError
  } = useStore()

  const [updateStore, {
    data: updateStoreData,
    isFetching: updateStoreIsFetching,
    error: updateStoreError
  }] = useStoreUpdateMutation()

  const [storeName, setStoreName] = useState('')
  useEffect(() => {
    if (detectIsEmpty(storeData)) {
      return
    }

    const { name } = storeData.store
    setStoreName(name)
  }, [storeData])

  const isDisabled = () => {
    return storeIsFetching || updateStoreIsFetching
  }

  const handleInput = (e) => {
    const { value } = e.target
    setStoreName(value)
  }

  const handleSave = () => {
    updateStore(storeData.store.id, { name: storeName })
  }

  if (storeData) {
    return (
      <>
        <SetTitle title={t('title')} />
        <div>
          <h1>{t('title')}</h1>
          <div>
            <label>
              {t('name')}
              <input type='text' name='name' value={storeName} onInput={handleInput} />
            </label>
            <button type='button' onClick={handleSave} disabled={isDisabled()}>{t('save')}</button>
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
