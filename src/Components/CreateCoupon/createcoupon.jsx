import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';

function Createcoupon() {
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    maxUsage: 1,
    usedCount: 0,
    expiresAt: "",
    status: "active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "discountValue" || name === "maxUsage" ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/api/coupons/createcoupon`, form);
      alert(`Coupon "${response.data.code}" created successfully!`);
      // Reset form
      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        maxUsage: 1,
        usedCount: 0,
        expiresAt: "",
        status: "active"
      });
    } catch (error) {
      console.error("Error creating coupon:", error);
      setError("Failed to create coupon. Please check your backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 md:ml-64 transition-all pb-24 md:pb-8">
      <div className="space-y-6 md:space-y-8 max-w-2xl mx-auto md:mx-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            Create Coupon <span className="text-xs sm:text-sm font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">(Demo Version)</span>
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2">
            Fill in the details below to generate a new coupon code
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
            <span className="text-red-500 text-xl mr-3">⚠️</span>
            <div>
              <h3 className="text-red-800 font-bold mb-1">Creation Failed</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                Coupon Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                className="w-full border rounded px-4 py-2"
                placeholder="e.g., SAVE20"
                onChange={handleChange}
                value={form.code}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select
                name="discountType"
                className="w-full border rounded px-4 py-2"
                onChange={handleChange}
                value={form.discountType}
                required
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                Discount {form.discountType === "percentage" ? "(%)" : "(₹)"}
              </label>
              <input
                type="number"
                id="discountValue"
                name="discountValue"
                className="w-full border rounded px-4 py-2"
                placeholder={form.discountType === "percentage" ? "e.g., 20" : "e.g., 100"}
                onChange={handleChange}
                value={form.discountValue}
                min="0"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="maxUsage" className="block text-sm font-medium text-gray-700">
                Maximum Uses
              </label>
              <input
                type="number"
                id="maxUsage"
                name="maxUsage"
                className="w-full border rounded px-4 py-2"
                placeholder="e.g., 100"
                onChange={handleChange}
                value={form.maxUsage}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiresAt"
                name="expiresAt"
                className="w-full border rounded px-4 py-2"
                onChange={handleChange}
                value={form.expiresAt}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400 flex justify-center items-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Create Coupon"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Createcoupon;
