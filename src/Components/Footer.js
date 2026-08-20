import React from "react";
import "./Css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer mt-5">
      <div className="container">
        <div className="row">

          {/* Brand */}
          <div className="col-md-4 mb-3">
            <h5 className="footer-title">MyStore</h5>
            <p className="footer-text">
              Your one-stop shop for quality products at the best prices.
            </p>
          </div>

          {/* Links */}
          <div className="col-md-4 mb-3">
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-links">
              <li>Home</li>
              <li>Products</li>
              <li>Cart</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4 mb-3">
            <h6 className="footer-title">Contact</h6>
            <p className="footer-text mb-1">📍 India</p>
            <p className="footer-text mb-1">📧 support@mystore.com</p>
            <p className="footer-text">📞 +91 98765 43210</p>
          </div>

        </div>

        <hr className="footer-divider" />

        <p className="text-center footer-copy">
          © {new Date().getFullYear()} MyStore. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
