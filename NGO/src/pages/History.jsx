import React, { useEffect, useState } from 'react';

const History = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await fetch("https://food-waste-h2vh.onrender.com/api/v1/order/ngo/history", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch order history.");

        console.log("Fetched Order History:", data.orders);
        setOrderHistory(data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  return (
    <div className="w-screen min-h-screen overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Order History</h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {orderHistory.length === 0 && <p className="text-center text-gray-500">No order history available.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orderHistory.map((order) => (
            <div key={order._id} className="p-4 border rounded-lg shadow-lg bg-white">
              <h3 className="text-lg font-semibold">{order.userId.firstName} {order.userId.lastName}</h3>
              <p className="text-sm text-gray-600">
                Receiver: {order.ngoId ? `${order.ngoId.firstName} ${order.ngoId.lastName}` : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Receiver address: {order.ngoId ? order.ngoId.address : "N/A"}
              </p>
              <p className="text-sm text-gray-600">Food: {order.foodDetails}</p>
              <p className="text-sm text-gray-600">Address: {order.address}</p>
              <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
              <p className="mt-2 text-gray-800">
                Status: <span className="text-green-500 font-semibold">{order.status}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
