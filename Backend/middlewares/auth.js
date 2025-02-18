import jwt from "jsonwebtoken"
import { User } from '../models/userSchema.js';// Adjust to your User model path

export const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.Token || req.headers['authorization']?.split(' ')[1]; // Token from cookies or headers

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // JWT_SECRET should be in your environment variables
    const user = await User.findById(decoded.id);  // Attach user to req.user from the database
    req.user = user;
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

