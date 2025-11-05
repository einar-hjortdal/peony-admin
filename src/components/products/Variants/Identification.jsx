import { component, useEffect, useState } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import Text from '../../../components/input/Text'
import CardDefault from '../../cards/CardDefault'
import CardHeader from '../../cards/CardHeader'
import PrimaryButton from '../../buttons/PrimaryButton'

const Identification = component(({ variantData, onChange, disabled }) => {
  const { t } = useTranslation('variant.identification')
  const [identificationData, setIdentificationData] = useState(variantData)
  useEffect(() => {
    const { title, barcode, ean, upc } = variantData
    setIdentificationData({ title, barcode, ean, upc })
  }, [variantData])

  const handleInput = (event) => {
    const { name, value } = event.target
    setIdentificationData((prevState) => {
      return { ...prevState, [name]: value }
    })
  }

  const handleSave = () => {
    // TODO only submit changes
    onChange(identificationData)
  }

  const { title, barcode, ean, upc } = identificationData
  return (
    <CardDefault>
      <CardHeader title={t('identification')} />

      <div>
        <Text
          maxLength={63}
          name='title'
          onInput={handleInput}
          value={title}
          placeholder={t('titlePlaceholder')}
        >{t('title')}
        </Text>

        <Text
          maxLength={63}
          autoComplete='off'
          name='barcode'
          onInput={handleInput}
          value={barcode}
          placeholder={t('barcodePlaceholder')}
        >{t('barcode')}
        </Text>

        <Text
          maxLength={13}
          autoComplete='off'
          name='ean'
          onInput={handleInput}
          value={ean}
          placeholder={t('eanPlaceholder')}
        >{t('ean')}
        </Text>

        <Text
          maxLength={12}
          autoComplete='off'
          name='upc'
          onInput={handleInput}
          value={upc}
          placeholder={t('upcPlaceholder')}
        >{t('upc')}
        </Text>
      </div>

      <div>
        <PrimaryButton
          type='button'
          onClick={handleSave}
          disabled={disabled}
        >{t('save')}
        </PrimaryButton>
      </div>
    </CardDefault>
  )
})

export default Identification
