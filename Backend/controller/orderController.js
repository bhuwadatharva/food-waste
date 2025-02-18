import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddeware.js";
import { Order } from "../models/orderSchema.js";
import { User } from "../models/userSchema.js";

// Place an order (User requests food)
export const placeOrder = catchAsyncErrors(async (req, res, next) => {
    // Ensure the user has the "User" role
    if (req.user.role !== 'User') {
        return next(new ErrorHandler("You are not authorized to place an order", 403));
    }

    const { foodDetails, quantity, address, pincode, foodtime, foodType, foodStyle } = req.body;
    const userId = req.user._id; // Get logged-in user's ID

    if (!foodDetails || !quantity || !address || !pincode || !foodtime || !foodType || !foodStyle) {
        return next(new ErrorHandler("All fields are required!", 400));
    }

    const order = await Order.create({
        userId,
        foodDetails,
        quantity,
        address,
        pincode,
        foodtime,
        foodType,
        foodStyle,
        status: "Pending"
    });

    res.status(201).json({
        success: true,
        message: "Food request placed successfully!",
        order
    });
});


// Get all orders for NGO by their pincode
export const getOrdersForNGO = catchAsyncErrors(async (req, res, next) => {
    const ngoId = req.user._id; // Get logged-in NGO's ID

    // Fetch NGO details to get the pincode
    const ngo = await User.findById(ngoId);
    if (!ngo) {
        return next(new ErrorHandler("NGO not found!", 404));
    }
    if(ngo.role != "NGO"){
        return next(new ErrorHandler("Role is not Proper",404));
    }

    const orders = await Order.find({ pincode: ngo.pincode, status: "Pending" })
        .populate("userId", "firstName lastName phone email");

    if (!orders.length) {
        return next(new ErrorHandler("No food requests found in this pincode!", 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

// Accept order & assign volunteer (NGO action)
// Accept order & assign volunteer (NGO action)
export const acceptOrder = catchAsyncErrors(async (req, res, next) => {
    const { orderId, volunteerId, userId } = req.body;

    // Check if the NGO user exists and has the correct role
    const ngoUser = await User.findById(userId);
    if (!ngoUser || ngoUser.role !== 'NGO') {
        return next(new ErrorHandler("NGO user not found or invalid role!", 404));
    }

    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    if (order.status !== "Pending") {
        return next(new ErrorHandler("Order is already processed!", 400));
    }

    // Update the order's status and assign the volunteer and NGO user
    order.status = "Accepted";
    order.volunteerId = volunteerId;
    order.ngoId = userId;  // Assign NGO user to the order
    await order.save();

    // Fetch the populated order details, including the ngoUser information
    const populatedOrder = await Order.findById(orderId)
        .populate("ngoId", "firstName lastName address")  // Populate NGO user details
        .populate("volunteerId", "firstName lastName phone email")  // Populate volunteer details
        .populate("userId", "firstName lastName phone email"); // Populate user details

    console.log(populatedOrder); // Log to debug

    res.status(200).json({
        success: true,
        message: "Order accepted and volunteer assigned!",
        order: populatedOrder
    });
});



// Get accepted orders for volunteers by their pincode
export const getAcceptedOrdersForVolunteer = catchAsyncErrors(async (req, res, next) => {
    const volunteerId = req.user._id; // Get logged-in volunteer's ID

    // Fetch volunteer details to get the pincode
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
        return next(new ErrorHandler("Volunteer not found!", 404));
    }

    const orders = await Order.find({ pincode: volunteer.pincode, status: "Accepted" })
        .populate("userId", "firstName lastName phone email")
        .populate("volunteerId", "firstName lastName phone email")
        .populate("ngoId", "firstName lastName address");

    if (!orders.length) {
        return next(new ErrorHandler("No accepted orders found in this pincode!", 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

// Complete the order (Volunteers mark as delivered)
export const completeOrder = catchAsyncErrors(async (req, res, next) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
        return next(new ErrorHandler("Order not found!", 404));
    }

    if (order.status !== "Accepted") {
        return next(new ErrorHandler("Order cannot be completed!", 400));
    }

    order.status = "Completed";
    await order.save();

    res.status(200).json({
        success: true,
        message: "Order marked as completed!",
        order
    });
});

// Get all orders placed by the user
export const getAllOrdersByUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user._id; // Get logged-in user's ID

    // Fetch all orders placed by the user and populate userId, ngoId, and volunteerId
    const orders = await Order.find({ userId })
        .populate("userId", "firstName lastName phone email")
        .populate("ngoId", "firstName lastName address contactInfo")  // Adjust fields as needed for ngoId
        .populate("volunteerId", "firstName lastName phone email"); // Adjust fields as needed for volunteerId

    if (!orders.length) {
        return next(new ErrorHandler("No orders found for this user!", 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});


// Controller to get completed orders by volunteer
export const getCompletedOrdersByVolunteer = catchAsyncErrors(async (req, res, next) => {
    const volunteerId = req.user.id;  // Get the logged-in volunteer's ID (from JWT or session)
  
    // Find all orders where the status is 'Completed' and filter by volunteerId
    const completedOrders = await Order.find({
      volunteerId: volunteerId,
      status: "Completed",  // Status should be 'Completed'
    })
      .populate("userId", "firstName lastName email phone")  // Populate user details
      .populate("ngoId", "firstName lastName address")  // Populate NGO details
      .populate("volunteerId", "firstName lastName email phone");  // Populate volunteer details
  
    if (!completedOrders || completedOrders.length === 0) {
      return next(new ErrorHandler("No completed orders found.", 404));
    }
  
    res.status(200).json({
      success: true,
      orders: completedOrders,
    });
  });
  
  export const getOrderHistory = async (req, res) => {
    try {
      // Get the NGO ID from the logged-in user (assuming it's in the session or JWT)
      const ngoId = req.user.id; // Assuming `req.user.ngoId` stores the NGO's ID
  
      if (!ngoId) {
        return res.status(400).json({ message: "NGO not found" });
      }
  
      // Fetch the orders accepted by this NGO
      const orders = await Order.find({ ngoId }).populate('userId ngoId', 'firstName lastName address'); // Populate user and ngo details
  
      if (orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this NGO." });
      }
  
      return res.json({ orders });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };