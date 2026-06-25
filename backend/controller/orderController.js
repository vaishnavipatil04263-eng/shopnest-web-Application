const Order = require('../model/Order');
const sendEmail = require('../utils/sendMail');

// Create a new order (this is called after payment verification by the payment controller)
// This function can also be used for creating orders without payment
const createOrder = async (req, res) => {
    try {
        const { items, totalAmount, address } = req.body;

        // Validate required fields
        if (!items || items.length === 0 || !totalAmount || !address) {
            return res.status(400).json({ message: 'Invalid order data' });
        }

        // Verify address has all required fields
        if (!address.fullname || !address.street || !address.city || !address.postalCode || !address.country) {
            return res.status(400).json({ message: 'Invalid address data' });
        }

        const order = new Order({
            user: req.user._id,
            products: items,
            totalAmount,
            address,
            status: 'pending'
        });

        await order.save();

        // Populate product details for email
        await order.populate('products.product', 'name price');

        const productDetails = order.products
            .map(p => `- ${p.product.name} x${p.quantity} = $${p.price}`)
            .join('\n');

        const emailContent = `Dear ${req.user.name},\n\nThank you for your order! Your order has been successfully created with the following details:\n\nOrder ID: ${order._id}\nTotal Amount: $${totalAmount}\n\nProducts:\n${productDetails}\n\nShipping Address:\n${address.fullname}\n${address.street}\n${address.city}, ${address.postalCode}\n${address.country}\n\nWe will notify you once your order is shipped.\n\nBest regards,\nOur Team`;

        await sendEmail(req.user.email, 'Order Created', emailContent);

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Get all orders (admin only)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .populate('products.product', 'name price image')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'All orders retrieved successfully',
            orders,
            total: orders.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// Get user's orders with full product details
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products.product', 'name price image')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'User orders retrieved successfully',
            orders,
            total: orders.length
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user orders', error: error.message });
    }
};

// Get specific order by ID with full details
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }

        const order = await Order.findById(id)
            .populate('user', 'name email')
            .populate('products.product', 'name price image');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized access to this order' });
        }

        res.status(200).json({
            message: 'Order details retrieved successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate order ID format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }

        // Validate status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'failed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('products.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

module.exports = { createOrder, getOrders, getUserOrders, getOrderById, updateOrderStatus };
