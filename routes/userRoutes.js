import {registerUser, loginUser, getMe, getUsers} from "../controllers/userController.js";
import express from 'express';
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/users', getUsers);

export default router