import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import About from "./pages/About";
import ReturnPolicy from "./pages/ReturnPolicy";
import Disclaimer from "./pages/Disclaimer";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Cart from "./pages/Card";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import OrderHistory from "./pages/OrderHistory";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop/> } />
      <Route path="/product/:id" element={<ProductDetail/> } />
      <Route path="/cart" element={<Cart/> } />
      <Route path="/checkout" element={<Checkout/> } />
      <Route path="/ordersuccess" element={<OrderSuccess/> } />
      <Route path="/orders" element={<OrderHistory/> } />
      <Route path="/login" element={<Login/> } />
      <Route path="/register" element={<Register /> } />
      <Route path="/profile" element={<Profil/> } />
      <Route path="/about" element={<About/> } />
      <Route path="/disclaimer" element={<Disclaimer/> } />
      <Route path="/return" element={<ReturnPolicy/> } />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
