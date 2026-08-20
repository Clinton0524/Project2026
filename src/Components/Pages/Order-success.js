import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="container mt-5 text-center">
      <h3 className="text-success">🎉 Order Placed Successfully!</h3>
      <p className="mt-2">
        Thank you for your order. We’ll contact you soon.
      </p>

      <Link to="/" className="btn btn-dark mt-3">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
