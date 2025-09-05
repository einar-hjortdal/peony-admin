import { component } from '@dark-engine/core'
import { styled } from '@dark-engine/styled'
import { useTranslation } from '@wareme/translations'

import { useStore, useStoreUpdateMutation } from '../../data'
import Card from '../../components/Card'

const DefaultLocaleSelect = styled.select`
  display: block;
  width: 100%;
`

const DefaultLocale = component(() => {
  const { t } = useTranslation('locales.defaultLocale')
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

  const handleChange = (e) => {
    if (updateStoreIsFetching) {
      return
    }
    const { value } = e.target
    updateStore(storeData.store.id, { defaultLocaleId: value })
  }

  if (storeData) {
    const { locales, defaultLocaleId } = storeData.store
    const options = []
    for (let i = 0, len = locales.length; i < len; i++) {
      const { id, code } = locales[i]
      options.push(
        <option
          key={id}
          value={id}
          selected={defaultLocaleId === id}
        >{code}
        </option>
      )
    }

    return (
      <Card>
        <Card.Header title={t('title')} />
        <Card.Body>
          <label>
            {t('description')}
            <DefaultLocaleSelect
              title={t('title')}
              name={t('title')}
              onChange={handleChange}
              disabled={updateStoreIsFetching}
            >{options}
            </DefaultLocaleSelect>
          </label>
        </Card.Body>
      </Card>
    )
  }
})

export default DefaultLocale
