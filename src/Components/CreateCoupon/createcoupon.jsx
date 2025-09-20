import React from 'react'
import { useState } from 'react';
import axios from 'axios';


function Createcoupon() {
  // const [discountValue, setDiscountValue]=useState(0)
  const [couponCode, setCouponCode]=useState("")
  // const [discountType, setDiscountType]=useState("percentage") 
  const [maxUsage, setMaxUsage]=useState(1)
  const [expiresAt, setExpiresAt]=useState("")
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    maxUsage: 1,
    usedCount: 0,
    expiresAt: "",
    status: "active"
  });

//   function setdiscountValue(e){
//     setDiscountValue(e.target.value)
//     setForm({
//       code: couponCode,
//       discountType: discountType,
//       discountValue: discountValue,
//       maxUsage: maxUsage,
//       usedCount: 0,
//       expiresAt: expiresAt,
//       status: "active",
//     });
// }

  function setcouponCode(e){
    setCouponCode(e.target.value)
    setForm({
      code: couponCode,
      // discountType: discountType,
      // discountValue: discountValue,
      maxUsage: maxUsage,
      usedCount: 0,
      expiresAt: expiresAt,
      status: "active",
    });
}

// function discountTypesel(e) {
//     setDiscountType(e.target.value);
//     setForm({
//       code: couponCode,
//       discountType: discountType,
//       discountValue: discountValue,
//       maxUsage: maxUsage,
//       usedCount: 0,
//       expiresAt: expiresAt,
//       status: "active"
//     });
//   }

  function setmaxusage(e){
    setMaxUsage(e.target.value)
    setForm({
      code: couponCode,
      // discountType: discountType,
      // discountValue: discountValue,
      maxUsage: maxUsage,
      usedCount: 0,
      expiresAt: expiresAt,
      status: "active",
    });
}

  function setexpitydate(e){
    setExpiresAt(e.target.value)
    setForm({
    code: couponCode,
    // discountType: discountType,
    // discountValue: discountValue,
    maxUsage: maxUsage,
    usedCount: 0,
    expiresAt: expiresAt,
    status: "active"
  })
}

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await axios.post("https://backend-1-9gjf.onrender.com/api/coupons/createcoupon", form);

      alert(`Coupon "${response.data.code}" created successfully!`);
    } catch (error) {
      console.error("Error creating coupon:", error);
      alert("Failed to create coupon.");
    }
};

  
  return (
    <div className="ml-65">
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Coupon</h1>
          <p className="text-gray-600 mt-2">
            Fill in the details below to generate a new coupon code
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <form className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="couponCode"
                className="block text-sm font-medium text-gray-700"
              >
                Coupon Code
              </label>
              <input
                type="text"
                id="couponCode"
                className="w-full border rounded px-4 py-2"
                placeholder="e.g., SAVE20"
                onChange={setcouponCode}
                value={couponCode}
              />
            </div>

            {/* Discount Type */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Discount Type
              </label>
              <select
                name="discountType"
                className="w-full border rounded px-4 py-2"
                onChange={discountTypesel}
                value={discountType}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div> */}
{/* 
            <div className="space-y-2">
              <label
                htmlFor="discount"
                className="block text-sm font-medium text-gray-700"
              >
                Discount {discountType === "percentage" ? "(%)" : "(₹)"}
              </label>
              <input
                type="number"
                id="discount"
                className="w-full border rounded px-4 py-2"
                placeholder={
                  form.discountType === "percentage" ? "e.g., 20" : "e.g., 100"
                }
                onChange={setdiscountValue}
                value={discountValue}
              />
            </div> */}

            <div className="space-y-2">
              <label
                htmlFor="maxUsage"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Uses
              </label>
              <input
                type="number"
                id="maxUsage"
                className="w-full border rounded px-4 py-2"
                placeholder="e.g., 100"
                onChange={setmaxusage}
                value={maxUsage}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700"
              >
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                className="w-full border rounded px-4 py-2"
                onChange={setexpitydate}
                value={expiresAt}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Create Coupon
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Createcoupon
