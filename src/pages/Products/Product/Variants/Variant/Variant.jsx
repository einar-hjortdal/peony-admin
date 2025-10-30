import {
  component,
  detectIsNull,
  useEffect,
  useRef,
  useState
} from '@dark-engine/core'
import { useParams } from '@dark-engine/web-router'
import { useTranslation } from '@wareme/translations'

import { useProductVariantById, useProductVariantUpdateMutation } from '../../../../../data'
import MetadataInputs from '../../../../../components/input/Metadata'
import CardDefault from '../../../../../components/cards/CardDefault'
import CardHeader from '../../../../../components/cards/CardHeader'
import VariantInputs from '../../VariantInputs'
import SetTitle from '../../../../../components/SetTitle'

// TODO rework options: use select element.
// If no change, do not submit change (server will reject changes because variant already exists with
// the given option values)
// Detect when changes are reverted in order to not submit array of option value ids with same values
// as the original.
// TODO edit individual variant in own variant page instead of modal?
// TODO submit individual edits instead of all edits at once?
// TODO no form element, only controlled components.
const Variant = component(() => {
  const params = useParams()
  const productId = params.get('productId')
  const variantId = params.get('variantId')

  const { data: variantData } = useProductVariantById(productId, variantId)

  const { t } = useTranslation('variant')

  const [
    updateVariant,
    {
      isFetching: updateVariantIsFetching,
      error: updateVariantError
    }
  ] = useProductVariantUpdateMutation(productId, variantId)

  if (variantData) {
    const { variant } = variantData
    return (
      <>
        <SetTitle title={variant.title} />
        {t('title')}

        <CardDefault>
          <CardHeader title={t('general')} />
          <VariantInputs
            productId={productId}
            variantData={variant}
            setVariantData={console.log}
          />
        </CardDefault>

        <CardDefault>
          <CardHeader title={t('metadata')} />
          <MetadataInputs metadata={variant.metadata} onChange={console.log} />
        </CardDefault>

        <div>
          <button
            type='button'
            onClick={console.log}
            disabled={updateVariantIsFetching}
          >{t('save')}
          </button>
        </div>
      </>
    )
  }
})

export default Variant
