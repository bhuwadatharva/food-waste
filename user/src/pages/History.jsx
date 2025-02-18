import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Context } from "../main"; // Import the Context

const History = () => {
  const { user } = useContext(Context); // Access user from context
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
       
        const response = await axios.get("http://localhost:4000/api/v1/order/orders", {
          withCredentials: true, // Include credentials for authentication
        });

        console.log("API Response:", response.data); // Debugging: Ensure API returns data

        setHistory(response.data.orders); // Update state
        setLoading(false); // Set loading to false
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  console.log("History State:", history); // Debugging: Check if state updates

  return (
    <div className="w-full min-h-screen bg-gray-50 mb-20">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Completed Orders History</h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
       
        {history.length === 0 && <p className="text-center text-gray-500">No completed orders.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">{order.userId.firstName} {order.userId.lastName}</h3>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Receiver:</strong> {order.ngoId ? `${order.ngoId.firstName} ${order.ngoId.lastName}` : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Receiver Address:</strong> {order.ngoId ? order.ngoId.address : 'N/A'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Food:</strong> {order.foodDetails}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Address:</strong> {order.address}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Quantity:</strong> {order.quantity}
              </p>
              <p className="text-sm mt-2 text-gray-800">
                <strong>Status:</strong> 
                <span className={`font-semibold ${order.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                  {order.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
