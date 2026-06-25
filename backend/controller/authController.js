const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendMail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existinguser = await User.findOne({ email });
    if (existinguser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    if (user) {
      const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
      await sendEmail(
        email,
        'Verify your email',
        `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
      );

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: 'Registration successful. Please verify your email.',
      });
    } else {
      return res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req,res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if(user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUser = async (req,res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const user = await User.findOne({ verificationToken: token });
        if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'No account found with that email.' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        await sendEmail(
            email,
            'Password Reset Request',
            `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`
        );

        res.json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { registerUser, loginUser, getUser, verifyEmail, forgotPassword };