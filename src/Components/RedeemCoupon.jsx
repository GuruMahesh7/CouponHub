import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

function RedeemCoupon() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    couponCode: "",
    billAmount: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // 1. Try to register or login a dummy demo user
      let userId;
      try {
        await axios.post(`${API_BASE_URL}/api/coupons/register`, {
          name: form.name,
          email: form.email,
          password: "demopassword123", // Fixed password for demo purposes
        });
      } catch (err) {
        // If it fails, usually means user already exists. We can just catch and login.
      }

      const loginRes = await axios.post(`${API_BASE_URL}/api/coupons/login`, {
        email: form.email,
        password: "demopassword123",
      });
      
      userId = loginRes.data.user.id;

      // 2. Attempt to redeem the coupon
      const redeemRes = await axios.post(`${API_BASE_URL}/api/coupons/validate-coupon`, {
        userId: userId,
        code: form.couponCode,
      });

      if (redeemRes.data.valid) {
        // Calculate the Final Bill locally for the UI based on the fetched coupon data
        const coupon = redeemRes.data.coupon;
        const originalBill = parseFloat(form.billAmount);
        
        let discountApplied = 0;
        if (coupon.discountType === "percentage") {
          discountApplied = (originalBill * coupon.discountValue) / 100;
        } else {
          discountApplied = coupon.discountValue;
        }

        // don't let it go below 0
        const finalBill = Math.max(0, originalBill - discountApplied);

        setResult({ 
          success: true, 
          message: redeemRes.data.message,
          receipt: {
            originalBill,
            discountApplied,
            finalBill
          }
        });
      } else {
        setResult({ success: false, message: redeemRes.data.message });
      }

    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Failed to redeem coupon. The code may be invalid or expired.";
      setResult({ success: false, message: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 md:ml-64 transition-all pb-24 md:pb-8">
      <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto md:mx-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
            Simulate User Redemption <span className="text-xs sm:text-sm font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">(Demo Tool)</span>
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            Test your coupons exactly how a customer would. Enter a mock user profile and a coupon code to redeem it.
          </p>
        </div>

        {result && (
          <div className={`border-l-4 p-4 rounded-md flex items-start ${result.success ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
            <span className="text-xl mr-3">{result.success ? '✅' : '⚠️'}</span>
            <div>
              <h3 className={`font-bold mb-1 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.success ? 'Success!' : 'Redemption Failed'}
              </h3>
              <p className={result.success ? 'text-green-700' : 'text-red-700'}>{result.message}</p>
              
              {result.success && result.receipt && (
                <div className="mt-4 bg-white p-4 rounded border border-green-200 shadow-sm text-sm">
                  <h4 className="font-bold text-gray-800 mb-2 border-b pb-1">Billing Summary</h4>
                  <div className="flex justify-between text-gray-600 mb-1">
                    <span>Original Bill:</span>
                    <span>₹{result.receipt.originalBill.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-green-600 mb-1 font-medium">
                    <span>Discount Applied:</span>
                    <span>-₹{result.receipt.discountApplied.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold border-t pt-1 mt-2 text-base">
                    <span>Final Amount:</span>
                    <span>₹{result.receipt.finalBill.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
          <form className="space-y-6" onSubmit={handleRedeem}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Customer Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                  placeholder="e.g., Ramesh Naidu"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Customer Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                  placeholder="e.g., ramesh@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Purchase Bill Amount (₹)</label>
              <input
                type="number"
                name="billAmount"
                value={form.billAmount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow font-medium"
                placeholder="e.g., 500"
                min="1"
                required
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-900">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="couponCode"
                    value={form.couponCode}
                    onChange={handleChange}
                    className="w-full border border-purple-300 bg-purple-50 rounded-lg px-4 py-3 uppercase tracking-wider font-bold text-gray-800 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow"
                    placeholder="ENTER CODE"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transform transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center h-12"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Redeem Demo Coupon"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RedeemCoupon;
