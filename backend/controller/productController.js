const Product = require("../model/Product");
const cloudinary = require("../config/cloudinary");

// GET ALL
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// GET BY ID
const getProductById = async (req, res) => {
  try {
    console.log("ID RECEIVED:", req.params.id);

    const product = await Product.findById(req.params.id);

    console.log("PRODUCT FOUND:", product);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// CREATE PRODUCT ✅ FIXED
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an image",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl: result.secure_url,
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
// UPDATE PRODUCT ✅ FIXED
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    // ✅ FIXED IMAGE UPDATE
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      product.imageUrls = result.secure_url; // overwrite old image
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};