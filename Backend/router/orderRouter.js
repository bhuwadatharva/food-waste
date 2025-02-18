import express from "express";
import { 
    placeOrder, 
    getOrdersForNGO, 
    acceptOrder, 
    getAcceptedOrdersForVolunteer, 
    completeOrder,
    getAllOrdersByUser,
    getCompletedOrdersByVolunteer,
    getOrderHistory
} from "../controller/orderController.js";
import { isAuthenticated } from "../middlewares/auth.js"; // Middleware for role-based authentication

const router = express.Router();

// 📌 Route for users to place a food request
router.post("/place", isAuthenticated, placeOrder);

// 📌 Route for NGOs to fetch orders based on their pincode
router.get("/ngo/orders", isAuthenticated,getOrdersForNGO);

// 📌 Route for NGOs to accept an order and assign a volunteer
router.put("/accept", isAuthenticated, acceptOrder);

// 📌 Route for volunteers to fetch accepted orders in their pincode
router.get("/volunteer/orders", isAuthenticated, getAcceptedOrdersForVolunteer);

// 📌 Route for volunteers to mark an order as completed
router.put("/complete", isAuthenticated, completeOrder);

router.get("/orders",isAuthenticated, getAllOrdersByUser);

router.get("/volunteer/history", isAuthenticated, getCompletedOrdersByVolunteer);

router.get("/ngo/history", isAuthenticated, getOrderHistory);
export default router;
