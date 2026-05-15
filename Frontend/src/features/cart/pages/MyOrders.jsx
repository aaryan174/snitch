import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOrdersApi } from '../service/cart.api';

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

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const PackageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
  </svg>
);

// ─── Status badge ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  paid:    { label: 'PAID',    bg: 'bg-green-500/10',  text: 'text-green-400',  dot: 'bg-green-400' },
  pending: { label: 'PENDING', bg: 'bg-yellow-500/10', text: 'text-[#ffca45]',  dot: 'bg-[#ffca45]' },
  failed:  { label: 'FAILED',  bg: 'bg-red-500/10',    text: 'text-red-400',    dot: 'bg-red-400' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.2em] uppercase ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Order card ──────────────────────────────────────────────────────────────

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const formattedTime = date.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit'
  });

  const currency = order.price?.currency === 'INR' ? '₹' : order.price?.currency ?? '₹';
  const total = order.price?.amount ?? 0;
  const itemCount = order.orderItems?.length ?? 0;

  return (
    <div className="bg-[#0e0e0e] rounded-xl overflow-hidden border border-white/5 transition-all duration-300">

      {/* ── Card header ────────────────────────────────────────────── */}
      <div
        className="p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
        onClick={() => setExpanded((p) => !p)}
        aria-expanded={expanded}
      >
        {/* Left meta */}
        <div className="flex-grow space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <StatusBadge status={order.status} />
            <span className="text-[10px] text-[#767575] font-semibold tracking-[0.15em] uppercase">
              {formattedDate} · {formattedTime}
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#767575]">
              Order ID
            </span>
            <span className="font-mono text-[#ffca45] text-xs tracking-wide">
              {order.razorpay?.orderId ?? '—'}
            </span>
          </div>

          <p className="text-[11px] text-[#767575] tracking-wide">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} · Razorpay
          </p>
        </div>

        {/* Right: total + expand */}
        <div className="flex items-center gap-6 md:gap-10">
          <div className="text-right">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#767575] font-semibold">Total</p>
            <p className="text-xl font-extrabold text-[#e5e2e1]">{currency}{total.toLocaleString()}</p>
          </div>
          <div className="text-[#767575] hover:text-[#e5e2e1] transition-colors">
            {expanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </div>
        </div>
      </div>

      {/* ── Expanded item list ──────────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-white/5 px-6 md:px-8 py-6 space-y-5 animate-[fade-in_0.2s_ease]">

          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#767575]">
            Order Items
          </h3>

          <div className="divide-y divide-white/5">
            {order.orderItems?.map((item, idx) => {
              const itemCurrency = item.price?.currency === 'INR' ? '₹' : item.price?.currency ?? '₹';
              const itemTotal = (item.price?.amount ?? 0) * (item.quantity ?? 1);
              const imageUrl = item.images?.find(i => i?.url)?.url ?? null;
              const monogram = (item.title ?? 'P')[0].toUpperCase();

              return (
                <div key={item.productId ?? idx} className="flex items-center gap-5 py-4">
                  {/* Thumbnail */}
                  <div className="w-14 flex-shrink-0 rounded-lg overflow-hidden bg-[#1f201f] flex items-center justify-center" style={{ height: 72 }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                      />
                    ) : null}
                    <span
                      className="text-xl font-black text-[#ffca45] select-none"
                      style={{ display: imageUrl ? 'none' : 'flex' }}
                    >
                      {monogram}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-grow min-w-0">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#767575] font-semibold">SNITCH</p>
                    <p className="text-sm font-semibold uppercase tracking-wide text-[#e5e2e1] truncate mt-0.5">
                      {item.title ?? 'Product'}
                    </p>
                    {item.description && (
                      <p className="text-[11px] text-[#767575] mt-0.5 line-clamp-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    <div className="flex gap-3 mt-1.5 text-[10px] text-[#4c4546] uppercase tracking-widest">
                      <span>Qty: {item.quantity ?? 1}</span>
                      {item.variantId && <span>·</span>}
                      <span className="text-[#ffca45] font-bold">
                        {itemCurrency}{(item.price?.amount ?? 0).toLocaleString()} ea.
                      </span>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-[#e5e2e1]">
                      {itemCurrency}{itemTotal.toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment details strip */}
          <div className="bg-[#131313] rounded-xl p-5 space-y-2.5 mt-4">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#767575]">
              Payment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-[12px]">
              {[
                ['Razorpay Order ID', order.razorpay?.orderId],
                ['Razorpay Payment ID', order.razorpay?.paymentId ?? '—'],
                ['Status', <StatusBadge status={order.status} />],
                ['Total Paid', `${currency}${total.toLocaleString()}`],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-[#767575] font-semibold">{label}</span>
                  <span className="font-mono text-[#e5e2e1] text-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────

const MyOrders = () => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const cartItems = useSelector((state) => state.cart.items) ?? [];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    }
  }, [authUser, authLoading, navigate]);

  useEffect(() => {
    if (!authUser) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrdersApi();
        setOrders(data.orders ?? []);
      } catch (err) {
        console.error(err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [authUser]);

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ffca45] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#767575] text-[11px] font-semibold tracking-[0.2em] uppercase">Loading Orders…</p>
        </div>
      </div>
    );
  }

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
          <Link to="/cart" className="relative p-2 text-[#ffca45]">
            <BagIcon />
            {cartItems.length > 0 && (
              <span className="absolute top-2 right-1 w-2 h-2 bg-[#ffca45] rounded-full" />
            )}
          </Link>
          <button className="hover:bg-white/5 p-2 rounded-full transition-all text-[#e5e2e1]">
            <PersonIcon />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 md:px-10 py-12 min-h-[calc(100vh-80px)]">

        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#767575] mb-2">Your Account</p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase">My Orders</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0e0e0e] border border-white/5 px-4 py-2 rounded-lg text-[11px] font-bold tracking-[0.2em] uppercase text-[#767575]">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5 mb-8 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
            <div className="text-[#4c4546]"><PackageIcon /></div>
            <div className="space-y-2">
              <p className="text-[#767575] text-base font-semibold tracking-wide">No orders yet</p>
              <p className="text-[#767575]/60 text-sm">Your placed orders will appear here.</p>
            </div>
            <Link
              to="/"
              className="bg-[#ffca45] text-[#3f2e00] px-8 py-4 text-[11px] font-bold tracking-[0.3em] uppercase rounded transition-transform active:scale-[0.98] hover:brightness-110 shadow-lg shadow-yellow-500/10"
            >
              Start Shopping
            </Link>
          </div>
        )}

        {/* Orders list */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}

      </main>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[#0e0e0e] flex flex-col md:flex-row justify-between items-center w-full px-10 py-12 gap-6 mt-12">
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

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MyOrders;
