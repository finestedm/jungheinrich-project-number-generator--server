import Jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'
import genSalt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'

// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, branch, isAdmin} = req.body;

    if (!name || !email || !password || !branch) {
        res.status(400)
        throw new Error('Please add all fields.')
    }

    // check if user already exists
    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400)
        throw new Error ('this email was already used')
    }

    // Hash password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user

    const user = await User.create({
            name, 
            email,
            password: hashedPassword,
            branch,
            isAdmin,        
        })
    
    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            branch: user.branch,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error ('invalid user data')
    }

    res.json({message: 'Register User'})
})

// @desc Authenticate a user
// @route POST /api/users/login
// @access Public
const loginUser= asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // check for user email
    const user = await User.findOne({ email })
    
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            branch: user.branch,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error ('email is not registered or wrong password')
    }
    
    res.json({ message: 'Login User' })
})

// @desc Get a user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user)
})

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find();
    res.status(200).json(users)
})

function generateToken(id) {
    return Jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

export {registerUser, loginUser, getMe, getUsers}