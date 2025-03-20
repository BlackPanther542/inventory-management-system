const express = require("express");
const Product = require("../models/productModel");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new product (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, price, quantity, category } = req.body;
        const product = new Product({ name, description, price, quantity, category });

        await product.save();
        res.status(201).json({ message: "✅ Product created successfully", product });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

// Get a single product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "❌ Product not found" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

// Update a product (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { name, description, price, quantity, category } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { name, description, price, quantity, category },
            { new: true }
        );

        if (!product) return res.status(404).json({ message: "❌ Product not found" });

        res.json({ message: "✅ Product updated successfully", product });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

// Delete a product (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "❌ Product not found" });

        res.json({ message: "✅ Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "❌ Server error: " + error.message });
    }
});

module.exports = router;
