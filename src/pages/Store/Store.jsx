import { component, detectIsEmpty, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../../components/SetTitle'
import { useSalesChannels, useStore, useStoreUpdateMutation } from '../../data'
import Locales from './Locales'
import Currencies from './Currencies'
import SalesChannels from './SalesChannels'
import Card from '../../components/Card'
import CardContainerFull from '../../components/Containers/CardContainerFull'

const Store = component(() => {
  const { t } = useTranslation('store')
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError,
    localesObject
  } = useStore()

  const {
    data: salesChannelsData,
    isFetching: salesChannelsIsFetching,
    error: salesChannelsError,
    salesChannelsObject
  } = useSalesChannels()

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

  if (storeData && salesChannelsData) {
    const {
      defaultLocaleId,
      defaultCurrencyCode,
      defaultStockLocationId,
      defaultSalesChannelId
    } = storeData.store

    const defaultLocaleCode = localesObject[defaultLocaleId]

    const defaultSalesChannel = salesChannelsObject[defaultSalesChannelId]
    const defaultSalesChannelName = defaultSalesChannel.name

    return (
      <>
        <SetTitle title={t('title')} />
        <CardContainerFull>
          <Card>
            <Card.Header title={t('title')} />
            <Card.Body>
              <div>
                <label>
                  {t('name')}
                  <input type='text' name='name' value={storeName} onInput={handleInput} />
                </label>
                <button type='button' onClick={handleSave} disabled={isDisabled()}>{t('save')}</button>
              </div>
              <div>
                <span>{t('defaultCurrency')}</span>
                <span>{defaultCurrencyCode}</span>
              </div>
              <div>
                <span>{t('defaultLocale')}</span>
                <span>{defaultLocaleCode}</span>
              </div>
              <div>
                <span>{t('defaultStockLocation')}</span>
                <span>{defaultStockLocationId}</span>
              </div>
              <div>
                <span>{t('defaultSalesChannel')}</span>
                <span>{defaultSalesChannelName}</span>
              </div>
            </Card.Body>
          </Card>
        </CardContainerFull>

        <Locales />
        <Currencies />

        <CardContainerFull>
          <SalesChannels />
        </CardContainerFull>
      </>
    )
  }

  return false
})

export default Store
