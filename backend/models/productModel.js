const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// ✅ Fix the error by checking if the model already exists
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
