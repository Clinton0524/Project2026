import React, { useContext, useEffect, useState } from "react";

import { myContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";

const getSavedAddresses = (userId) => {
  try {
    const data = JSON.parse(localStorage.getItem(`address_${userId}`));

    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

const saveAddresses = (userId, addresses) => {
  localStorage.setItem(`address_${userId}`, JSON.stringify(addresses));
};

const Checkout = () => {
  const { cart, currentUser } = useContext(myContext);

  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOAD ADDRESSES
  // =====================================================

  useEffect(() => {
    if (currentUser?.id) {
      setSavedAddresses(getSavedAddresses(currentUser.id));
    }
  }, [currentUser]);

  // =====================================================
  // PROTECT CHECKOUT
  // =====================================================

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // =====================================================
  // TOTAL
  // =====================================================

  const cartTotal = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  const tax = Number((cartTotal * 0.05).toFixed(2));

  const finalTotal = Number((cartTotal + tax).toFixed(2));

  // =====================================================
  // ADDRESS CHANGE
  // =====================================================

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // SAVE ADDRESS
  // =====================================================

  const handleSaveAddress = () => {
    if (!currentUser) {
      alert("Please login");
      return;
    }

    if (
      !address.fullName ||
      !address.phone ||
      !address.addressLine ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please complete the address");
      return;
    }

    const newAddress = {
      id: Date.now(),
      ...address,
    };

    const updated = [...savedAddresses, newAddress];

    setSavedAddresses(updated);

    saveAddresses(currentUser.id, updated);

    alert("Address saved");
  };

  // =====================================================
  // SELECT ADDRESS
  // =====================================================

  const handleSelectAddress = (addr) => {
    setAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      pincode: addr.pincode,
    });
  };

  // =====================================================
  // DELETE ADDRESS
  // =====================================================

  const handleDeleteAddress = (id) => {
    const updated = savedAddresses.filter((addr) => addr.id !== id);

    setSavedAddresses(updated);

    saveAddresses(currentUser.id, updated);
  };

  // =====================================================
  // PLACE ORDER
  // =====================================================

  const handlePlaceOrder = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!cart.length) {
      alert("Your cart is empty");
      navigate("/products");
      return;
    }

    if (
      !address.fullName ||
      !address.phone ||
      !address.addressLine ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please complete your shipping address");
      return;
    }

    navigate("/payment-mock", {
      state: {
        address,
      },
    });
  };

  // =====================================================
  // UI
  // =====================================================

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mt-4 mb-5">
      <h4 className="mb-4">Checkout</h4>

      <div className="row">
        {/* ============================================
            LEFT
        ============================================ */}

        <div className="col-md-8">
          {/* USER */}

          <div className="card mb-3 p-3">
            <h6>User Details</h6>

            <p className="mb-1">
              <strong>Name:</strong> {currentUser.name || "User"}
            </p>

            <p className="mb-0">
              <strong>Email:</strong> {currentUser.email}
            </p>
          </div>

          {/* SAVED ADDRESSES */}

          {savedAddresses.length > 0 && (
            <div className="card mb-3 p-3">
              <h6>Saved Addresses</h6>

              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border rounded p-2 mb-2 d-flex justify-content-between"
                >
                  <div
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => handleSelectAddress(addr)}
                  >
                    <strong>{addr.fullName}</strong>

                    <p className="mb-0">
                      {addr.addressLine}, {addr.city} - {addr.pincode}
                    </p>

                    <small>{addr.phone}</small>
                  </div>

                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDeleteAddress(addr.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ADDRESS */}

          <div className="card p-3">
            <h6>Shipping Address</h6>

            <input
              className="form-control mb-2"
              placeholder="Full Name"
              name="fullName"
              value={address.fullName}
              onChange={handleChange}
            />

            <input
              className="form-control mb-2"
              placeholder="Phone"
              name="phone"
              value={address.phone}
              onChange={handleChange}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Address"
              rows="2"
              name="addressLine"
              value={address.addressLine}
              onChange={handleChange}
            />

            <div className="row">
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="City"
                  name="city"
                  value={address.city}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Pincode"
                  name="pincode"
                  value={address.pincode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              className="btn btn-outline-dark mt-2"
              onClick={handleSaveAddress}
            >
              Save Address
            </button>
          </div>
        </div>

        {/* ============================================
            RIGHT
        ============================================ */}

        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6 className="mb-3">Order Summary</h6>

            {cart.map((item) => (
              <div
                key={item._id}
                className="d-flex justify-content-between mb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>

              <span>₹{cartTotal.toFixed(2)}</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Tax (5%)</span>

              <span>₹{tax.toFixed(2)}</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>

              <span>₹{finalTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn-dark w-100 mt-3"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              Place Order & Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
