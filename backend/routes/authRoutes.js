const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, verifyEmail, forgotPassword } = require('../controller/authController');
const { protect, } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.get('/users',protect, admin, getUser);



module.exports = router;