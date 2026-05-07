import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useUser } from '../Hooks/useUser.js'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
)

const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
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

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹' }

const OneProduct = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { handleOneProductData } = useUser()
  const product = useSelector(state => state.user.oneProduct)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mainImage, setMainImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)

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

  useEffect(() => {
    setMainImage(0)
  }, [product, selectedVariant])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#EAB308] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#888] text-xs font-bold tracking-widest uppercase">Curating Details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error || 'Product not found'}</p>
        <Link to="/" className="text-[#EAB308] text-sm font-bold tracking-widest uppercase hover:underline">
          Return to Gallery
        </Link>
      </div>
    )
  }

  const currencySymbol = CURRENCY_SYMBOLS[product?.prize?.currency] || '₹'
  const displayPrice = selectedVariant?.price?.amount || product?.prize?.amount
  const displayImages = (selectedVariant?.images?.length > 0) ? selectedVariant.images : product?.image
  const variants = product?.variants || []

  // Group attributes for cleaner display if we wanted to, 
  // but for now let's just show variants as selectable tiles
  const handleSelectVariant = (variant) => {
    setSelectedVariant(prev => prev === variant ? null : variant)
  }

  const handlePrevImage = () => {
    if (displayImages?.length > 1) {
      setMainImage(prev => (prev === 0 ? displayImages.length - 1 : prev - 1))
    }
  }

  const handleNextImage = () => {
    if (displayImages?.length > 1) {
      setMainImage(prev => (prev === displayImages.length - 1 ? 0 : prev + 1))
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-yellow-400 selection:text-black">
      
      {/* ─── Navbar (Simplified) ───────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-[#888] hover:text-white transition-colors">
              <ArrowLeftIcon />
            </button>
            <Link to="/" className="text-xl font-black tracking-[0.25em] uppercase">SNITCH</Link>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-[#888] hover:text-white transition-colors">
              <BagIcon />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Product Section ───────────────────────────────────────────── */}
      <div className="pt-24 pb-16 px-6 lg:px-12 max-w-[1440px] mx-auto min-h-screen flex items-center">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 w-full">
          
          {/* Left: Images */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {/* Main Image */}
            <div className="aspect-[3/4] lg:aspect-[4/5] bg-[#0E0E0E] rounded-2xl overflow-hidden relative group border border-[#1a1a1a]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#EAB308]/[0.05] via-transparent to-transparent pointer-events-none z-10" />
              {displayImages?.[mainImage]?.url ? (
                <>
                  <img 
                    src={displayImages[mainImage].url} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {displayImages.length > 1 && (
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
            
            {/* Thumbnails */}
            {displayImages?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {displayImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(idx)}
                    className={`shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      mainImage === idx ? 'border-[#EAB308]' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <div className="mb-8">
              <p className="text-[#EAB308] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#EAB308]" />
                EXCLUSIVE EDITION
              </p>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.05] mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl text-white font-bold tracking-tight">
                  {currencySymbol}{Number(displayPrice).toLocaleString()}
                </span>
                <span className="text-xs text-[#EAB308] font-semibold tracking-widest uppercase px-2 py-1 bg-[#EAB308]/10 rounded border border-[#EAB308]/20">
                  {selectedVariant ? (selectedVariant.stock > 0 ? 'In Stock' : 'Out of Stock') : 'In Stock'}
                </span>
              </div>
              <p className="text-[#888] text-sm leading-relaxed max-w-lg">
                {product.description}
              </p>
            </div>

            {/* Variants Options */}
            {variants.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-bold tracking-widest uppercase mb-4 text-[#888]">Available Variants</h3>
                <div className="flex flex-wrap gap-3">
                  {variants.map((variant, idx) => (
                    <button
                      key={variant._id || idx}
                      onClick={() => handleSelectVariant(variant)}
                      className={`flex flex-col items-start p-3 border rounded-xl transition-all duration-300 min-w-[120px] ${
                        selectedVariant === variant 
                        ? 'border-[#EAB308] bg-[#EAB308]/10' 
                        : 'border-[#1a1a1a] bg-[#0e0e0e] hover:border-[#333]'
                      }`}
                    >
                      {/* Thumbnail if available */}
                      {variant.images?.[0]?.url && (
                        <div className="w-full h-16 bg-[#111] rounded-lg mb-3 overflow-hidden">
                          <img src={variant.images[0].url} alt="Variant" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {/* Attributes */}
                      <div className="flex gap-2 flex-wrap mb-1">
                        {variant.attributes && Object.entries(variant.attributes).map(([k, v]) => (
                          <span key={k} className="text-[10px] font-medium text-white bg-[#1a1a1a] px-2 py-0.5 rounded">
                            <span className="text-[#888]">{k}:</span> {v}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-[#EAB308] font-bold mt-1">
                        {currencySymbol}{Number(variant.price?.amount || product.prize?.amount).toLocaleString()}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedVariant && (
                  <button onClick={() => setSelectedVariant(null)} className="text-[10px] text-[#EAB308] hover:underline mt-3 font-semibold tracking-wider uppercase">
                    Clear Selection
                  </button>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 mb-10 max-w-md mt-4">
              <button className="w-full bg-[#EAB308] hover:bg-[#FFD165] text-black text-xs font-bold tracking-[0.15em] uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_30px_rgba(234,179,8,0.25)]">
                <BagIcon />
                ADD TO BAG
              </button>
              
              <div className="flex gap-4">
                <button className="flex-1 bg-transparent hover:bg-white hover:text-black text-white text-xs font-bold tracking-[0.15em] uppercase py-4 rounded-xl border border-[#4F4633] transition-all duration-300">
                  BUY IT NOW
                </button>
                <button className="w-14 shrink-0 bg-[#111] hover:bg-[#1a1a1a] flex items-center justify-center rounded-xl border border-[#1a1a1a] transition-all duration-300 group">
                  <HeartIcon />
                </button>
              </div>
            </div>

            {/* Metadata / Perqs */}
            <div className="space-y-4 border-t border-[#1a1a1a] pt-8 max-w-md">
              <div className="flex items-start gap-4">
                <div className="mt-0.5 text-[#EAB308]"><CheckIcon /></div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Authenticity Guaranteed</h4>
                  <p className="text-[11px] text-[#666]">Every piece is verified by the Midnight Gallery curators.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 text-[#EAB308]"><CheckIcon /></div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Premium Shipping</h4>
                  <p className="text-[11px] text-[#666]">Complimentary expedited shipping on all exclusive orders.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default OneProduct
