import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    // Sidebar wrapper — hidden on small screens, visible on md+
    <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-white shadow z-20">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-purple-700">CouponHub</h1>
        <p className="text-xs text-gray-500">Manage your coupons</p>
      </div>
      <nav className="flex flex-col gap-2 p-4 text-sm text-gray-700">
        <Link to="/dashboard" className="flex items-center gap-2 p-2 rounded hover:bg-purple-50">📊 Dashboard</Link>
        <Link to="/createcoupon" className="flex items-center gap-2 p-2 rounded hover:bg-purple-50">➕ Create Coupon</Link>
        <Link to="/analytics" className="flex items-center gap-2 p-2 rounded hover:bg-purple-50">📈 Analytics</Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
