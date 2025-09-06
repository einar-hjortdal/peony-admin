import {
  component,
  detectIsArray,
  detectIsEmpty,
  detectIsNull,
  detectIsObject,
  detectIsString,
  detectIsUndefined,
  keys,
  useEffect,
  useMemo,
  useRef,
  useState
} from '@dark-engine/core'
import { useTranslation } from '@wareme/translations'

import {
  useStore,
  useProductById,
  useUpdateProductMutation,
  useDeleteVariantMutation
} from '../../data'
import Card from '../../components/Card'
import If from '../../components/If'
import { formatLine } from '../../utils'
import VariantAdd from './VariantAdd'
import EditPrices from './EditPrices'
import VariantEdit from './VariantEdit'
import { useParams } from '@dark-engine/web-router'
import ButtonMore from '../../components/Buttons/ButtonMore'

const Options = component(({ productId, slot }) => {
  const { t } = useTranslation('product.options')
  const { data, isFetching, error } = useProductById(productId)
  const {
    data: storeData,
    isFetching: storeIsFetching,
    error: storeError, localesObject
  } = useStore()

  const optionElements = useMemo(() => {
    if (detectIsEmpty(data) || detectIsEmpty(storeData)) {
      return []
    }

    const { defaultLocaleId } = storeData.store
    const { options } = data.product
    if (detectIsArray(options)) {
      const res = []
      for (let i = 0, len = options.length; i < len; i++) {
        const { translations } = options[i]
        for (let k = 0, tlen = translations.length; k < tlen; k++) {
          const translation = translations[k]
          const { localeId, title } = translation
          if (localeId === defaultLocaleId) {
            res.push(<span>{title}</span>)
            // TODO display translations on hover
            // TODO display values with translations on click
          }
        }
      }
      return res
    }

    return []
  }, [data, storeData])

  if (data && storeData) {
    return (
      <div>
        {t('options')}
        <div>{optionElements}</div>
      </div>
    )
  }
})

const VariantRowActions = component(({ productId, variant }) => {
  const [deleteVariant, { data, isFetching, error }] = useDeleteVariantMutation(productId)

  const handleDelete = () => {
    const { id } = variant
    deleteVariant(id)
  }

  return (
    <div>
      <ul>
        <li><VariantEdit productId={productId} variant={variant} /></li>
        <li><button>manage inventory</button></li>
        <li><button>duplicate variant</button></li>
        <li><button onClick={handleDelete} disabled={isFetching}>delete variant</button></li>
      </ul>
    </div>
  )
})

const VariantRowInventory = component(({ manageInventory, inventoryQuantity }) => {
  const { t } = useTranslation('product.variantRowInventory')
  if (manageInventory) {
    return inventoryQuantity
  }
  return t('unmanaged')
})

const VariantRow = component(({ productId, variant }) => {
  const { title, ean, upc, inventoryQuantity, inventoryItem } = variant
  const { manageInventory } = inventoryItem
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <tr>
      <td>{formatLine(title)}</td>
      <td>{formatLine(ean)}</td>
      <td>{formatLine(upc)}</td>
      <td>
        <VariantRowInventory
          manageInventory={manageInventory}
          inventoryQuantity={inventoryQuantity}
        />
      </td>
      <td>
        <button type='button' onClick={handleOpen}>
          ...
          <If condition={isOpen}>
            <VariantRowActions productId={productId} variant={variant} />
          </If>
        </button>
        {/* TODO dialog */}
      </td>
    </tr>
  )
})

const VariantsTable = component(({ productId }) => {
  const { data, isFetching, error } = useProductById(productId)
  const { t } = useTranslation('product.variantsTable')

  if (data) {
    const { variants } = data.product
    const rows = []
    if (detectIsArray(variants)) {
      for (let i = 0, len = variants.length; i < len; i++) {
        const variant = variants[i]
        rows.push(<VariantRow key={variant.id} productId={productId} variant={variant} />)
      }
    }

    return (
      <div>
        <table>
          <thead>
            <th>title</th>
            <th>ean</th>
            <th>upc</th>
            <th>inventory</th>
            <th>actions</th>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }

  return null
})

const Variants = component(() => {
  const { t } = useTranslation('product.variants')
  const params = useParams()
  const productId = params.get('id')

  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Card>
      <Card.Header title={t('title')}>
        <ButtonMore type='button' onClick={toggleMenu}>
          <If condition={isOpen}>
            <div>
              <ul>
                <li><EditPrices productId={productId} /></li>
              </ul>
            </div>
          </If>
        </ButtonMore>

        <VariantAdd productId={productId} />

      </Card.Header>
      <div>
        <Options productId={productId} />
      </div>
      <div>
        variants
        <VariantsTable productId={productId} />
      </div>
    </Card>
  )
})

export default Variants
