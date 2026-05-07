import React, { useEffect, useState } from 'react'
import { useProduct } from '../hooks/useProduct'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4" /><path d="M16 2v4" />
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M3 10h18" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

// ─── Currency Symbols ─────────────────────────────────────────────────────────

const CURRENCY_SYMBOLS = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(amount, currency = 'INR') {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
}

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const firstImage = product.image?.[0]?.url;

  return (
    <div 
      onClick={() => navigate(`/product/detail/${product._id}`)}
      className="group bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-300 hover:border-yellow-500/20 hover:shadow-[0_0_30px_rgba(234,179,8,0.04)] flex flex-col cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-[#111] overflow-hidden">
        {firstImage && !imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#111]">
                <div className="w-6 h-6 border-2 border-[#333] border-t-yellow-500/60 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={firstImage}
              alt={product.title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#333] gap-2">
            <ImageIcon />
            <span className="text-[10px] tracking-wider uppercase">No image</span>
          </div>
        )}

        {/* Image count badge */}
        {product.image?.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
            <ImageIcon />
            <span className="text-[10px]">{product.image.length}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex-1 flex flex-col">
        <h3 className="text-sm font-semibold text-white truncate mb-1 group-hover:text-yellow-50 transition-colors">
          {product.title}
        </h3>
        <p className="text-[11px] text-[#666] leading-relaxed line-clamp-2 mb-3 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-yellow-400/90">
            {formatPrice(product.prize?.amount, product.prize?.currency)}
          </span>
          <span className="text-[10px] text-[#444] flex items-center gap-1">
            <CalendarIcon />
            {timeAgo(product.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ onCreateClick }) => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center max-w-xs">
      <div className="w-20 h-20 rounded-2xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center mx-auto mb-5 text-[#333]">
        <PackageIcon />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1.5">No products yet</h3>
      <p className="text-xs text-[#555] leading-relaxed mb-6">
        Start listing your first product and reach millions of premium customers.
      </p>
      <button
        onClick={onCreateClick}
        className="inline-flex items-center gap-2 bg-[#EAB308] hover:bg-[#d4a006] text-black font-semibold text-xs px-5 py-2.5 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]"
      >
        <PlusIcon />
        Create Your First Listing
      </button>
    </div>
  </div>
);

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="bg-[#0e0e0e] border border-[#1a1a1a] rounded-xl overflow-hidden animate-pulse">
    <div className="aspect-[4/3] bg-[#151515]" />
    <div className="p-3.5 space-y-2">
      <div className="h-4 bg-[#1a1a1a] rounded w-3/4" />
      <div className="h-3 bg-[#151515] rounded w-full" />
      <div className="h-3 bg-[#151515] rounded w-1/2" />
      <div className="flex justify-between pt-1">
        <div className="h-4 bg-[#1a1a1a] rounded w-16" />
        <div className="h-3 bg-[#151515] rounded w-12" />
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const DashBoard = () => {
  const { handleGetSellerData } = useProduct();
  const sellerProducts = useSelector((state) => state.product.sellerProducts);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetSellerData().finally(() => setLoading(false));
  }, []);

  const goToCreate = () => navigate('/product/create');

  return (
    <div className="flex-1 bg-[#000000] text-white flex flex-col h-full font-sans">

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto scrollbar-hide px-6 py-5" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="max-w-6xl mx-auto">

          {/* Page header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-500/80"><SparkleIcon /></span>
                <span className="text-[10px] font-medium tracking-widest uppercase text-yellow-500/80">Dashboard</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Your Listings</h1>
              {!loading && sellerProducts.length > 0 && (
                <p className="text-xs text-[#555] mt-0.5">
                  {sellerProducts.length} product{sellerProducts.length !== 1 ? 's' : ''} published
                </p>
              )}
            </div>
          </div>

          {/* Content */}
          {loading ? (
            /* Loading Skeleton Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : sellerProducts.length === 0 ? (
            /* Empty State */
            <EmptyState onCreateClick={goToCreate} />
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sellerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default DashBoard;
