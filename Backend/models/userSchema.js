import mongoose from "mongoose";
import bcrypt from 'bcryptjs';  // instead of 'bcrypt'
import jwt from "jsonwebtoken";
import validator from "validator";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: [3, "First name must contain at least 3 characters"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minLength: [3, "Last name must contain at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: "Phone number must be 10 digits"
        }
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    role: {
        type: String,
        required: true,
        enum: ["Volunteer", "User", "NGO"],
    },
    pincode: {
        type:String
    },
    password: {
        type: String,
        minLength: [8, "Password must contain at least 8 characters"],
        required: true,
        select: false
    },
    // Additional fields based on role
    ngoDetails: {
        name: { type: String, trim: true }, // NGO name
        registrationNumber: { type: String, trim: true }, // NGO registration
    },
    volunteerDetails: {
        availability: { type: String, enum: ["Full-time", "Part-time"] }, // Availability of volunteer
        vehicle: { type: Boolean, default: false }, // Does the volunteer have a vehicle?
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, { timestamps: true });

// Pre-save hook to hash password before saving
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.generateJsonWebToken = function() {
    return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema);
