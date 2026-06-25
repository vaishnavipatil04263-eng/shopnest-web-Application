const express = require("express");
const router = express.Router();
const multer = require("multer");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");

// multer setup
const upload = multer({ dest: "uploads/" });

// ALL PRODUCTS
router
  .route("/")
  .get(getProducts)
   .post(protect, admin, upload.single("image"), createProduct);

// SINGLE PRODUCT
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, upload.single("image"), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;