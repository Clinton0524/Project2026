import React, { useContext } from "react";
import { myContext } from "../Context/Context";
import Breadcrumbs from "../BreadCrumbs/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import "../Css/Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, incrementQty, decrementQty } = useContext(myContext);
  const cartTotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };
  return (
    <div className="container mt-3">
      <Breadcrumbs />
      {cart.length === 0 ? (
        <h6>Cart is empty add items to cart</h6>
      ) : (
        <>
          <div className="cart-container">
            {cart.map((arr, index) => (
              <div className="card mb-3 cart-card" key={index}>
                <div className="card-body">
                  <div className="row">
                    {/* LEFT SECTION - Image + Quantity */}
                    <div className="col-4 text-center ">
                      {/* Image */}
                      <img
                        src={arr.imageUrl}
                        alt={arr.name}
                        className="img-fluid cart-image mb-3"
                      />

                      {/* Quantity */}
                      <div className="d-flex justify-content-center align-items-center mt-2">
                        <button
                          className="btn btn-dark incdrec-btn"
                          onClick={() => decrementQty(arr._id)}
                        >
                          -
                        </button>

                        <h6 className="mb-0 mx-2">{arr.quantity}</h6>

                        <button
                          className="btn btn-dark incdrec-btn"
                          onClick={() => incrementQty(arr._id)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* RIGHT SECTION - Product Details */}
                    <div className="col-8">
                      {/* Name */}
                      <h6 className="cart-name mb-2">{arr.name}</h6>

                      {/* Description */}
                      <p className="cart-description mb-2">{arr.description}</p>

                      {/* Price */}
                      <h6 className="cart-price mb-2">₹ {arr.price} /-</h6>

                      {/* Total */}
                      <h6 className="price-total fw-bold ">
                        Total: ₹ {arr.price * arr.quantity} /-
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-3">
            <div className="card shadow-sm p-3">
              <h5 className="text-center mb-3">Cart Summary</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>{cartTotal} rs/-</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Delivery</span>
                <span>Free</span>
              </div>

              <div className="d-flex justify-content-between mb-2">
                <span>Tax (5%)</span>
                <span>{Math.round(cartTotal * 0.05)} rs/-</span>
              </div>

              <hr />

              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total</span>
                <span>{cartTotal + Math.round(cartTotal * 0.05)} rs/-</span>
              </div>

              <button className="btn btn-dark w-100" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
