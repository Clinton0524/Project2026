import React, { useContext, useState, useEffect } from "react";
import { myContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";

/* ================= LOCAL STORAGE HELPERS ================= */

const getSavedAddresses = (uid) => {
  const data = JSON.parse(localStorage.getItem(`address_${uid}`));
  return Array.isArray(data) ? data : [];
};


const saveAddresses = (uid, addresses) => {
  localStorage.setItem(`address_${uid}`, JSON.stringify(addresses));
};

/* ================= COMPONENT ================= */

const Checkout = () => {
  const { cart, currentUser } = useContext(myContext);
  const navigate = useNavigate();

  /* ---------------- ADDRESS STATE ---------------- */

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);

  /* ---------------- LOAD SAVED ADDRESSES ---------------- */

  useEffect(() => {
    if (currentUser?.uid) {
      setSavedAddresses(getSavedAddresses(currentUser.uid));
    }
  }, [currentUser]);

  /* ---------------- CART TOTALS ---------------- */

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const tax = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + tax;

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    if (!currentUser) {
      alert("Please login");
      return;
    }

    const newAddress = {
      id: Date.now(),
      ...address,
    };

    const updated = [...savedAddresses, newAddress];
    setSavedAddresses(updated);
    saveAddresses(currentUser.uid, updated);

    alert("Address saved");
  };

  const handleSelectAddress = (addr) => {
    setAddress(addr);
  };

  const handleDeleteAddress = (id) => {
    const updated = savedAddresses.filter((addr) => addr.id !== id);
    setSavedAddresses(updated);
    saveAddresses(currentUser.uid, updated);
  };

  const handlePlaceOrder = () => {
    if (!currentUser) {
      alert("Please login");
      return;
    }

    if (!address.addressLine) {
      alert("Please select or enter an address");
      return;
    }

    console.log("ORDER DATA:", {
      user: currentUser.uid,
      address,
      cart,
      total: finalTotal,
    });

    navigate("/payment-mock");
  };

  /* ================= UI ================= */

  return (
    <div className="container mt-4">
      <h4 className="mb-4">Checkout</h4>

      <div className="row">
        {/* ================= LEFT SIDE ================= */}
        <div className="col-md-8">
          {/* USER INFO */}
          <div className="card mb-3 p-3">
            <h6>User Details</h6>
            <p className="mb-1">
              <strong>Name:</strong> {currentUser?.displayName || "User"}
            </p>
            <p className="mb-0">
              <strong>Email:</strong> {currentUser?.email}
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
                    style={{ cursor: "pointer" }}
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

          {/* ADDRESS FORM */}
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

        {/* ================= RIGHT SIDE ================= */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm">
            <h6 className="mb-3">Order Summary</h6>

            {/* 🔹 CART ITEMS (NOT REMOVED) */}
            {cart.map((item) => (
              <div
                key={item._id}
                className="d-flex justify-content-between mb-2"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>{item.price * item.quantity} rs/-</span>
              </div>
            ))}

            <hr />

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>{cartTotal} rs/-</span>
            </div>

            <div className="d-flex justify-content-between">
              <span>Tax (5%)</span>
              <span>{tax} rs/-</span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total</span>
              <span>{finalTotal} rs/-</span>
            </div>

            <button
              className="btn btn-dark w-100 mt-3"
              onClick={handlePlaceOrder}
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
