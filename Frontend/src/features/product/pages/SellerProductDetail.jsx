import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useUser } from '../../User/Hooks/useUser.js'
import { updateProduct, updateVariant } from '../services/product.api.js'
import { setOneProduct } from '../../User/state/user.slice.js'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
)

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
)

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/>
  </svg>
)

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
)

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹' }

// ─── Shared modal input style ─────────────────────────────────────────────────

const inputCls = "w-full bg-[#111] border border-[#1a1a1a] rounded-lg px-4 py-3 text-sm text-white placeholder-[#444] outline-none focus:border-[#EAB308]/40 transition-colors"
const labelCls = "block text-[10px] font-bold tracking-[0.2em] uppercase text-[#777] mb-1.5"

// ─── Edit Product Modal ───────────────────────────────────────────────────────

const EditProductModal = ({ product, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title:       product.title       ?? '',
    description: product.description ?? '',
    prizeAmount: product.prize?.amount ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState(null)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      if (form.title)       fd.append('title',       form.title)
      if (form.description) fd.append('description', form.description)
      if (form.prizeAmount) fd.append('prizeAmount', form.prizeAmount)
      const data = await updateProduct(product._id, fd)
      onSaved(data.product)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#1a1a1a]">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#EAB308]">Edit Product</p>
            <h2 className="text-lg font-black tracking-tight mt-0.5">Update Details</h2>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors p-1"><XIcon /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelCls}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} className={inputCls} placeholder="Product title" />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              className={`${inputCls} resize-none`} placeholder="Product description" />
          </div>
          <div>
            <label className={labelCls}>Base Price (₹)</label>
            <input name="prizeAmount" type="number" value={form.prizeAmount} onChange={handleChange}
              className={inputCls} placeholder="e.g. 1499" />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-[#1a1a1a] text-[#888] hover:text-white text-[11px] font-bold tracking-widest uppercase py-3 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#EAB308] hover:bg-[#d4a006] text-black text-[11px] font-bold tracking-widest uppercase py-3 rounded-lg transition-all disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Edit Variant Modal ───────────────────────────────────────────────────────

const EditVariantModal = ({ productId, variant, productCurrency, onClose, onSaved }) => {
  const sizeAttr = variant.attributes instanceof Map
    ? variant.attributes.get('size')
    : (variant.attributes?.size ?? Object.values(variant.attributes || {})[0] ?? '')

  const [form, setForm] = useState({
    size:        sizeAttr ?? '',
    stock:       variant.stock ?? 0,
    priceAmount: variant.price?.amount ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState(null)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('stock', form.stock)
      if (form.priceAmount) fd.append('priceAmount', form.priceAmount)
      fd.append('attributes', JSON.stringify({ size: form.size }))
      const data = await updateVariant(productId, variant._id, fd)
      onSaved(data.product)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message ?? 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#1a1a1a]">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#EAB308]">Edit Variant</p>
            <h2 className="text-lg font-black tracking-tight mt-0.5">Size · {sizeAttr ?? '—'}</h2>
          </div>
          <button onClick={onClose} className="text-[#555] hover:text-white transition-colors p-1"><XIcon /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelCls}>Size</label>
            <input name="size" value={form.size} onChange={handleChange} className={inputCls} placeholder="e.g. M, L, XL" />
          </div>
          <div>
            <label className={labelCls}>Stock</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className={inputCls} placeholder="0" />
          </div>
          <div>
            <label className={labelCls}>Variant Price (₹) <span className="text-[#555] normal-case">— leave blank to inherit base price</span></label>
            <input name="priceAmount" type="number" value={form.priceAmount} onChange={handleChange} className={inputCls} placeholder="Inherit from product" />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-[#1a1a1a] text-[#888] hover:text-white text-[11px] font-bold tracking-widest uppercase py-3 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-[#EAB308] hover:bg-[#d4a006] text-black text-[11px] font-bold tracking-widest uppercase py-3 rounded-lg transition-all disabled:opacity-50">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const SellerProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { handleOneProductData } = useUser()
  const product = useSelector(state => state.user.oneProduct)
  const [loading,  setLoading]         = useState(true)
  const [error,    setError]           = useState(null)
  const [mainImage, setMainImage]      = useState(0)
  const [editProduct, setEditProduct]  = useState(false)
  const [editVariant, setEditVariant]  = useState(null)  // holds the variant object being edited

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        await handleOneProductData(productId)
      } catch (err) {
        setError('Error loading product. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    if (productId) fetchProduct()
  }, [productId])

  // After a save, update Redux with the fresh product returned by the API
  const handleProductSaved = (updated) => {
    dispatch(setOneProduct(updated))
    setMainImage(0)
  }

  if (loading) {
    return (
      <div className="flex-1 bg-[#000000] text-white flex items-center justify-center min-h-[80vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#888] text-xs font-bold tracking-widest uppercase">Loading details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex-1 bg-[#000000] text-white flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-red-400 mb-4">{error || 'Product not found'}</p>
        <button onClick={() => navigate('/product/Dashboard')} className="text-[#EAB308] text-sm font-bold tracking-widest uppercase hover:underline">
          Return to Dashboard
        </button>
      </div>
    )
  }

  const currencySymbol = CURRENCY_SYMBOLS[product?.prize?.currency] || '₹'
  const variants = product?.variants || []

  const handlePrevImage = () => {
    if (product?.image?.length > 1) setMainImage(prev => (prev === 0 ? product.image.length - 1 : prev - 1))
  }
  const handleNextImage = () => {
    if (product?.image?.length > 1) setMainImage(prev => (prev === product.image.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="flex-1 bg-[#000000] text-white font-sans overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="max-w-[1440px] mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/product/Dashboard')} className="flex items-center gap-2 text-[#888] hover:text-white transition-colors">
            <ArrowLeftIcon />
            <span className="text-xs font-bold tracking-widest uppercase">Back</span>
          </button>

          {/* Edit Product button */}
          <button
            onClick={() => setEditProduct(true)}
            className="inline-flex items-center gap-2 bg-[#111] hover:bg-[#1a1a1a] border border-[#1a1a1a] hover:border-[#EAB308]/30 text-white text-[11px] font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-lg transition-all"
          >
            <EditIcon />
            Edit Product
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 w-full">
          {/* Left: Images */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="aspect-[4/5] bg-[#0E0E0E] rounded-2xl overflow-hidden relative group border border-[#1a1a1a]">
              {product?.image?.[mainImage]?.url ? (
                <>
                  <img
                    src={product.image[mainImage].url}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {product.image.length > 1 && (
                    <>
                      <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-md border border-white/10">
                        <ChevronLeftIcon />
                      </button>
                      <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 backdrop-blur-md border border-white/10">
                        <ChevronRightIcon />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#111]">
                  <span className="text-[#444] text-xs tracking-widest uppercase">No Image</span>
                </div>
              )}
            </div>
            {product?.image?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {product.image.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(idx)}
                    className={`shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      mainImage === idx ? 'border-[#EAB308]' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Variants */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-black tracking-tight mb-2">{product.title}</h1>
            <p className="text-xl text-yellow-400 font-bold mb-6">
              {currencySymbol}{Number(product?.prize?.amount).toLocaleString()}
            </p>
            <p className="text-[#888] text-sm leading-relaxed mb-8 max-w-2xl">{product.description}</p>

            {/* Variants Section */}
            <div className="mt-4 border-t border-[#1a1a1a] pt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold tracking-tight">Product Variants</h2>
                  <p className="text-[#666] text-xs mt-1">Manage different styles, sizes, or colors.</p>
                </div>
                <button
                  onClick={() => navigate(`/product/detail/${product._id}/create-variant`)}
                  className="inline-flex items-center gap-2 bg-[#EAB308] hover:bg-[#d4a006] text-black font-semibold text-xs px-4 py-2 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                >
                  <PlusIcon />
                  Add Variant
                </button>
              </div>

              {variants.length === 0 ? (
                <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-8 text-center flex flex-col items-center justify-center">
                  <p className="text-[#555] text-sm mb-4">No variants added yet.</p>
                  <button
                    onClick={() => navigate(`/product/detail/${product._id}/create-variant`)}
                    className="text-[#EAB308] text-xs font-bold tracking-widest uppercase hover:underline"
                  >
                    Create your first variant
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {variants.map((variant, index) => (
                    <div key={variant._id || index} className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl p-4 flex gap-4 group hover:border-[#EAB308]/20 transition-all">
                      {/* Variant Image */}
                      <div className="w-16 h-16 bg-[#111] rounded-lg overflow-hidden shrink-0">
                        {variant.images?.[0]?.url ? (
                          <img src={variant.images[0].url} alt="Variant" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#444] uppercase text-center">No Img</div>
                        )}
                      </div>
                      {/* Variant Info */}
                      <div className="flex-1 flex flex-col justify-center">
                        <div className="flex gap-2 mb-1 flex-wrap">
                          {variant.attributes && Object.entries(variant.attributes).map(([key, val]) => (
                            <span key={key} className="text-[10px] text-white bg-[#1a1a1a] px-2 py-0.5 rounded font-medium">
                              <span className="text-[#888]">{key}:</span> {val}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-yellow-400">
                            {currencySymbol}{Number(variant.price?.amount || product.prize?.amount).toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#666]">Stock: <span className="text-white">{variant.stock || 0}</span></span>
                        </div>
                      </div>
                      {/* Edit variant button */}
                      <button
                        onClick={() => setEditVariant(variant)}
                        className="self-start opacity-0 group-hover:opacity-100 transition-opacity bg-[#111] hover:bg-[#EAB308]/10 border border-[#1a1a1a] hover:border-[#EAB308]/30 text-[#888] hover:text-[#EAB308] p-1.5 rounded-lg"
                        title="Edit variant"
                      >
                        <EditIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {editProduct && (
        <EditProductModal
          product={product}
          onClose={() => setEditProduct(false)}
          onSaved={handleProductSaved}
        />
      )}
      {editVariant && (
        <EditVariantModal
          productId={product._id}
          variant={editVariant}
          productCurrency={product.prize?.currency}
          onClose={() => setEditVariant(null)}
          onSaved={handleProductSaved}
        />
      )}
    </div>
  )
}

export default SellerProductDetail
