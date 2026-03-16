import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function Dashboard() {
  const [couponsdata, setCouponsdata] = useState([]);
  const [active, setActiveCount] = useState(0);
  const [expire, setExpiredCount] = useState(0);
  const [usage, setUsage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/coupons`
        );
        setCouponsdata(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        setError("Failed to connect to the server. Please check your backend.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);
  console.log(couponsdata);

  useEffect(() => {
    let active = 0;
    let expired = 0;
    let usage = 0;

    for (let i = 0; i < couponsdata.length; i++) {
      const coupon = couponsdata[i];
      usage += coupon.usedCount;
      if (
        new Date(coupon.expiresAt) < new Date() ||
        coupon.usedCount >= coupon.maxUsage
      ) {
        expired++;
      } else {
        active++;
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
      await axios.delete(`${API_BASE_URL}/api/coupons/${id}`);
      setCouponsdata((prev) => prev.filter((c) => c._id !== id));
      alert("Coupon deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete coupon.");
    }
  };

  if (isLoading) {
    return (
      <div className="ml-65 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="md:ml-64 flex items-center justify-center h-[80vh]">
        <div className="bg-red-50 border border-red-200 text-red-800 p-8 rounded-2xl shadow-sm text-center max-w-md">
          <span className="text-5xl block mb-4">⚠️</span>
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-sm hover:shadow"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 md:ml-64 transition-all pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
            Admin Dashboard <span className="text-sm font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">(Demo Version)</span>
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            Manage and monitor your coupon codes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-blue-100 p-4 rounded-xl border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900">Total Coupons</h4>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {couponsdata.length}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl border border-green-200">
          <h4 className="text-sm font-medium text-green-900">Active Coupons</h4>
          <p className="text-2xl font-bold text-green-900 mt-1">{active}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-xl border border-orange-200">
          <h4 className="text-sm font-medium text-orange-900">
            Expired Coupons
          </h4>
          <p className="text-2xl font-bold text-orange-900 mt-1">{expire}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-xl border border-purple-200">
          <h4 className="text-sm font-medium text-purple-900">Total Usage</h4>
          <p className="text-2xl font-bold text-purple-900 mt-1">{usage}</p>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">
        <h2 className="text-lg sm:text-xl font-semibold mb-1">
          All Coupon Codes
        </h2>
        <p className="text-gray-500 mb-4 text-sm">
          Manage your coupon codes and track their performance
        </p>

        <div className="space-y-4">
          {[...couponsdata].sort((a, b) => {
            const isAExpired = new Date(a.expiresAt) < new Date() || a.usedCount >= a.maxUsage;
            const isBExpired = new Date(b.expiresAt) < new Date() || b.usedCount >= b.maxUsage;
            if (isAExpired && !isBExpired) return 1;
            if (!isAExpired && isBExpired) return -1;
            return 0;
          }).map((coupon) => (
            <div
              key={coupon._id}
              className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
            >
              <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{coupon.code}</h3>
                  {new Date(coupon.expiresAt) < new Date() ||
                    coupon.usedCount >= coupon.maxUsage ? (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      expired
                    </span>
                  ) : (
                    <span className="bg-black text-white text-xs px-2 py-0.5 rounded-full">
                      active
                    </span>
                  )}
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {coupon.discountValue
                      ? coupon.discountType === "flat"
                        ? `₹${coupon.discountValue} OFF`
                        : `${coupon.discountValue}% OFF`
                      : "No Discount Info"}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-600">
                  <span>
                    👥 Used: {coupon.usedCount}/{coupon.maxUsage}
                  </span>
                  <span>
                    📅 Expires:{new Date(coupon.expiresAt).toISOString().split("T")[0]}
                  </span>
                  <span>
                    🔁 Remaining: {coupon.maxUsage - coupon.usedCount} uses
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                <button
                  className="text-blue-600 border border-blue-200 hover:bg-blue-50 px-3 py-1 text-sm rounded"
                  onClick={() => navigate(`/dashboard/viewusers/${coupon._id}`)}
                >
                  👁️ View Users
                </button>
                <button
                  className="border px-2 py-1 rounded text-gray-600 text-sm"
                  onClick={() =>
                    navigate(`/dashboard/editcoupon/${coupon._id}`)
                  }
                >
                  ✏️
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  onClick={() => handleDelete(coupon._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
