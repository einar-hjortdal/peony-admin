import { component } from '@dark-engine/core'
import CardDefault from '../cards/CardDefault'
import CardHeader from '../cards/CardHeader'
import { useTranslation } from '@wareme/translations'
import Checkbox from '../input/Checkbox'

const Status = component(({ isActive, isInternal, onChange }) => {
  const { t } = useTranslation('categories.status')

  const handleChange = (e) => {
    const { name, checked } = e.target
    onChange({ [name]: checked })
  }

  return (
    <CardDefault>
      <CardHeader title={t('title')} />
      <Checkbox
        name='isActive'
        value={isActive}
        onChange={handleChange}
      >{t('isActive')}
      </Checkbox>

      <Checkbox
        name='isInternal'
        value={isInternal}
        onChange={handleChange}
      >{t('isInternal')}
      </Checkbox>
    </CardDefault>
  )
})

export default Status
