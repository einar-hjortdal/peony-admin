import { component, detectIsEmpty, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import SetTitle from '../../components/SetTitle'
import { useSalesChannels, useStore, useStoreUpdateMutation } from '../../data'
import Locales from './Locales'
import Currencies from './Currencies'
import SalesChannels from './SalesChannels'
import DefaultLocale from './DefaultLocale'
import ColumnLarge from '../../components/columns/ColumnLarge'
import ColumnSmall from '../../components/columns/ColumnSmall'
import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'

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
      defaultRegionId,
      defaultStockLocationId,
      defaultSalesChannelId
    } = storeData.store

    const defaultLocaleCode = localesObject[defaultLocaleId]

    const defaultSalesChannel = salesChannelsObject[defaultSalesChannelId]
    const defaultSalesChannelName = defaultSalesChannel.name

    return (
      <>
        <SetTitle title={t('title')} />
        <ColumnLarge>
          <CardDefault>
            <CardHeader title={t('title')} />
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
              <span>default region id</span>
              <span>{defaultRegionId}</span>
            </div>
            <div>
              <span>{t('defaultStockLocation')}</span>
              <span>{defaultStockLocationId}</span>
            </div>
            <div>
              <span>{t('defaultSalesChannel')}</span>
              <span>{defaultSalesChannelName}</span>
            </div>
          </CardDefault>

          <Locales />
          <Currencies />
          <SalesChannels />
        </ColumnLarge>

        <ColumnSmall>
          <DefaultLocale />
        </ColumnSmall>

      </>
    )
  }

  return null
})

export default Store
