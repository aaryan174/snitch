import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

// ─── Icons ──────────────────────────────────────────────────────────────────

const LayoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const BagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18" />
    <path d="m19 9-5 5-4-4-3 3" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <path d="M12 17h.01" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

// ─── Main Component ──────────────────────────────────────────────────────────

const SellerLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-[#070707] text-white font-sans overflow-hidden">
      {/* ─── Top Navbar ─────────────────────────────────────────────── */}
      <nav className="h-16 bg-[#000000] border-b border-[#1a1a1a] flex items-center justify-between px-8 z-20 shrink-0">
        {/* Left: Logo */}
        <div className="flex items-center">
          <span className="text-xl font-black tracking-widest uppercase">SNITCH</span>
        </div>

        {/* Center: Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/product/Dashboard" className={({ isActive }) => `text-[11px] font-semibold tracking-widest uppercase pb-1 border-b-2 transition-colors ${isActive ? 'text-yellow-400 border-yellow-400' : 'text-[#888] border-transparent hover:text-white'}`}>
            GALLERY
          </NavLink>
          <NavLink to="/product/inventory" className={({ isActive }) => `text-[11px] font-semibold tracking-widest uppercase pb-1 border-b-2 transition-colors ${isActive ? 'text-yellow-400 border-yellow-400' : 'text-[#888] border-transparent hover:text-white'}`}>
            INVENTORY
          </NavLink>
          <NavLink to="/product/create" className={({ isActive }) => `text-[11px] font-semibold tracking-widest uppercase pb-1 border-b-2 transition-colors ${isActive ? 'text-yellow-400 border-yellow-400' : 'text-[#888] border-transparent hover:text-white'}`}>
            PUBLISH
          </NavLink>
          <NavLink to="/product/analytics" className={({ isActive }) => `text-[11px] font-semibold tracking-widest uppercase pb-1 border-b-2 transition-colors ${isActive ? 'text-yellow-400 border-yellow-400' : 'text-[#888] border-transparent hover:text-white'}`}>
            ANALYTICS
          </NavLink>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-5">
          <button className="text-[#888] hover:text-white transition-colors relative">
            <BellIcon />
            <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full border border-black"></span>
          </button>
          <div className="w-8 h-8 rounded bg-[#222] overflow-hidden border border-[#333] cursor-pointer">
            <img src="https://ui-avatars.com/api/?name=Admin&background=EAB308&color=000&rounded=false" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
      </nav>

      {/* ─── Body: Sidebar + Main Content ───────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#111111] border-r border-[#1a1a1a] flex flex-col z-10 shrink-0 hidden md:flex">
          {/* Shop Title */}
          <div className="px-8 py-8">
            <h2 className="text-sm font-bold tracking-wide">The Midnight Gallery</h2>
          </div>

          {/* Navigation Links */}
          <div className="px-4 flex-1 flex flex-col gap-1.5">
            <NavLink to="/product/Dashboard" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'text-white bg-[#1a1a1a]' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]/50'}`}>
              <LayoutIcon />
              GALLERY
            </NavLink>
            <NavLink to="/product/inventory" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'text-white bg-[#1a1a1a]' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]/50'}`}>
              <BoxIcon />
              INVENTORY
            </NavLink>
            <NavLink to="/product/orders" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'text-white bg-[#1a1a1a]' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]/50'}`}>
              <BagIcon />
              ORDERS
            </NavLink>
            <NavLink to="/product/analytics" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'text-white bg-[#1a1a1a]' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]/50'}`}>
              <ChartIcon />
              ANALYTICS
            </NavLink>

            {/* Publish Button */}
            <div className="mt-4 px-4">
              <NavLink to="/product/create" className={({ isActive }) => `flex items-center justify-center gap-2 w-full py-3 rounded-lg text-xs font-bold tracking-wide transition-all ${isActive ? 'bg-[#EAB308] text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-[#EAB308]/90 text-black hover:bg-[#EAB308]'}`}>
                <div className="border border-black/30 rounded-full p-0.5">
                  <PlusIcon />
                </div>
                PUBLISH
              </NavLink>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="p-4 flex flex-col gap-1.5 mt-auto mb-4 border-t border-[#1a1a1a]/50 pt-4">
            <NavLink to="/help" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'text-white bg-[#1a1a1a]' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]/50'}`}>
              <HelpIcon />
              HELP CENTER
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${isActive ? 'text-white bg-[#1a1a1a]' : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]/50'}`}>
              <SettingsIcon />
              SETTINGS
            </NavLink>
          </div>
        </aside>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto bg-[#070707] relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
