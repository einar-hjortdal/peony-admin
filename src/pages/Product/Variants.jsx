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
  useUpdateProductMutation
} from '../../data'
import Card from '../../components/Card'
import If from '../../components/If'
import { formatLine } from './utils'
import AddVariant from './AddVariant'
import EditPrices from './EditPrices'
import EditOptions from './EditOptions'

const Options = component(({ productId, slot }) => {
  const { t } = useTranslation('product.options')
  const { data, isFetching, error } = useProductById(productId)
  const { data: storeData, isFetching: storeIsFetching, error: storeError, localesObject } = useStore()

  const optionElements = useMemo(() => {
    if (detectIsEmpty(data) || detectIsEmpty(storeData)) {
      return false
    }

    const { defaultLocaleId } = storeData
    const { options } = data
    if (detectIsArray(options)) {
      const res = []
      for (let i = 0, len = options.length; i < len; i++) {
        const { translations } = options[i]
        for (let k = 0, tlen = translations.length; k < tlen; k++) {
          const translation = translations[k]
          if (translation.localeId === defaultLocaleId) {
            const { title } = translation
            res.push(<div>{title}</div>)
            // TODO display translations
            // TODO display values
            // TODO display value translations
          }
        }
      }
      return res
    }

    return false
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

const VariantRowActions = component(({ id }) => {
  return (
    <div>
      <ul>
        <li><button>edit variant</button></li>
        <li><button>manage inventory</button></li>
        <li><button>duplicate variant</button></li>
        <li><button>delete variant</button></li>
      </ul>
    </div>
  )
})

const VariantRow = component(({ id, title, sku, ean }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleOpen = () => {
    setIsOpen(true)
  }

  return (
    <tr>
      <td>{formatLine(title)}</td>
      <td>{formatLine(sku)}</td>
      <td>{formatLine(ean)}</td>
      <td>
        <button type='button' onClick={handleOpen}>
          ...
          <If condition={isOpen}>
            <VariantRowActions />
          </If>
        </button>
        {/* TODO dialog */}
      </td>
    </tr>
  )
})

const VariantsTable = component(({ productId }) => {
  const { data, isFetching, error } = useProductById(productId)
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation('product.variantsTable')

  const handleOpen = () => {
    setIsOpen(true)
  }

  if (data) {
    const { variants } = data
    const rows = []
    if (detectIsArray(variants)) {
      for (let i = 0, len = variants.length; i < len; i++) {
        const { id, title, sku, ean } = variants[i]
        rows.push(<VariantRow key={id} id={id} title={title} sku={sku} ean={ean} />)
      }
    }

    return (
      <div>
        <button type='button' onClick={handleOpen}>
          ...
          <If condition={isOpen}>
            <div>
              <ul>
                <li><AddVariant productId={productId} /></li>
                <li><EditPrices productId={productId} /></li>
                <li><EditOptions productId={productId} /></li>
              </ul>
            </div>
          </If>
        </button>
        <table>
          <thead>
            <th>title</th>
            <th>sku</th>
            <th>ean</th>
            <th>actions</th>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    )
  }

  return false
})

const Variants = component(({ productId }) => {
  const { t } = useTranslation('product.variants')
  return (
    <Card>
      <div>
        {t('title')}
      </div>
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
