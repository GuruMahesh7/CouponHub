import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

function ViewUsers() {
  const { id } = useParams();
  const navigate = useNavigate();
  // const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/coupons/view-users/${id}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Fetched users data:", data);
      setFilteredUsers(data)
      // setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load user redemptions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [id]);



  // useEffect(() => {
  //   const result = users.map((user) => ({
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     redeemedAt: user.redeemedAt,
  //   }));
  //   setFilteredUsers(result);
  // }, []);

  if (isLoading) {
    return (
      <div className="md:ml-64 flex items-center justify-center h-screen">
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
    <div className="space-y-6 p-4 md:p-8 md:ml-64 transition-all pb-24 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors shrink-0"
          onClick={() => navigate("/dashboard")}
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex flex-wrap items-center gap-2">
            Coupon Redemptions <span className="text-xs sm:text-sm font-normal text-purple-600 bg-purple-100 px-2 py-1 rounded-full whitespace-nowrap">(Demo Version)</span>
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Detailed usage information for the selected coupon.
          </p>
        </div>
      </div>

      <div className="border rounded-xl p-0 sm:p-6 bg-white shadow-sm overflow-hidden">
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
