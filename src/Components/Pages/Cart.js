import React, { useContext } from "react";
import { myContext } from "../Context/Context";
import Breadcrumbs from "../BreadCrumbs/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import "../Css/Cart.css";

const Cart = () => {
  const navigate = useNavigate();

  const { cart, incrementQty, decrementQty, currentUser } =
    useContext(myContext);

  const cartTotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const tax = Math.round(cartTotal * 0.05);
  const grandTotal = cartTotal + tax;

  const handleCheckout = () => {
    if (!currentUser) {
      alert("login to proceed");
      return;
    }

    navigate("/checkout");
  };

  return (
    <div className="container cart-page mt-3 mb-5">
      <Breadcrumbs />

      <div className="cart-heading">
        <h3></h3>
        {/* {cart.length > 0 && (
          <span>
            {cart.length} {cart.length === 1 ? "Item" : "Items"}
          </span>
        )} */}
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <h5>Your cart is empty</h5>
          <p>Add some products to your cart to continue shopping.</p>

          <button
            className="btn btn-dark"
            onClick={() => navigate("/products")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* ================= CART ITEMS ================= */}
          <div className="col-12 col-lg-8">
            <div className="cart-items-container">
              {cart.map((arr) => (
                <div className="cart-card" key={arr._id}>
                  <div className="cart-product">
                    {/* PRODUCT IMAGE */}
                    <div className="cart-image-section">
                      <img
                        src={arr.imageUrl}
                        alt={arr.name}
                        className="cart-image"
                      />
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="cart-product-details">
                      <h5 className="cart-name">{arr.name}</h5>

                      <p className="cart-description">
                        {arr.description}
                      </p>

                      <div className="cart-price">
                        ₹ {arr.price} /-
                      </div>

                      {/* QUANTITY */}
                      <div className="cart-quantity">
                        <span className="quantity-label">Quantity</span>

                        <div className="quantity-controls">
                          <button
                            className="incdrec-btn"
                            onClick={() => decrementQty(arr._id)}
                          >
                            −
                          </button>

                          <span className="quantity-number">
                            {arr.quantity}
                          </span>

                          <button
                            className="incdrec-btn"
                            onClick={() => incrementQty(arr._id)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* PRODUCT TOTAL */}
                    <div className="cart-product-total">
                      <span>Total</span>
                      <strong>
                        ₹ {arr.price * arr.quantity} /-
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CART SUMMARY ================= */}
          <div className="col-12 col-lg-4">
            <div className="cart-summary">
              <h4>Cart Summary</h4>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹ {cartTotal} /-</span>
              </div>

              <div className="summary-row">
                <span>Delivery</span>
                <span className="free-text">Free</span>
              </div>

              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹ {tax} /-</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <strong>₹ {grandTotal} /-</strong>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>

              <button
                className="continue-shopping-btn"
                onClick={() => navigate("/products")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;