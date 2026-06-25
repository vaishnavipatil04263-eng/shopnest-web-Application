import React from "react";
import { Link } from "react-router-dom";
import "../styles/product.css";

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
      <span className="rating-count">({rating?.toFixed(1) || '0.0'})</span>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <StarRating rating={product.rating} />
        <p className="product-price">₹{product.price.toFixed(2)}</p>
        <Link to={`/product/${product._id}`} className="View-details-button">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;