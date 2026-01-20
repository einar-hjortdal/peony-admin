import { component } from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import CardDefault from '../../components/cards/CardDefault'
import CardHeader from '../../components/cards/CardHeader'
import Text from '../../components/input/Text'
import Textarea from '../../components/input/Textarea'

const General = component(({ name, description, handleInput, translations, onTranslationsChange }) => {
  const { t } = useTranslation('newCategory.general')

  return (
    <CardDefault>
      <CardHeader title={t('title')} />
      <Text
        name='name'
        value={name}
        onInput={handleInput}
      >{t('name')}
      </Text>

      <Textarea
        name='description'
        value={description}
        onInput={handleInput}
      >{t('description')}
      </Textarea>
    </CardDefault>
  )
})

export default General
