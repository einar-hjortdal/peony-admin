import {
  keys,
  detectIsEmpty,
  useMemo,
  detectIsUndefined,
  detectIsObject
} from '@dark-engine/core'
import { useApi, useQuery, useMutation } from '@dark-engine/data'

import { dataKeys } from './api'

export const constants = {
  orderAsc: 'ASC',
  orderDesc: 'DESC',
  statusDraft: 'draft',
  statusProposed: 'proposed',
  statusPublished: 'published',
  statusRejected: 'rejected'
}

// return a new object from the object p without any null/undefined values
const cleanParams = (p) => {
  const res = {}
  const k = keys(p)
  for (let i = 0, len = k.length; i < len; i++) {
    const key = k[i]
    if (detectIsEmpty(p[key])) {
      continue
    }
    res[key] = p[key]
  }
  return res
}

const getParams = (params) => {
  if (detectIsObject(params)) {
    const p = new URLSearchParams(cleanParams(params))
    p.sort()
    return p.toString()
  }
  return ''
}

export const useUser = () => {
  const api = useApi()
  return useQuery(dataKeys.getUser, () => api.getUserData())
}

export const useUserLoginMutation = () => {
  const api = useApi()
  return useMutation(
    dataKeys.authPost,
    (email, password) => api.loginUser(email, password),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.getUser)
      }
    }
  )
}

export const useUserLogoutMutation = () => {
  const api = useApi()
  return useMutation(dataKeys.authDelete, () => api.logoutUser(), {
    onSuccess: ({ cache }) => {
      cache.invalidate(dataKeys.authPost)
      cache.delete(dataKeys.authPost)
      cache.invalidate(dataKeys.getUser)
      cache.delete(dataKeys.getUser)
    }
  })
}

export const useStore = () => {
  const api = useApi()
  const { refetch, data, isFetching, error } = useQuery(dataKeys.storeGet, () =>
    api.storeGet()
  )

  const localesObject = useMemo(() => {
    const res = []
    if (detectIsEmpty(data)) {
      return res
    }

    const { locales } = data.store
    for (let i = 0, len = locales.length; i < len; i++) {
      const { id, code } = locales[i]
      res[id] = code
    }
    return res
  }, [data])

  return { refetch, data, isFetching, error, localesObject }
}

export const useStoreUpdateMutation = () => {
  const api = useApi()
  return useMutation(
    dataKeys.storeUpdate,
    (id, data) => api.storeUpdate(id, data),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.storeGet)
      }
    }
  )
}

export const useProducts = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.productsGet, () => api.productsGet(p), {
    variables: { p },
    extractId: (x) => x.p
  })
}

export const useProductById = (id) => {
  const api = useApi()
  const { refetch, data, isFetching, error } = useQuery(
    dataKeys.productGetById,
    () => api.productGetById(id),
    {
      variables: { id },
      extractId: (x) => x.id
    }
  )

  const translationsObject = useMemo(() => {
    const res = {}
    if (detectIsEmpty(data)) {
      return res
    }

    const { translations } = data.product
    if (detectIsUndefined(translations)) {
      return res
    }

    for (let i = 0, len = translations.length; i < len; i++) {
      const { localeId } = translations[i]
      res[localeId] = translations[i]
    }
    return res
  }, [data])

  return { refetch, data, isFetching, error, translationsObject }
}

export const useProductCreateMutation = () => {
  const api = useApi()
  return useMutation(
    dataKeys.productCreate, (data) => api.productCreate(data),
    {
      onSuccess: ({ cache }) => { cache.invalidate(dataKeys.productsGet) }
      // TODO onSuccess invalidate all dataKeys.productsGet from cache https://github.com/atellmer/dark/issues/107
    }
  )
}

export const useProductUpdateMutation = (id) => {
  const api = useApi()
  return useMutation(
    dataKeys.productUpdate,
    (data) => api.productUpdate(id, data),
    {
      variables: { id },
      extractId: (x) => x.id
    }
  )
}

export const useDeleteProductMutation = (id) => {
  const api = useApi()
  return useMutation(dataKeys.productDelete, () => api.productDelete(id), {
    variables: { id },
    extractId: (x) => x.id
  })
}

export const useProductCategoryCreateMutation = () => {
  const api = useApi()
  return useMutation(
    dataKeys.productCategoryCreate,
    (data) => api.productCategoryCreate(data),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.productCategoryGet)
        // TODO onSuccess invalidate all dataKeys.productCategoryGet from cache https://github.com/atellmer/dark/issues/107
      }
    }
  )
}

export const useProductCategoryUpdateMutation = (productCategoryId) => {
  const api = useApi()
  return useMutation(
    dataKeys.productCategoryUpdate,
    (data) => api.productCategoryUpdate(productCategoryId, data),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.productCategoryGet)
        // TODO onSuccess invalidate all dataKeys.productCategoryGet from cache https://github.com/atellmer/dark/issues/107
      }
    }
  )
}

export const useProductCategoryById = (productCategoryId) => {
  const api = useApi()
  return useQuery(dataKeys.productCategoryGetById, () => api.productCategoryGetById(productCategoryId), {
    variables: { productCategoryId },
    extractId: (x) => x.id
  })
}

export const useProductCategories = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.productCategoryGet, () => api.productCategoryGet(p), {
    variables: params,
    extractId: () => p
  })
}

export const useProductOptionCreateMutation = (productId) => {
  const api = useApi()
  return useMutation(
    dataKeys.productOptionCreate,
    (data) => api.productOptionCreate(productId, data),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.productGetById, { id: productId })
      }
    }
  )
}

export const useProductOptionUpdateMutation = (productId) => {
  const api = useApi()
  return useMutation(
    dataKeys.productOptionUpdate,
    (optionId, data) => api.productOptionUpdate(productId, optionId, data),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.productGetById, { id: productId })
      }
    }
  )
}

export const useProductOptionDeleteMutation = (productId) => {
  const api = useApi()
  return useMutation(
    dataKeys.productOptionDelete,
    (optionId) => api.productOptionDelete(productId, optionId),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.productGetById, { id: productId })
      }
    }
  )
}

export const useVariantCreateMutation = (productId) => {
  const api = useApi()
  return useMutation(
    dataKeys.productVariantCreate,
    (data) => api.productVariantCreate(productId, data),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.productGetById, { id: productId })
      }
    }
  )
}

export const useVariantUpdateMutation = (productId) => {
  const api = useApi()
  return useMutation(
    dataKeys.productVariantUpdate,
    (variantId, data) => api.productVariantUpdate(productId, variantId, data),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.productGetById, { id: productId })
      }
    }
  )
}

export const useDeleteVariantMutation = (productId) => {
  const api = useApi()
  return useMutation(dataKeys.productVariantDelete, (id) => api.productVariantDelete(id), {
    onSuccess: ({ cache }) => {
      cache.invalidate(dataKeys.productGetById, { id: productId })
    }
  })
}

// expects an object with variant_id keys and ProductVariantRequest values
export const useUpdateVariantsMutation = (productId) => {
  const api = useApi()
  return useMutation(
    dataKeys.variantUpdate,
    (variantsMoneyAmounts) => {
      const promises = []
      const variantIds = keys(variantsMoneyAmounts)
      for (let i = 0, len = variantIds.length; i < len; i++) {
        const variantId = variantIds[i]
        const productVariantRequest = variantsMoneyAmounts[variantId]
        promises.push(api.variantUpdate(productId, variantId, productVariantRequest))
      }
      return Promise.all(promises)
    },
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.productGetById, { id: productId })
      },
      onError: ({ cache }) => {
        // TODO
        // peony may succeed with one variant update but fail with another.
        // Invalidating product data helps the user see what was updated and what wasn't.
        // To prevent partial updates, implement variants updates in the product endpoint.
        // This way all variant updates would be inside the same transaction.
        cache.invalidate(dataKeys.productGetById, { id: productId })
      }
    }
  )
}

export const useCountries = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.countriesGet, () => api.countriesGet(p), {
    variables: { p },
    extractId: (x) => x.p
  })
}

export const useCurrencies = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.currencyGet, () => api.currencyGet(p), {
    variables: { p },
    extractId: (x) => x.p
  })
}

export const useRegions = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.regionsGet, () => api.regionsGet(p), {
    variables: { p },
    extractId: (x) => x.p
  })
}

export const useSalesChannels = (params) => {
  const api = useApi()
  const p = getParams(params)
  const { refetch, data, isFetching, error } = useQuery(
    dataKeys.salesChannelsGet,
    () => api.salesChannelsGet(p),
    {
      variables: { p },
      extractId: (x) => x.p
    }
  )

  const salesChannelsObject = useMemo(() => {
    if (detectIsEmpty(data)) {
      return
    }
    const { salesChannels } = data
    const res = {}
    for (let i = 0, len = salesChannels.length; i < len; i++) {
      const salesChannel = salesChannels[i]
      const { id } = salesChannel
      res[id] = salesChannel
    }
    return res
  }, [data])

  return { refetch, data, isFetching, error, salesChannelsObject }
}

export const useLocales = (params) => {
  const api = useApi()
  const p = getParams(params)
  return useQuery(dataKeys.localesGet, () => api.localesGet(p), {
    variables: { p },
    extractId: (x) => x.p
  })
}

export const useUpdateCurrencyMutation = () => {
  const api = useApi()
  return useMutation(
    dataKeys.currencyUpdate,
    (code, data) => api.currencyUpdate(code, data),
    {
      onSuccess: ({ cache }) => {
        cache.invalidate(dataKeys.storeGet)
      }
    }
  )
}

export const useUploadProductImageMutation = (productId) => {
  const api = useApi()
  const [
    updateProduct,
    { isFetching: updateProductIsFetching, error: updateProductError }
  ] = useProductUpdateMutation(productId)

  const [
    uploadImage,
    { isFetching: uploadImageIsFetching, error: uploadImageError }
  ] = useMutation(
    dataKeys.uploadsUploadOne,
    (file) => api.uploadsUploadOne(file),
    {
      onSuccess: ({ cache, data }) => {
        const images = []
        for (let i = 0, len = data.uploads.length; i < len; i++) {
          images.push(data.uploads(i).url)
        }
        updateProduct({ images })
        cache.invalidate(dataKeys.productGetById, { id: productId })
      }
    }
  )

  return {
    uploadProductImage: uploadImage,
    isFetching: updateProductIsFetching || uploadImageIsFetching,
    error: updateProductError || uploadImageError
  }
}

export const useUploadProductImagesMutation = (productId) => {
  const api = useApi()
  const [
    updateProduct,
    { isFetching: updateProductIsFetching, error: updateProductError }
  ] = useProductUpdateMutation(productId)

  const [
    uploadImages,
    { isFetching: uploadImagesIsFetching, error: uploadImagesError }
  ] = useMutation(
    dataKeys.uploadsUpload,
    (data, params) => api.uploadsUpload(data, params),
    {
      onSuccess: ({ cache, data }) => {
        const images = []
        for (let i = 0, len = data.uploads.length; i < len; i++) {
          images.push(data.uploads(i).url)
        }
        updateProduct({ images })
        cache.invalidate(dataKeys.productGetById, { id: productId })
      },
      onError: () => {
        // TODO delete files that may have been uploaded if needed
      }
    }
  )

  return {
    uploadProductImages: uploadImages,
    isFetching: updateProductIsFetching || uploadImagesIsFetching,
    error: updateProductError || uploadImagesError
  }
}

export const useDeleteProductImageMutation = (productId) => {
  const api = useApi()
  const { data: productData } = useProductById(productId)

  const [
    updateProduct,
    { isFetching: updateProductIsFetching, error: updateProductError }
  ] = useProductUpdateMutation(productId)

  const [
    deleteImage,
    { isFetching: deleteImageIsFetching, error: deleteImageError }
  ] = useMutation(dataKeys.uploadsDelete, (id) => api.uploadsDelete(id), {
    onSuccess: ({ cache, data }) => {
      const { id } = data
      const images = []
      for (let i = 0, len = productData.images.length; i < len; i++) {
        const { id: currentImageId, url: currentImageUrl } =
          productData.images[i]
        if (currentImageId === id) {
          continue
        }
        images.push(currentImageUrl)
      }
      updateProduct({ images })
      cache.invalidate(dataKeys.productGetById, { id: productId })
    }
  })

  return {
    deleteProductImage: deleteImage,
    isFetching: updateProductIsFetching || deleteImageIsFetching,
    error: updateProductError || deleteImageError
  }
}
