const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const Order = require("../models/Order");

// ✅ Create a new order
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { products, totalPrice } = req.body;
        const userId = req.user.id;

        if (!products || !totalPrice) {
            return res.status(400).json({ message: "❌ Missing required fields" });
        }

        const newOrder = new Order({
            userId,
            products,
            totalPrice,
            status: "pending",
        });

        await newOrder.save();
        res.status(201).json({ message: "✅ Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to place order", error: error.message });
    }
});

// ✅ Get all orders for the logged-in user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to fetch orders", error: error.message });
    }
});

module.exports = router;
