import {  useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewUsers() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

   useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios(
          `https://backend-1-9gjf.onrender.com/api/coupons/users/${id}`
        );
        setUsers(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching coupons:", error);
      }
    };

    fetchCoupons();
  }, []);

  console.log(users)

  useEffect(() => {
    if (users.length > 0) {
      const result = users
        .map((user) => {
           return {
             id: user._id,
             name: user.name,
             email: user.email,
              redeemedAt: user.redeemedAt
           };
        })
        .filter(Boolean); // remove nulls

      setFilteredUsers(result);
    }
  }, [users, id]);

  return (
    <div className="space-y-6 p-6 ml-65">
      
      <div className="flex items-center gap-4">
    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm" onClick={() => navigate("/dashboard")}>
      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" stroke-width="2"
        viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      Back to Dashboard
    </button>
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Coupon Redemptions</h1>
      <p className="text-gray-600 mt-1">Detailed usage information for the selected coupon.</p>
    </div>
  </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        {filteredUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No users have redeemed this coupon yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">User</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Redeemed At</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3">
                      {new Date(user.redeemedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewUsers;
