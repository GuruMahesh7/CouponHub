import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [couponsdata, setCouponsdata] = useState([]);
  const [active, setActiveCount] = useState(0);
  const [expire, setExpiredCount] = useState(0);
  const [usage, setUsage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/coupons");
        setCouponsdata(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  useEffect(() => {
    let active = 0;
    let expired = 0;
    let usage = 0;

    for (let i = 0; i < couponsdata.length; i++) {
      const coupon = couponsdata[i];
      usage += coupon.usedCount;
      if (coupon.status === "active") {
        active++;
      } else if (coupon.status === "expired") {
        expired++;
      }
    }

    setActiveCount(active);
    setExpiredCount(expired);
    setUsage(usage);
  }, [couponsdata]);

  const handleDelete = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this coupon?");
  if (!confirm) return;

  try {
    await axios.delete(`http://localhost:5000/api/coupons/${id}`);
    setCouponsdata((prev) => prev.filter((c) => c._id !== id));
    alert("Coupon deleted successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to delete coupon.");
  }
};

  return (
    <div className=" space-y-8 ml-65">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1 sm:mt-2">Manage and monitor your coupon codes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-blue-100 p-4 rounded-xl border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900">Total Coupons</h4>
          <p className="text-2xl font-bold text-blue-900 mt-1">{couponsdata.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl border border-green-200">
          <h4 className="text-sm font-medium text-green-900">Active Coupons</h4>
          <p className="text-2xl font-bold text-green-900 mt-1">{active}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-xl border border-orange-200">
          <h4 className="text-sm font-medium text-orange-900">Expired Coupons</h4>
          <p className="text-2xl font-bold text-orange-900 mt-1">{expire}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-xl border border-purple-200">
          <h4 className="text-sm font-medium text-purple-900">Total Usage</h4>
          <p className="text-2xl font-bold text-purple-900 mt-1">{usage}</p>
        </div>
      </div>

      {/* Coupon List */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-1">All Coupon Codes</h2>
        <p className="text-gray-500 mb-4 text-sm">Manage your coupon codes and track their performance</p>

        <div className="space-y-4">
          {couponsdata.map((coupon) => (
            <div
              key={coupon._id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{coupon.code}</h3>
                  {coupon.status === "active" ? (
                    <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">{coupon.status}</span>
                  ) : (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{coupon.status}</span>
                  )}
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {coupon.discountValue}% OFF
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <span>👥 Used: {coupon.usedCount}/{coupon.maxUsage}</span>
                  <span>📅 Expires: {coupon.expiresAt.split("T")[0] }</span>
                  <span>🔁 Remaining: {coupon.maxUsage - coupon.usedCount} uses</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button
                  className="text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1 text-sm rounded"
                  onClick={() => navigate(`/dashboard/viewusers/${coupon.code}`)}
                >
                  👁️ View Users
                </button>
                <button className="border px-2 py-1 rounded text-gray-600 text-sm" onClick={() => navigate(`/dashboard/editcoupon/${coupon._id}`)}>✏️</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded text-sm" onClick={() => handleDelete(coupon._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
