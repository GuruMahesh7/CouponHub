import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-white shadow z-20">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-purple-700">CouponHub</h1>
          <p className="text-xs text-gray-500">Manage your coupons</p>
        </div>
        <nav className="flex flex-col gap-2 p-4 text-sm text-gray-700">
          <Link to="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-purple-50">📊 Dashboard</Link>
          <Link to="/createcoupon" className="flex items-center gap-2 p-2 rounded hover:bg-purple-50">➕ Create Coupon</Link>
          <Link to="/analytics" className="flex items-center gap-2 p-2 rounded hover:bg-purple-50">📈 Analytics</Link>
          <div className="border-t my-2 hidden md:block"></div>
          <Link to="/redeem" className="flex items-center gap-2 p-2 rounded hover:bg-indigo-50 text-indigo-700 font-medium">🎁 Simulate Redeem</Link>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 flex justify-around p-3 pb-safe">
        <Link to="/dashboard" className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-purple-700">
          <span className="text-xl">📊</span>
          <span>Home</span>
        </Link>
        <Link to="/createcoupon" className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-purple-700">
          <span className="text-xl">➕</span>
          <span>Create</span>
        </Link>
        <Link to="/analytics" className="flex flex-col items-center gap-1 text-xs text-gray-600 hover:text-purple-700">
          <span className="text-xl">📈</span>
          <span>Stats</span>
        </Link>
        <Link to="/redeem" className="flex flex-col items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
          <span className="text-xl">🎁</span>
          <span>Redeem</span>
        </Link>
      </nav>
    </>
  );
}

export default Sidebar;
