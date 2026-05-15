import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from "../hooks/useProduct"
import { useAuth } from "../../Auth/hooks/useAuth"
import { Link, useNavigate } from 'react-router-dom'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
)

const HeartIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? "#EAB308" : "none"} stroke={filled ? "#EAB308" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
)

const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
)

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
)

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#EAB308" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
)

// ─── Currency Symbols ─────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹' }

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = ['ALL', 'NEW ARRIVALS', 'TRENDING', 'SHIRTS', 'JACKETS', 'JEANS', 'SNEAKERS', 'ACCESSORIES']

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product, index }) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const navigate = useNavigate()

  const currencySymbol = CURRENCY_SYMBOLS[product?.prize?.currency] || '₹'
  const imageUrl = product?.image?.[0]?.url || ''

  return (
    <Link
      to={`/Product/${product._id}`}
      className="group relative flex flex-col cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#0E0E0E]">
        {/* Skeleton loader */}
        {!imageLoaded && imageUrl && (
          <div className="absolute inset-0 bg-[#111] animate-pulse" />
        )}

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#111]">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}

        {/* Hover overlay gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted) }}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? 'bg-[#EAB308]/20 text-[#EAB308]'
              : 'bg-black/40 backdrop-blur-sm text-white/70 hover:text-white opacity-0 group-hover:opacity-100'
          } ${isWishlisted ? 'opacity-100' : ''}`}
        >
          <HeartIcon filled={isWishlisted} />
        </button>

        {/* NEW badge for recent items */}
        {index < 2 && (
          <div className="absolute top-3 left-3 bg-[#EAB308] text-black text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md">
            NEW
          </div>
        )}

        {/* Quick Add Button */}
        <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Navigate to the product page so the user can select sizes/add.
              navigate(`/Product/${product._id}`);
            }}
            className="w-full bg-white hover:bg-gray-100 text-black text-[10px] font-bold tracking-widest uppercase py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          >
            <BagIcon />
            ADD TO BAG
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 pb-2 px-1">
        <h3 className="text-sm font-semibold text-white truncate tracking-wide leading-tight">
          {product.title}
        </h3>
        <p className="text-[11px] text-[#666] mt-1.5 line-clamp-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[#EAB308] font-bold text-base tracking-tight">
            {currencySymbol}{Number(product?.prize?.amount).toLocaleString()}
          </span>
          <div className="flex items-center gap-0.5">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="flex flex-col animate-pulse">
    <div className="aspect-[3/4] rounded-xl bg-[#111]" />
    <div className="pt-4 px-1 space-y-2">
      <div className="h-4 bg-[#111] rounded w-3/4" />
      <div className="h-3 bg-[#111] rounded w-1/2" />
      <div className="h-4 bg-[#111] rounded w-1/3 mt-2" />
    </div>
  </div>
)

// ─── Main Home Component ──────────────────────────────────────────────────────

const Home = () => {
  const products    = useSelector(state => state.product.products)
  const pagination  = useSelector(state => state.product.pagination) || { currentPage: 1, totalPages: 1, totalProducts: 0, limit: 8 }
  const cartItems   = useSelector(state => state.cart?.items || [])
  const authUser    = useSelector(state => state.auth?.user)
  const { handleGetProducts } = useProduct()
  const { handleLogout } = useAuth()
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [currentPage, setCurrentPage]       = useState(1)
  const [isLoading, setIsLoading]           = useState(true)
  const [searchOpen, setSearchOpen]         = useState(false)
  const [searchQuery, setSearchQuery]       = useState('')
  const [userMenuOpen, setUserMenuOpen]     = useState(false)
  const userMenuRef       = useRef(null)
  const searchDebounceRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Initial load
  useEffect(() => {
    fetchProducts('ALL', '')
  }, [])

  const fetchProducts = async (category, search, page = 1) => {
    setIsLoading(true)
    await handleGetProducts({ category, search, page })
    setIsLoading(false)
  }

  // Category change — immediate, reset to page 1
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setSearchQuery('')
    setCurrentPage(1)
    fetchProducts(cat, '', 1)
  }

  // Search — debounced 400ms, reset to page 1
  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(() => {
      setActiveCategory('ALL')
      setCurrentPage(1)
      fetchProducts('ALL', val, 1)
    }, 400)
  }

  // Page change
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchProducts(activeCategory, searchQuery, page)
    const top = document.getElementById('products')?.offsetTop ?? 0
    window.scrollTo({ top: top - 80, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-yellow-400 selection:text-black">

      {/* ─── Navbar ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="h-16 flex items-center justify-between">

            {/* Logo */}
            <Link to="/" className="text-xl font-black tracking-[0.25em] uppercase shrink-0">
              SNITCH
            </Link>

            {/* Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {['NEW ARRIVALS', 'MEN', 'WOMEN', 'COLLECTIONS', 'SALE'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className={`text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-200 ${
                    link === 'SALE' ? 'text-[#EAB308] hover:text-[#FFD165]' : 'text-[#888] hover:text-white'
                  }`}
                >
                  {link}
                </a>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#888] hover:text-white transition-colors"
              >
                <SearchIcon />
              </button>
              <button className="text-[#888] hover:text-white transition-colors hidden sm:block">
                <HeartIcon filled={false} />
              </button>
              <Link to="/cart" className="text-[#888] hover:text-white transition-colors relative">
                <BagIcon />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EAB308] rounded-full text-[8px] font-bold text-black flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
              {/* User icon / dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => authUser ? setUserMenuOpen(v => !v) : navigate('/login')}
                  className="text-[#888] hover:text-white transition-colors"
                  aria-label="User menu"
                >
                  <UserIcon />
                </button>

                {/* Dropdown — only shown when logged in */}
                {authUser && userMenuOpen && (
                  <div className="absolute right-0 top-10 w-52 bg-[#111] border border-white/[0.06] rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                      <p className="text-[10px] tracking-[0.15em] uppercase text-[#555] font-semibold">Signed in as</p>
                      <p className="text-xs text-white font-semibold mt-0.5 truncate">{authUser.name ?? authUser.email}</p>
                    </div>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#888] hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                        <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                      </svg>
                      My Orders
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[11px] font-semibold tracking-[0.1em] uppercase text-[#888] hover:text-white hover:bg-white/[0.04] transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                      </svg>
                      My Bag
                    </Link>
                    <div className="border-t border-white/[0.06] mt-1"></div>
                    <button
                      onClick={async () => {
                        setUserMenuOpen(false)
                        await handleLogout()
                        navigate('/')
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold tracking-[0.1em] uppercase text-red-500 hover:text-white hover:bg-red-500/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        <div className={`overflow-hidden transition-all duration-300 ease-out ${searchOpen ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products, brands, styles…"
                autoFocus={searchOpen}
                className="w-full bg-[#0E0E0E] border border-[#1a1a1a] rounded-lg py-3 pl-12 pr-4 text-sm text-white placeholder-[#444] outline-none focus:border-[#EAB308]/30 transition-colors"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555]">
                <SearchIcon />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden pt-16">
        {/* Background */}
        <div className="absolute inset-0 bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308]/[0.03] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
          {/* Decorative elements */}
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#EAB308]/[0.02] blur-[200px] rounded-full" />
          <div className="absolute bottom-1/4 left-1/6 w-[400px] h-[400px] bg-[#EAB308]/[0.015] blur-[150px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12 h-full flex items-center">
          <div className="max-w-2xl">
            <p className="text-[#EAB308] text-[10px] font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#EAB308]" />
              SEASON 2026
            </p>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] mb-8">
              <span className="block text-white">THE NEW</span>
              <span className="block text-[#EAB308] mt-1">COLLECTION</span>
            </h1>
            <p className="text-[#888] text-sm sm:text-base leading-relaxed max-w-md mb-10">
              Discover curated pieces crafted for the modern aesthetic.
              Where streetwear meets luxury in the Midnight Gallery.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#products"
                className="bg-[#EAB308] hover:bg-[#FFD165] text-black text-[11px] font-bold tracking-[0.15em] uppercase px-8 py-4 rounded-lg flex items-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.15)] hover:shadow-[0_0_30px_rgba(234,179,8,0.25)]"
              >
                EXPLORE NOW
                <ArrowRightIcon />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white text-[11px] font-semibold tracking-[0.15em] uppercase px-6 py-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                LOOKBOOK
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#555] animate-bounce">
          <span className="text-[8px] tracking-[0.3em] uppercase">Scroll</span>
          <ChevronDownIcon />
        </div>
      </section>

      {/* ─── Category Filters ────────────────────────────────────────── */}
      <section id="products" className="sticky top-16 z-40 bg-black/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="py-4 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`shrink-0 text-[10px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-full transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#EAB308] text-black shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                    : 'bg-[#111] text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Product Grid ────────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12 lg:py-16">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#EAB308] text-[10px] font-bold tracking-[0.3em] uppercase mb-2 flex items-center gap-3">
              <span className="w-5 h-[1px] bg-[#EAB308]" />
              {searchQuery ? `SEARCH: "${searchQuery}"` : activeCategory !== 'ALL' ? activeCategory : 'CURATED FOR YOU'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {searchQuery ? 'Search Results' : activeCategory !== 'ALL' ? activeCategory.charAt(0) + activeCategory.slice(1).toLowerCase() : 'Featured Products'}
            </h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[#666]">
            <span className="text-[11px] tracking-wide">
              {products?.length || 0} pieces
            </span>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-[#0E0E0E] flex items-center justify-center mb-6">
              <BagIcon />
            </div>
            <h3 className="text-xl font-bold mb-2">No Products Yet</h3>
            <p className="text-[#666] text-sm max-w-sm mb-8">
              The gallery is being curated. Check back soon for exclusive drops.
            </p>
            <button
              onClick={handleGetProducts}
              className="text-[#EAB308] text-[11px] font-bold tracking-[0.15em] uppercase px-6 py-3 rounded-lg border border-[#EAB308]/20 hover:border-[#EAB308]/50 hover:bg-[#EAB308]/5 transition-all"
            >
              REFRESH
            </button>
          </div>
        )}

        {/* ─── Pagination ───────────────────────────────────────────── */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase border border-white/[0.08] rounded-lg text-[#888] hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              Prev
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => {
                const isActive = p === currentPage
                const isNear   = Math.abs(p - currentPage) <= 2 || p === 1 || p === pagination.totalPages
                if (!isNear) {
                  const isEdge = p === currentPage - 3 || p === currentPage + 3
                  return isEdge ? <span key={p} className="text-[#444] px-1 text-sm">…</span> : null
                }
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 text-[11px] font-bold rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#EAB308] text-black shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                        : 'text-[#888] hover:text-white hover:bg-white/[0.06] border border-white/[0.06]'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="flex items-center gap-2 px-4 py-2.5 text-[11px] font-bold tracking-[0.1em] uppercase border border-white/[0.08] rounded-lg text-[#888] hover:text-white hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        )}

        {/* Page count label */}
        {!isLoading && pagination.totalPages > 1 && (
          <p className="text-center text-[10px] text-[#444] tracking-[0.2em] uppercase mt-4">
            Page {currentPage} of {pagination.totalPages} · {pagination.totalProducts} products
          </p>
        )}

      </section>

      {/* ─── Newsletter Banner ───────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-12">
        <div className="relative bg-[#0A0A0A] rounded-2xl overflow-hidden px-8 sm:px-16 py-16 sm:py-20">
          {/* Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#EAB308]/[0.03] blur-[150px] rounded-full" />

          <div className="relative z-10 max-w-xl">
            <p className="text-[#EAB308] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-3">
              <span className="w-5 h-[1px] bg-[#EAB308]" />
              STAY UPDATED
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
              Join The Gallery
            </h3>
            <p className="text-[#888] text-sm mb-8 leading-relaxed">
              Be the first to know about exclusive drops, early access, and curated collections.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-[#111] border border-[#1a1a1a] rounded-lg py-3.5 px-5 text-sm text-white placeholder-[#444] outline-none focus:border-[#EAB308]/30 transition-colors"
              />
              <button className="bg-[#EAB308] hover:bg-[#FFD165] text-black text-[10px] font-bold tracking-[0.15em] uppercase px-6 rounded-lg transition-all duration-300 shrink-0 shadow-[0_0_15px_rgba(234,179,8,0.15)]">
                SUBSCRIBE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-[#050505] border-t border-white/[0.04]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <span className="text-lg font-black tracking-[0.25em] uppercase">SNITCH</span>
              <p className="text-[#666] text-xs mt-4 leading-relaxed max-w-xs">
                Where streetwear meets luxury. Curated fashion for the modern aesthetic.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-4 mt-6">
                {['IG', 'TW', 'FB', 'YT'].map(s => (
                  <a key={s} href="#" className="w-8 h-8 rounded-full bg-[#111] flex items-center justify-center text-[9px] font-bold text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: 'SHOP', links: ['New Arrivals', 'Best Sellers', 'Sale', 'Collections'] },
              { title: 'HELP', links: ['My Orders', 'Contact Us', 'FAQs', 'Shipping', 'Returns'] },
              { title: 'COMPANY', links: ['About', 'Careers', 'Press', 'Sustainability'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      {link === 'My Orders' ? (
                        <Link to="/orders" className="text-[#666] text-xs hover:text-white transition-colors">{link}</Link>
                      ) : (
                        <a href="#" className="text-[#666] text-xs hover:text-white transition-colors">{link}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#444] text-[10px] tracking-wider">
              © 2026 SNITCH. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Cookies'].map((link) => (
                <a key={link} href="#" className="text-[#444] text-[10px] tracking-wider hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
