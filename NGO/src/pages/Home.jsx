import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation
import { Context } from "../main";  // Make sure to import the context

const Home = () => {
  const { user } = useContext(Context);  // Access user from context
  const [orders, setOrders] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState("");

  const navigate = useNavigate();  // Initialize useNavigate hook for navigation

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://food-waste-h2vh.onrender.com/api/v1/order/ngo/orders", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch orders.");
        setOrders(data.orders);
        console.log("Fetched Orders:", data.orders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchVolunteers = async () => {
      try {
        const response = await fetch("https://food-waste-h2vh.onrender.com/api/v1/user/volunteers", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Failed to fetch volunteers.");
        setVolunteers(data.volunteers);
        console.log("Fetched Volunteers:", data.volunteers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
    fetchVolunteers();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setSelectedVolunteer(""); // Reset selection
    console.log("Selected Order:", order);
  };

  const handleAcceptOrder = async () => {
    if (!selectedVolunteer) return alert("Please select a volunteer!");

    try {
      // Get the NGO user ID from context (user._id)
      const userId = user?._id;

      if (!userId) {
        return alert("User not authenticated.");
      }

      const response = await fetch("https://food-waste-h2vh.onrender.com/api/v1/order/accept", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder._id,
          volunteerId: selectedVolunteer,
          userId: userId, // Use user._id here
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to accept order.");
      alert("Order accepted successfully!");
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-screen min-h-screen overflow-hidden">
      <motion.div className="relative w-full h-[60vh] overflow-hidden"
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      >
        <img src="https://source.unsplash.com/1600x900/?charity,help" alt="Donation Banner" className="w-full h-full object-cover" />
      </motion.div>

      {/* History Button */}
      <div className="flex justify-center items-center mt-6">
        <button
          onClick={() => navigate('/history')}  // Use navigate() instead of history.push()
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          History
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Pending Food Requests</h2>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && orders.length === 0 && <p className="text-center text-gray-500">No pending food requests.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <div key={order._id} onClick={() => handleOrderClick(order)}
              className="p-4 border rounded-lg shadow-lg bg-white cursor-pointer hover:bg-gray-100">
              <h3 className="text-lg font-semibold">{order.userId.firstName} {order.userId.lastName}</h3>
              <p className="text-sm text-gray-600">Food: {order.foodDetails}</p>
              <p className="text-sm text-gray-600">Quantity: {order.quantity}</p>
              <p className="mt-2 text-gray-800">
                Status: <span className="text-red-500 font-semibold">{order.status}</span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Popup */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-2">Order Details</h3>
            <p><strong>Name:</strong> {selectedOrder.userId.firstName} {selectedOrder.userId.lastName}</p>
            <p><strong>Food Details:</strong> {selectedOrder.foodDetails}</p>
            <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
            <p><strong>Pincode:</strong> {selectedOrder.userId.pincode}</p>

            {/* Debugging Volunteers */}
            <p className="mt-2"><strong>Available Volunteers:</strong></p>
            {volunteers.length === 0 ? (
              <p className="text-sm text-gray-500">No volunteers available.</p>
            ) : (
              <select
                className="w-full border p-2 rounded mt-2"
                value={selectedVolunteer}
                onChange={(e) => setSelectedVolunteer(e.target.value)}
              >
                <option value="">Select Volunteer</option>
                {volunteers.map(vol => (
                  <option key={vol._id} value={vol._id}>
                    {vol.firstName} {vol.lastName} - {vol.pincode}
                  </option>
                ))}
              </select>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setSelectedOrder(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleAcceptOrder}
                className="bg-green-500 text-white px-4 py-2 rounded"
                disabled={!selectedVolunteer}
              >
                Accept Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
