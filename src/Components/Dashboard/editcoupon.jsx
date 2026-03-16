import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";

function EditCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    maxUsage: 0,
    expiresAt: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/coupons/${id}`);
        setForm({
          code: res.data.code,
          discountType: res.data.discountType || "percentage",
          discountValue: res.data.discountValue || 0,
          maxUsage: res.data.maxUsage,
          expiresAt: res.data.expiresAt?.split("T")[0],
        });
      } catch (err) {
        console.error(err);
        setFetchError("Failed to load coupon details.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCoupon();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      setSubmitError(null);
      await axios.put(`${API_BASE_URL}/api/coupons/${id}`, form);
      alert("Coupon updated!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to update the coupon. Please check your connection.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="md:ml-64 flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="md:ml-64 flex items-center justify-center h-[80vh]">
        <div className="bg-red-50 border border-red-200 text-red-800 p-8 rounded-2xl shadow-sm text-center max-w-md">
          <span className="text-5xl block mb-4">⚠️</span>
          <h2 className="text-xl font-bold mb-2">Connection Error</h2>
          <p className="text-red-600 mb-6">{fetchError}</p>
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
    <div className="p-4 md:p-8 md:ml-64 transition-all pb-24 md:pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex flex-wrap items-center gap-2">
        Edit Coupon <span className="text-xs sm:text-sm font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">(Demo Version)</span>
      </h1>

      {submitError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start mb-6 max-w-xl">
          <span className="text-red-500 text-xl mr-3">⚠️</span>
          <div>
            <h3 className="text-red-800 font-bold mb-1">Update Failed</h3>
            <p className="text-red-600 text-sm">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium">Coupon Code</label>
          <input
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Discount Type</label>
          <select
            name="discountType"
            value={form.discountType || "percentage"}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat (₹)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Discount {form.discountType === "percentage" ? "(%)" : "(₹)"}
          </label>
          <input
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Max Usage</label>
          <input
            type="number"
            name="maxUsage"
            value={form.maxUsage}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Expiry Date</label>
          <input
            type="date"
            name="expiresAt"
            value={form.expiresAt}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-purple-400 flex justify-center items-center h-10 min-w-[140px]"
        >
          {isUpdating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
          ) : (
            "Update Coupon"
          )}
        </button>
      </form>
    </div>
  );
}

export default EditCoupon;
