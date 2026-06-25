import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';
import '../styles/home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-wrapper">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">🔥 New Arrivals Available</span>
          <h1>Shop Smart,<br /><span className="hero-highlight">Live Better</span></h1>
          <p>Discover thousands of premium products at unbeatable prices. Fast delivery, easy returns.</p>
          <div className="hero-btns">
            <Link to="/shop" className="btn">Shop Now</Link>
            <Link to="/about" className="btn btn-outline">Learn More</Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-circle"></div>
          <div className="hero-circle hero-circle-2"></div>
          <span className="hero-emoji">🛍️</span>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        {[
          { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
          { icon: '🔒', title: 'Secure Payment', desc: 'Razorpay protected' },
          { icon: '↩️', title: 'Easy Returns', desc: '7 day return policy' },
          { icon: '💬', title: '24/7 Support', desc: 'Always here for you' },
        ].map((f) => (
          <div className="feature-card" key={f.title}>
            <span className="feature-icon">{f.icon}</span>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Featured Products */}
      <section className="home-container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <Link to="/shop" className="view-all">View All →</Link>
        </div>
        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton-card" />)}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Banner CTA */}
      <section className="cta-banner">
        <h2>Ready to start shopping?</h2>
        <p>Join thousands of happy customers on ShopNest</p>
        <Link to="/register" className="btn">Create Account</Link>
      </section>

    </div>
  );
};

export default Home;