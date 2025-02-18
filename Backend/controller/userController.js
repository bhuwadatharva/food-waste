import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddeware.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import bcrypt from "bcryptjs";

// Register User (Volunteer, NGO, or Donor)
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, phone, address, password, role, ngoDetails, volunteerDetails, pincode } = req.body;

    if (!firstName || !lastName || !email || !phone || !address || !password || !role || !pincode) {
        return next(new ErrorHandler("Please fill in all required fields!", 400));
    }

    if (phone.length !== 10 || !/^[0-9]{10}$/.test(phone)) {
        return next(new ErrorHandler("Phone number must be 10 digits!", 400));
    }

    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already registered", 400));
    }

    user = await User.create({
        firstName, lastName, email, phone, address, password, role,pincode,
        ngoDetails: role === "NGO" ? ngoDetails : undefined,
        volunteerDetails: role === "Volunteer" ? volunteerDetails : undefined,
    });

    generateToken(user, "Successfully Registered!", 200, res);
});

// Login User
export const loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(new ErrorHandler("Please provide all details!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email or Password!", 400));
    }

    if (role !== user.role) {
        return next(new ErrorHandler("User not found with this role!", 400));
    }

    generateToken(user, "Login Successfully!", 201, res);
});

// Get User Details
// export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
//     const user = await User.find({role: "User"})
//     res.status(200).json({ success: true, user });
// });

export const getUserDetails = async (req, res, next) => {
    res.status(200).json(req.user);
  };

// Get All Volunteers
export const getAllVolunteers = catchAsyncErrors(async (req, res, next) => {
    const volunteers = await User.find({ role: "Volunteer" });
    res.status(200).json({ success: true, volunteers });
});

// Get All NGOs
export const getAllNGOs = catchAsyncErrors(async (req, res, next) => {
    const ngos = await User.find({ role: "NGO" });
    res.status(200).json({ success: true, ngos });
});

// Logout User
export const logoutUser = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("Token", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
    }).json({ success: true, message: "Logged Out Successfully" });
});
