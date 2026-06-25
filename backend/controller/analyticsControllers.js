const Order = require('../model/Order');
const Product = require('../model/Product');
const User = require('../model/User');

const getAdminStatus = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        // Calculate total revenue from confirmed orders only
        const orders = await Order.find({ status: { $in: ['processing', 'shipped', 'delivered'] } });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Get order count by status
        const orderStats = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert to readable format
        const statusBreakdown = {};
        orderStats.forEach(stat => {
            statusBreakdown[stat._id] = stat.count;
        });

        res.status(200).json({
            message: 'Admin statistics retrieved successfully',
            stats: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalRevenue
            },
            orderStatusBreakdown: statusBreakdown
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error: error.message });
    }
};

module.exports = { getAdminStatus };