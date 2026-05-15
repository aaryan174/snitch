import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setItems } from '../state/cart.slice';

// ─── Icons ──────────────────────────────────────────────────────────────────

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

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
    <path d="M14 9h4l4 4v5c0 .6-.4 1-1 1h-2" />
    <circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" />
  </svg>
);

const UndoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

// ─── Confetti Particles ──────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 200 - 100,
  y: Math.random() * -120 - 20,
  size: Math.random() * 4 + 2,
  opacity: Math.random() * 0.5 + 0.2,
  delay: Math.random() * 1.5,
}));

// ─── Animated Check SVG ──────────────────────────────────────────────────────

const AnimatedCheck = () => (
  <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
    {/* Ambient glow */}
    <div
      className="absolute inset-0 rounded-full"
      style={{ boxShadow: '0 0 60px 20px rgba(255,202,69,0.13)', borderRadius: '50%' }}
    />
    {/* Confetti dots */}
    {PARTICLES.map((p) => (
      <div
        key={p.id}
        className="absolute rounded-full"
        style={{
          width: p.size,
          height: p.size,
          background: p.id % 3 === 0 ? '#ffca45' : p.id % 3 === 1 ? '#e5e2e1' : '#4c4546',
          top: '50%',
          left: '50%',
          transform: `translate(calc(${p.x}px - 50%), calc(${p.y}px - 50%))`,
          opacity: p.opacity,
          animation: `float-particle ${1.8 + p.delay}s ease-in-out ${p.delay}s infinite alternate`,
        }}
      />
    ))}
    {/* Circle + check */}
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle
        cx="60" cy="60" r="54"
        stroke="#ffca45"
        strokeWidth="2"
        strokeDasharray="339.29"
        strokeDashoffset="339.29"
        strokeLinecap="round"
        style={{ animation: 'draw-circle 0.9s cubic-bezier(0.4,0,0.2,1) 0.1s forwards' }}
      />
      <path
        d="M36 62L52 78L84 44"
        stroke="#ffca45"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="70"
        strokeDashoffset="70"
        style={{ animation: 'draw-check 0.5s cubic-bezier(0.4,0,0.2,1) 0.95s forwards' }}
      />
    </svg>
    <style>{`
      @keyframes draw-circle {
        to { stroke-dashoffset: 0; }
      }
      @keyframes draw-check {
        to { stroke-dashoffset: 0; }
      }
      @keyframes float-particle {
        0% { transform: translate(calc(var(--px, 0px) - 50%), calc(var(--py, 0px) - 50%)) scale(1); }
        100% { transform: translate(calc(var(--px, 0px) - 50%), calc(calc(var(--py, 0px) - 8px) - 50%)) scale(1.2); }
      }
      @keyframes fade-up {
        from { opacity: 0; transform: translateY(24px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .anim-fade-up { animation: fade-up 0.6s ease forwards; }
    `}</style>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const OrderSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') ?? '—';
  const cartItems = useSelector((state) => state.cart.items) ?? [];
  const authUser = useSelector((state) => state.auth.user);

  // Clear Redux cart state immediately when this page mounts
  useEffect(() => {
    dispatch(setItems([]));
  }, [dispatch]);

  // Compute totals from items still in redux (snapshot at success)
  const validItems = cartItems.filter((item) => item && item.product);
  const total = validItems.reduce((acc, item) => {
    const product = item.product;
    const variant = Array.isArray(product?.variants)
      ? product.variants.find((v) => v._id === item.variant)
      : product?.variants;
    const price = variant?.price?.amount ?? product?.prize?.amount ?? item.price?.amount ?? 0;
    return acc + price * item.quantity;
  }, 0);

  const currency = validItems[0]?.product?.prize?.currency
    ?? validItems[0]?.price?.currency
    ?? 'INR';

  const currencySymbol = currency === 'INR' ? '₹' : currency;

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen font-sans">

      {/* ─── Sticky Nav ─────────────────────────────────────────────────── */}
      <nav className="bg-[#131313]/70 backdrop-blur-xl top-0 sticky z-50 flex justify-between items-center w-full px-10 h-20 border-b border-white/5">
        <Link to="/" className="text-2xl font-black tracking-[0.3em] text-[#e5e2e1] uppercase">
          SNITCH
        </Link>
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
          <div className="relative p-2 text-[#e5e2e1]">
            <BagIcon />
          </div>
          <button className="hover:bg-white/5 p-2 rounded-full transition-all text-[#e5e2e1]">
            <PersonIcon />
          </button>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">

        {/* Animated check */}
        <div className="anim-fade-up" style={{ animationDelay: '0s' }}>
          <AnimatedCheck />
        </div>

        {/* Headline */}
        <h1
          className="anim-fade-up mt-10 text-[52px] md:text-[64px] font-bold tracking-tight leading-[1.1] uppercase"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          Order Confirmed
        </h1>

        {/* Subtitle */}
        <p
          className="anim-fade-up mt-4 text-[#767575] text-sm max-w-md leading-relaxed"
          style={{ animationDelay: '0.45s', opacity: 0 }}
        >
          Your order has been successfully placed and will be delivered in 5–7 business days.
          {authUser?.email && (
            <> A confirmation has been sent to <span className="text-[#e5e2e1]">{authUser.email}</span>.</>
          )}
        </p>

        {/* Order ID */}
        <div
          className="anim-fade-up mt-6 flex flex-col items-center gap-1"
          style={{ animationDelay: '0.55s', opacity: 0 }}
        >
          <span className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#767575]">
            Order ID
          </span>
          <span className="font-mono text-[#ffca45] text-sm tracking-widest">
            {orderId}
          </span>
        </div>

        {/* CTAs */}
        <div
          className="anim-fade-up flex flex-col sm:flex-row gap-3 mt-10"
          style={{ animationDelay: '0.65s', opacity: 0 }}
        >
          <Link
            to="/"
            className="bg-[#ffca45] text-[#3f2e00] px-8 py-4 text-[11px] font-bold tracking-[0.3em] uppercase rounded transition-transform active:scale-[0.98] hover:brightness-110 shadow-lg shadow-yellow-500/10"
          >
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="border border-white/10 text-[#e5e2e1] px-8 py-4 text-[11px] font-bold tracking-[0.3em] uppercase rounded hover:bg-white/5 transition-colors"
          >
            View Order
          </Link>
        </div>
      </section>

      {/* ─── Order Summary Card ──────────────────────────────────────────── */}
      {validItems.length > 0 && (
        <section className="max-w-2xl mx-auto px-6 pb-16">
          <div className="bg-[#0e0e0e] rounded-xl p-8 space-y-6 border border-white/5">
            <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#767575]">
              Order Summary
            </h2>

            <div className="space-y-0 divide-y divide-white/5">
              {validItems.map((item) => {
                const product = item.product;
                const variant = Array.isArray(product?.variants)
                  ? product.variants.find((v) => v._id === item.variant)
                  : product?.variants;
                const price = variant?.price?.amount ?? product?.prize?.amount ?? item.price?.amount ?? 0;
                const imageUrl =
                  variant?.images?.[0]?.url ??
                  product?.image?.[0]?.url ??
                  'https://placehold.co/80x100/0e0e0e/fff?text=';

                const sizeAttr =
                  (variant?.attributes instanceof Map
                    ? variant.attributes.get('size')
                    : Object.values(variant?.attributes || {})[0]) ?? null;

                return (
                  <div key={item._id ?? product._id} className="flex items-center gap-4 py-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-[#1f201f] flex-shrink-0">
                      <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-grow">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#767575] font-semibold">
                        SNITCH
                      </p>
                      <p className="text-sm font-semibold uppercase tracking-wide text-[#e5e2e1] mt-0.5">
                        {product.title}
                      </p>
                      <div className="flex gap-3 mt-1 text-[10px] text-[#767575] uppercase tracking-widest">
                        {sizeAttr && <span>Size: {sizeAttr}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <span className="text-sm font-bold text-[#e5e2e1] whitespace-nowrap">
                      {currencySymbol}{(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Total */}
            <div className="border-t border-white/10 pt-5 flex justify-between items-center">
              <span className="text-sm font-bold uppercase tracking-tight">Total Amount</span>
              <span className="text-xl font-extrabold text-[#ffca45]">
                {currencySymbol}{total.toLocaleString()}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* ─── Trust Badges ────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <TruckIcon />, title: 'Free Delivery', desc: 'On orders above ₹999' },
            { icon: <UndoIcon />,  title: 'Easy Returns',  desc: '7-day hassle-free returns' },
            { icon: <ShieldIcon />, title: 'Secure Payment', desc: '100% safe & encrypted' },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-[#0e0e0e] rounded-xl p-6 flex flex-col items-center text-center gap-3 border border-white/5"
            >
              <div className="text-[#ffca45]">{icon}</div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#e5e2e1]">
                  {title}
                </p>
                <p className="text-[10px] text-[#767575] mt-0.5 tracking-wide">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0e0e0e] flex flex-col md:flex-row justify-between items-center w-full px-10 py-12 gap-6">
        <div className="text-xl font-black tracking-widest uppercase">SNITCH</div>
        <div className="flex flex-wrap justify-center gap-8 text-[11px] font-semibold tracking-[0.2em] text-[#767575] uppercase">
          {['Story', 'Stores', 'Contact', 'Careers', 'Legal'].map((link) => (
            <a key={link} href="#" className="hover:text-[#e5e2e1] transition-colors">{link}</a>
          ))}
        </div>
        <p className="text-[10px] text-[#767575]/50 uppercase tracking-widest">
          © 2026 SNITCH. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

export default OrderSuccess;
