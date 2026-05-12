import React, { useEffect, useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const PersonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);

const UndoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
    <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2" />
    <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
  </svg>
);

const VerifiedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const Cart = () => {
    const { handleGetCart, handleRemoveItem, handleUpdateQuantity } = useCart();
    const cartItems = useSelector(state => state.cart.items);
    const authUser = useSelector(state => state.auth.user);
    const authLoading = useSelector(state => state.auth.loading);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !authUser) {
            navigate('/login');
            return;
        }

        const fetchCart = async () => {
            if (authUser) {
                await handleGetCart();
                setLoading(false);
            }
        };
        fetchCart();
    }, [authUser, authLoading, navigate, handleGetCart]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center font-sans">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#ffca45] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#767575] text-[11px] font-semibold tracking-[0.2em] uppercase">Loading Cart...</p>
                </div>
            </div>
        );
    }

    const validItems = cartItems.filter(item => item && item.product);

    const totalMRP = validItems.reduce((acc, item) => {
        const original = item.price?.original || item.price?.amount || 0;
        return acc + (original * item.quantity);
    }, 0);

    const subtotal = validItems.reduce((acc, item) => {
        const amount = item.price?.amount || 0;
        return acc + (amount * item.quantity);
    }, 0);

    const discount = totalMRP - subtotal;

    return (
        <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-sans">

            {/* Sticky Nav */}
            <nav className="bg-[#131313]/70 backdrop-blur-xl top-0 sticky z-50 flex justify-between items-center w-full px-10 h-20 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="text-[#888] hover:text-[#e5e2e1] transition-colors">
                        <ArrowLeftIcon />
                    </button>
                    <Link to="/" className="text-2xl font-black tracking-[0.3em] text-[#e5e2e1] uppercase">SNITCH</Link>
                </div>
                <div className="hidden md:flex gap-12 text-[13px] font-medium tracking-[0.15em] uppercase text-[#e5e2e1]">
                    <Link to="/" className="hover:text-[#f7be1d] transition-colors">New Arrivals</Link>
                    <Link to="/" className="hover:text-[#f7be1d] transition-colors">Men</Link>
                    <Link to="/" className="hover:text-[#f7be1d] transition-colors">Women</Link>
                    <Link to="/" className="hover:text-[#f7be1d] transition-colors">Sale</Link>
                </div>
                <div className="flex items-center gap-2">
                    <button className="hover:bg-white/5 p-2 rounded-full transition-all text-[#e5e2e1]">
                        <SearchIcon />
                    </button>
                    <div className="relative p-2 text-[#ffca45]">
                        <BagIcon />
                        {cartItems.length > 0 && (
                            <span className="absolute top-2 right-1 w-2 h-2 bg-[#ffca45] rounded-full"></span>
                        )}
                    </div>
                    <button className="hover:bg-white/5 p-2 rounded-full transition-all text-[#e5e2e1]">
                        <PersonIcon />
                    </button>
                </div>
            </nav>

            <main className="max-w-[1440px] mx-auto px-10 py-12 min-h-screen">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

                    {/* ─── LEFT: Cart Items ─── */}
                    <section className="lg:col-span-8 space-y-6">

                        {/* Header row */}
                        <div className="flex justify-between items-end border-b border-[#4c4546] pb-5">
                            <h1 className="text-2xl font-bold tracking-tight uppercase">
                                {validItems.length}/{validItems.length} ITEMS SELECTED
                            </h1>
                            <div className="flex gap-6 text-[11px] font-semibold tracking-[0.2em] text-[#767575] uppercase">
                                <button className="hover:text-[#e5e2e1] transition-colors">Remove</button>
                                <span className="text-[#4c4546]">|</span>
                                <button className="hover:text-[#e5e2e1] transition-colors">Move to Wishlist</button>
                            </div>
                        </div>

                        {validItems.length === 0 ? (
                            <div className="text-center py-20 bg-[#0e0e0e] rounded-xl">
                                <p className="text-[#767575] mb-6 text-base">Your bag is empty.</p>
                                <Link to="/" className="inline-block bg-[#ffca45] text-[#3f2e00] text-[11px] font-bold tracking-[0.2em] uppercase px-8 py-3 rounded transition-all hover:brightness-110">
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            validItems.map(item => {
                                const product = item.product;
                                let selectedVariant = null;
                                if (item.variant && product.variants) {
                                    selectedVariant = product.variants.find(v => v._id === item.variant);
                                }

                                const priceAmount = item.price?.amount || 0;
                                const priceOriginal = item.price?.original || priceAmount;
                                const discountPct = priceOriginal > 0
                                    ? Math.round(((priceOriginal - priceAmount) / priceOriginal) * 100)
                                    : 0;
                                const imageUrl = selectedVariant?.images?.[0]?.url
                                    || product.image?.[0]?.url
                                    || 'https://placehold.co/400x600/0e0e0e/fff?text=No+Image';

                                const sizeAttr = selectedVariant?.attributes?.get?.('size') 
                                    || (selectedVariant?.attributes instanceof Map ? selectedVariant.attributes.get('size') : null)
                                    || Object.values(selectedVariant?.attributes || {})[0]
                                    || '—';

                                return (
                                    <div key={item._id || product._id} className="bg-[#0e0e0e] p-6 flex gap-6 relative group">
                                        {/* Remove button */}
                                        <button 
                                            onClick={() => handleRemoveItem({ productId: product._id, variantId: item.variant })}
                                            className="absolute top-5 right-5 text-[#767575] hover:text-[#e5e2e1] transition-colors z-10"
                                        >
                                            <CloseIcon />
                                        </button>

                                        {/* Product Image */}
                                        <Link to={`/Product/${product._id}`} className="w-28 h-36 flex-shrink-0 overflow-hidden rounded-xl bg-[#1f201f]">
                                            <img
                                                src={imageUrl}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex-grow flex flex-col justify-between py-1 pr-8">
                                            <div className="space-y-1">
                                                <p className="text-[11px] font-semibold tracking-[0.2em] text-[#767575] uppercase">SNITCH</p>
                                                <Link to={`/Product/${product._id}`}>
                                                    <h2 className="text-base font-semibold uppercase tracking-wide text-[#e5e2e1] hover:text-[#ffca45] transition-colors">
                                                        {product.title}
                                                    </h2>
                                                </Link>

                                                {/* Size & Qty */}
                                                <div className="flex gap-4 pt-2">
                                                    <div className="bg-[#1f201f] flex items-center px-3 py-1 rounded gap-1 text-[11px] font-semibold tracking-widest uppercase">
                                                        <span>Size: {sizeAttr}</span>
                                                        <span className="text-[#e5e2e1] mt-0.5"><ChevronDownIcon /></span>
                                                    </div>
                                                    <div className="bg-[#1f201f] flex items-center px-3 py-1 rounded gap-3 text-[11px] font-semibold tracking-widest uppercase">
                                                        <button 
                                                            onClick={() => handleUpdateQuantity({ productId: product._id, variantId: item.variant, quantity: item.quantity - 1 })}
                                                            className="hover:text-[#ffca45] disabled:opacity-50 flex items-center justify-center"
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <MinusIcon />
                                                        </button>
                                                        <span>{item.quantity}</span>
                                                        <button 
                                                            onClick={() => handleUpdateQuantity({ productId: product._id, variantId: item.variant, quantity: item.quantity + 1 })}
                                                            className="hover:text-[#ffca45] disabled:opacity-50 flex items-center justify-center"
                                                            disabled={selectedVariant ? item.quantity >= selectedVariant.stock : false}
                                                        >
                                                            <PlusIcon />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Price + Meta */}
                                            <div className="space-y-2">
                                                <div className="flex items-baseline gap-3">
                                                    <span className="text-xl font-bold text-[#e5e2e1]">₹{priceAmount.toLocaleString()}</span>
                                                    {priceOriginal > priceAmount && (
                                                        <>
                                                            <span className="text-[#767575] line-through text-sm">₹{priceOriginal.toLocaleString()}</span>
                                                            <span className="text-[#ffca45] font-bold text-[11px] tracking-widest">({discountPct}% OFF)</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-1 text-[10px] text-[#767575] uppercase tracking-widest font-semibold">
                                                    <div className="flex items-center gap-1">
                                                        <UndoIcon />
                                                        <span>7 days return available</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <TruckIcon />
                                                        <span>Delivery by next 5-7 days</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </section>

                    {/* ─── RIGHT: Price Details ─── */}
                    {validItems.length > 0 && (
                        <aside className="lg:col-span-4 sticky top-24 space-y-6">
                            <div className="bg-[#0e0e0e] p-8 rounded-xl border border-white/5 space-y-6">
                                <h2 className="text-[11px] font-semibold tracking-[0.2em] text-[#767575] uppercase">
                                    Price Details ({validItems.length} {validItems.length === 1 ? 'Item' : 'Items'})
                                </h2>

                                <div className="space-y-4 text-sm text-[#e5e2e1]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#e5e2e1]/70">Total MRP</span>
                                        <span>₹{totalMRP.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#e5e2e1]/70">Discount on MRP</span>
                                        <span className="text-[#ffca45] font-semibold">-₹{discount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#e5e2e1]/70">Coupon Discount</span>
                                        <button className="text-[#ffca45] font-semibold hover:underline text-sm">Apply Coupon</button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#e5e2e1]/70">Platform Fee</span>
                                        <span>₹23</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/10 pt-5">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-base font-bold uppercase tracking-tight">Total Amount</span>
                                        <span className="text-xl font-extrabold">₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    <button className="w-full bg-[#ffca45] text-[#3f2e00] py-4 font-bold text-[11px] tracking-[0.3em] rounded uppercase transition-transform active:scale-[0.98] shadow-lg shadow-yellow-500/10 hover:brightness-110">
                                        Place Order
                                    </button>
                                </div>

                                {/* Trust badge */}
                                <div className="bg-white/5 p-4 rounded flex items-start gap-3">
                                    <div className="text-[#ffca45] mt-0.5"><VerifiedIcon /></div>
                                    <p className="text-[11px] text-[#767575] leading-relaxed">
                                        Genuine products with secure encryption. 100% payment protection and easy returns.
                                    </p>
                                </div>
                            </div>
                        </aside>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#0e0e0e] flex flex-col md:flex-row justify-between items-center w-full px-10 py-12 gap-6 mt-12">
                <div className="text-xl font-black tracking-widest uppercase">SNITCH</div>
                <div className="flex flex-wrap justify-center gap-8 text-[11px] font-semibold tracking-[0.2em] text-[#767575] uppercase">
                    <a href="#" className="hover:text-[#e5e2e1] transition-colors">Story</a>
                    <a href="#" className="hover:text-[#e5e2e1] transition-colors">Stores</a>
                    <a href="#" className="hover:text-[#e5e2e1] transition-colors">Contact</a>
                    <a href="#" className="hover:text-[#e5e2e1] transition-colors">Careers</a>
                    <a href="#" className="hover:text-[#e5e2e1] transition-colors">Legal</a>
                </div>
                <p className="text-[10px] text-[#767575]/50 uppercase tracking-widest">© 2026 SNITCH. ALL RIGHTS RESERVED.</p>
            </footer>
        </div>
    );
};

export default Cart;
