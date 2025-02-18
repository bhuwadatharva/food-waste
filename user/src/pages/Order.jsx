import React, { useState, useContext } from "react";
import {
  Slider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Context } from "../main"; // Assuming UserContext is created and exported here

const Order = () => {
  const [foodDetails, setFoodDetails] = useState("");
  const [quantity, setQuantity] = useState(50);
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [foodtime, setFoodtime] = useState(null);
  const [foodType, setFoodType] = useState("Veg");
  const [foodStyle, setFoodStyle] = useState("Cooked Food");
  const [message, setMessage] = useState("");

  // Access user data from context
  const { user } = useContext(Context);
  console.log(user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!foodDetails || !quantity || !address || !pincode || !foodtime || !foodType || !foodStyle) {
      setMessage("All fields are required!");
      return;
    }
  
    const formattedTime = foodtime
      ? foodtime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";
  
    const id = user?._id;  // This is where you're accessing the user ID
  
    if (!id) {
      setMessage("Authentication failed! Please log in again.");
      return;
    }
  
    const orderData = {
      foodDetails,
      quantity,
      address,
      pincode,
      foodtime: foodtime ? new Date(foodtime) : null,
      foodType,
      foodStyle,
      role: user?.role || "User",
      userId: id,  // Sending user ID as part of the order data
    };
  
    try {
      const response = await fetch("https://food-waste-h2vh.onrender.com/api/v1/order/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Corrected placement
        body: JSON.stringify(orderData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to place order");
  
      setMessage("Order placed successfully!");
      setFoodDetails("");
      setQuantity(50);
      setAddress("");
      setPincode("");
      setFoodtime(null);
      setFoodType("Veg");
      setFoodStyle("Cooked Food");
    } catch (error) {
      setMessage(error.message);
      console.log(error.message);
    }
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg md:max-w-xl lg:max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-5">
            Create New Post
          </h2>
          {message && <p className="text-center text-green-600 font-semibold mb-4">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <textarea
              rows="3"
              placeholder="Enter food details"
              value={foodDetails}
              onChange={(e) => setFoodDetails(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <div>
              <label className="block font-semibold mb-2">
                Food quantity: {quantity} persons
              </label>
              <Slider
                value={quantity}
                min={1}
                max={500}
                onChange={(e, newValue) => setQuantity(newValue)}
                color="secondary"
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Cooking time:</label>
              <TimePicker
                label="Select Time"
                value={foodtime}
                onChange={(newValue) => setFoodtime(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </div>
            {/* Food Type Selection */}
<FormControl fullWidth className="mt-5">
  <InputLabel>Food Type</InputLabel>
  <Select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
    <MenuItem value="Veg">Veg</MenuItem>
    <MenuItem value="Non-veg">Non-veg</MenuItem>
  </Select>
</FormControl>

{/* Food Style Selection */}
<FormControl fullWidth className="top-6">
  <InputLabel>Food Style</InputLabel>
  <Select value={foodStyle} onChange={(e) => setFoodStyle(e.target.value)}>
    <MenuItem value="Raw Food">Raw Food</MenuItem>
    <MenuItem value="Cooked Food">Cooked Food</MenuItem>
  </Select>
</FormControl>

{/* Pickup Address */}
<input
  type="text"
  placeholder="Pickup Address"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 mt-10"
/>

            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
  type="submit"
  className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition duration-300 mb-10"
>
  Post
</button>

          </form>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default Order;
