import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state)=> state.cart.cartItems?.length || 0);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <img src="/image.png" alt="ShopNest logo" />
          ShopNest
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/shop">Shop</Link>
        </li>
        <li>
          <Link to="/cart">Cart ({cartItems})</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/profile">Hi, {user.name}</Link>
            </li>
            {user.role === "admin" && (
              <li>
                <Link to="/admin">Admin</Link>
              </li>
            )}
            <li>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;