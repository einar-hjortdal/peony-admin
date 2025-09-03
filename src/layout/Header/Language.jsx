import { component } from '@dark-engine/core'

import { languages, getMessages } from '../../translations'
import { useTranslation } from '@wareme/translations'

const Language = component(() => {
  const { t, translator } = useTranslation('header.language')

  console.log(translator)

  const handleChangeLanguage = async (e) => {
    const { value } = e.target
    const messages = await getMessages(value)
    translator.changeLanguage(value, messages)
  }

  const options = []
  for (let i = 0, len = languages.length; i < len; i++) {
    const language = languages[i]
    options.push(
      <option key={language} value={language}>
        {translator.formatName(language, { type: 'language' })}
      </option>
    )
  }

  return (
    <label>
      {t('language')}
      <select
        name='language'
        autoComplete='off'
        value={translator.currentLanguage}
        onChange={handleChangeLanguage}
      >
        {options}
      </select>
    </label>
  )
})

export default Language
