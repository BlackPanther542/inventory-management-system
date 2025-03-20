const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Ensure this path is correct
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();

// ✅ Register User
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "❌ User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword, role });

        await user.save();
        res.status(201).json({ message: "✅ User registered successfully" });

    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

// ✅ Login User
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "❌ Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "❌ Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "✅ Login successful", token });

    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

// ✅ Place a new order
router.post("/orders", authMiddleware, async (req, res) => {
    try {
        const { products, totalPrice } = req.body;
        const userId = req.user.id;

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: "❌ Product not found" });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `❌ Not enough stock for ${product.name}` });
            }
        }

        const newOrder = new Order({ userId, products, totalPrice, status: "pending" });
        await newOrder.save();

        for (const item of products) {
            const product = await Product.findById(item.productId);
            product.quantity -= item.quantity;
            await product.save();
        }

        res.status(201).json({ message: "✅ Order placed successfully", order: newOrder });

    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

// ✅ Get logged-in user's orders
router.get("/orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate("products.productId", "name price");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "❌ Failed to fetch orders", error: error.message });
    }
});

// ✅ Get all orders (Admin only)
router.get("/orders/all", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("userId", "username email")
            .populate("products.productId", "name price");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

module.exports = router;
