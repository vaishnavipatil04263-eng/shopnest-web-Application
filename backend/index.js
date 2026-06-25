const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cloudinary = require("./config/cloudinary"); // ✅ ADD THIS


dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors(
  {
    origin: ["http://localhost:3000", "https://127.0.0.1:3000"],
    methods : ["GET","POST","PUT","DELETE"],
    credentials: true
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// test route
app.get("/", (req, res) => {
  res.send("shopnest backend is running");
});

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// optional: check cloudinary working
console.log("Cloudinary Config Loaded:", cloudinary.config().cloud_name);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});