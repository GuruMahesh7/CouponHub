import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';
import {  Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

function Analytics() {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({
  revenueImpact: 0,
  avgDiscount: 0,
  usageRate: 0,
  conversionRate: 0,
});

  useEffect(() => {
    axios
      .get("https://backend-1-9gjf.onrender.com/api/coupons/analytics")
      .then((res) => {
        setCoupons(res.data.coupons);
        setStats({
          revenueImpact: res.data.summary.totalRevenue,
          avgDiscount: (
            res.data.summary.totalDiscounts / res.data.summary.totalRedemptions
          ).toFixed(1),
          usageRate: (
            (res.data.summary.totalRedemptions /
              res.data.coupons.reduce((s, c) => s + c.maxUsage, 0)) *
            100
          ).toFixed(1),
          conversionRate: (
            (res.data.summary.totalRedemptions /
              res.data.summary.totalCoupons) *
            100
          ).toFixed(1),
        });
      })
      .catch((err) => console.error("Error fetching analytics:", err));
  }, []);
  
  const getStatusCounts = () => {
    let active = 0, expired = 0, maxed = 0;
    coupons.forEach(c => {
      if (c.status==="expired") expired++;
      else if (c.usedCount >= c.maxUsage) maxed++;
      else active++;
    });
    return { active, expired, maxed };
  };

 
  const status = getStatusCounts();
  const pieData = {
    labels: ['Active', 'Expired', 'Max Usage Reached'],
    datasets: [{
      data: [status.active, status.expired, status.maxed],
      backgroundColor: ['#22c55e', '#ef4444', '#facc15']
    }]
  };

  const doughnutData = {
    labels: coupons.map(c => c.code),
    datasets: [{
      label: 'Used Count',
      data: coupons.map(c => c.usedCount),
      backgroundColor: coupons.map(() => `hsl(${Math.random() * 360}, 70%, 60%)`)
    }]
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 py-6 max-w-7xl mx-auto space-y-8 ml-65">
  
   <div className="space-y-4">
  <div>
    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
    <p className="text-gray-600 mt-1">Track coupon performance and usage metrics</p>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    
    <div className="bg-green-50 p-4 rounded-xl border border-green-100">
      <h4 className="text-sm font-medium text-green-800 flex items-center gap-1">💲 Revenue Impact</h4>
      <p className="text-2xl font-bold text-green-900 mt-1">₹{stats.revenueImpact}</p>
      <p className="text-xs text-green-700 mt-1">Estimated savings provided</p>
    </div>

    
    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
      <h4 className="text-sm font-medium text-blue-800 flex items-center gap-1">% Avg. Discount</h4>
      <p className="text-2xl font-bold text-blue-900 mt-1">{stats.avgDiscount}%</p>
      <p className="text-xs text-blue-700 mt-1">Average discount offered</p>
    </div>

    
    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
      <h4 className="text-sm font-medium text-purple-800 flex items-center gap-1">📈 Usage Rate</h4>
      <p className="text-2xl font-bold text-purple-900 mt-1">{stats.usageRate}%</p>
      <p className="text-xs text-purple-700 mt-1">Of total available uses</p>
    </div>

 
    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
      <h4 className="text-sm font-medium text-yellow-800 flex items-center gap-1">↪ Conversion Rate</h4>
      <p className="text-2xl font-bold text-yellow-900 mt-1">{stats.conversionRate}%</p>
      <p className="text-xs text-yellow-700 mt-1">Coupon to purchase rate</p>
    </div>
  </div>
</div>


  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <div className="bg-white p-4 rounded-xl shadow min-h-[300px]">
      <h2 className="text-lg font-semibold mb-4">🥧 Coupon Status</h2>
      <div className="h-64 md:h-80">
        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
    
    <div className="bg-white p-4 rounded-xl shadow min-h-[300px]">
      <h2 className="text-lg font-semibold mb-4">🍩 Usage by Coupon Code</h2>
      <div className="h-64 md:h-80">
        <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  </div>
  <div className="bg-white p-6 rounded-xl shadow mt-8">
  <h2 className="text-xl font-semibold mb-1">Detailed Coupon Analytics</h2>
  <p className="text-gray-500 mb-4">Complete overview of all coupon performance metrics</p>

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="text-left text-gray-600 border-b">
          <th className="py-2 px-3">Code</th>
          <th className="py-2 px-3">Discount</th>
          <th className="py-2 px-3">Usage</th>
          <th className="py-2 px-3">Success Rate</th>
          <th className="py-2 px-3">Revenue Impact</th>
          <th className="py-2 px-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {coupons.map((coupon) => {
          const successRate = ((coupon.usedCount / coupon.maxUsage) * 100).toFixed(0);
          const revenue = coupon.totalRevenueImpact || 0; 

          return (
            <tr key={coupon.code} className="border-t">
              <td className="py-3 px-3 font-medium">{coupon.code}</td>
              <td className="py-3 px-3">{coupon.discountValue}</td>
              <td className="py-3 px-3">{coupon.usedCount}</td>
              <td className="py-3 px-3 w-48">
                <div className="flex items-center gap-2">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-blue-500 h-2 rounded"
                      style={{ width: `${successRate}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-700">{successRate}%</span>
                </div>
              </td>
              <td className="py-3 px-3">₹{revenue}</td>
              <td className="py-3 px-3">
                {coupon.status === "active" ? (
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Active
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs font-medium">
                    Expired
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</div>

</div>

  );
}

export default Analytics;
