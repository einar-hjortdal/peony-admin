import { component, detectIsUndefined } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import { useStore } from '../../../data'
import Text from '../../input/Text'
import { getTranslation } from '../../../utils'

// TODO handle other translations
// TODO add delete translation
const ProductOptionValueEdit = component(({ optionValue, onInput }) => {
  const { t } = useTranslation('productOptionValueEdit')
  const { data: storeData } = useStore()

  const handleInput = (e) => {
    const { value } = e.target
    const { localeId } = e.target.dataset
    const { translations } = optionValue

    const newTranslations = [...translations]
    const translation = getTranslation(translations, localeId)
    const newTranslation = { localeId, name: value }

    if (detectIsUndefined(translation)) {
      newTranslations.push(newTranslation)
    } else {
      newTranslations[translation.index] = newTranslation
    }

    const newOptionValue = { ...optionValue, translations: newTranslations }
    onInput(newOptionValue)
  }

  if (storeData) {
    const { defaultLocaleId } = storeData.store
    const { translations } = optionValue
    const defaultTranslation = getTranslation(translations, defaultLocaleId).translation
    // if isDefault no delete button
    return (
      <Text
        value={defaultTranslation.name}
        data-locale-id={defaultLocaleId}
        placeholder={t('placeholder')}
        onInput={handleInput}
      >{t('values')}
      </Text>
    )
  }
})

export default ProductOptionValueEdit
