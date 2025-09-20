import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EditCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    code: "",
    discountValue: 0,
    maxUsage: 0,
    expiresAt: "",
  });

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/coupons/${id}`);
        setForm({
          code: res.data.code,
          discountValue: res.data.discountValue,
          maxUsage: res.data.maxUsage,
          expiresAt: res.data.expiresAt?.split("T")[0], 
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load coupon");
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
      await axios.put(`http://localhost:5000/api/coupons/${id}`, form);
      alert("Coupon updated!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className=" ml-65 py-8">
      <h1 className="text-2xl font-bold mb-4">Edit Coupon</h1>
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
        {/* <div>
          <label className="block text-sm font-medium">Discount (%)</label>
          <input
            type="number"
            name="discountValue"
            value={form.discountValue}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div> */}
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
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Update Coupon
        </button>
      </form>
    </div>
  );
}

export default EditCoupon;
