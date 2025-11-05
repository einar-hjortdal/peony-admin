import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Text from '../../../components/input/Text'

const Identification = component(({ variantData, onChange }) => {
  const { t } = useTranslation('variants.identification')

  const handleInput = (event) => {
    const { name, value } = event.target
    onChange({ [name]: value })
  }

  return (
    <div>
      <Text
        maxLength={63}
        name='title'
        onInput={handleInput}
        value={variantData.title}
        placeholder={t('titlePlaceholder')}
      >{t('title')}
      </Text>

      <Text
        maxLength={63}
        autoComplete='off'
        name='barcode'
        onInput={handleInput}
        value={variantData.barcode}
        placeholder={t('barcodePlaceholder')}
      >{t('barcode')}
      </Text>

      <Text
        maxLength={13}
        autoComplete='off'
        name='ean'
        onInput={handleInput}
        value={variantData.ean}
        placeholder={t('eanPlaceholder')}
      >{t('ean')}
      </Text>

      <Text
        maxLength={12}
        autoComplete='off'
        name='upc'
        onInput={handleInput}
        value={variantData.upc}
        placeholder={t('upcPlaceholder')}
      >{t('upc')}
      </Text>
    </div>
  )
})

export default Identification
