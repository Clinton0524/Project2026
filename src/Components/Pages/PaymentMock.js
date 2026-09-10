import React, { useContext, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { myContext } from "../Context/Context";
import api from "../Api/Api";

const PaymentMock = () => {
  const { cart, currentUser, clearCart } = useContext(myContext);

  const location = useLocation();
  const navigate = useNavigate();
  const address = location.state?.address;
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(false);

  // Fake card details
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleCardChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePayment = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!address) {
      alert("Shipping address is missing");
      navigate("/checkout");
      return;
    }

    if (!cart.length) {
      alert("Your cart is empty");
      navigate("/products");
      return;
    }

    // Validate fake card details
    if (paymentMethod === "Card") {
      if (
        !cardDetails.cardNumber ||
        !cardDetails.expiry ||
        !cardDetails.cvv ||
        !cardDetails.name
      ) {
        alert("Please enter all card details");
        return;
      }

      if (cardDetails.cardNumber.length < 16) {
        alert("Please enter a valid card number");
        return;
      }

      if (cardDetails.cvv.length !== 3) {
        alert("Please enter a valid CVV");
        return;
      }
    }

    try {
      setLoading(true);

      const items = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      let paymentId = null;

      if (paymentMethod === "UPI" || paymentMethod === "Card") {
        // Fake payment ID
        paymentId = `MOCK_${paymentMethod}_${Date.now()}`;
      }

      const response = await api.post("/orders/checkout", {
        items,
        shippingAddress: address,
        paymentMethod,
        paymentId,
      });

      if (response.data.success) {
        const order = response.data.order;

        clearCart();

        navigate("/order-success", {
          state: {
            order,
          },
        });
      }
    } catch (error) {
      console.error("Payment error:", error);

      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h4 className="mb-4">Select Payment Method</h4>

            {/* COD */}

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <label className="form-check-label">Cash on Delivery</label>
            </div>

            {/* UPI */}

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <label className="form-check-label">UPI</label>
            </div>

            {/* CARD */}

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <label className="form-check-label">Card</label>
            </div>

            {/* FAKE CARD FORM */}

            {paymentMethod === "Card" && (
              <div className="border rounded p-3 mb-4">
                <h6 className="mb-3">Enter Card Details</h6>

                {/* Card Number */}

                <div className="mb-3">
                  <label className="form-label">Card Number</label>

                  <input
                    type="text"
                    name="cardNumber"
                    className="form-control"
                    placeholder="1234 5678 9012 3456"
                    maxLength="16"
                    value={cardDetails.cardNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");

                      setCardDetails({
                        ...cardDetails,
                        cardNumber: value,
                      });
                    }}
                  />
                </div>

                <div className="row">
                  {/* Expiry */}

                  <div className="col-6 mb-3">
                    <label className="form-label">Expiry Date</label>

                    <input
                      type="text"
                      name="expiry"
                      className="form-control"
                      placeholder="MM/YY"
                      maxLength="5"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                    />
                  </div>

                  {/* CVV */}

                  <div className="col-6 mb-3">
                    <label className="form-label">CVV</label>

                    <input
                      type="password"
                      name="cvv"
                      className="form-control"
                      placeholder="123"
                      maxLength="3"
                      value={cardDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");

                        setCardDetails({
                          ...cardDetails,
                          cvv: value,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Card Holder */}

                <div className="mb-2">
                  <label className="form-label">Card Holder Name</label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter card holder name"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                  />
                </div>

                <small className="text-muted">
                  This is a temporary fake payment form. No real payment will be
                  processed.
                </small>
              </div>
            )}

            <button
              className="btn btn-dark w-100"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : paymentMethod === "COD"
                  ? "Place Order"
                  : "Pay & Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMock;
