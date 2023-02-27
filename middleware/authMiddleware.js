import Jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler'
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from haeder
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = Jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            next()
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('no token')
    }
});

export default protect