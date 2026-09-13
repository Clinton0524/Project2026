
import React, { useContext, useEffect, useState } from "react";

import { myContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import api from "../Api/Api";

import "../Css/Checkout.css"

// =====================================================
// SAVED ADDRESSES
// =====================================================

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

// =====================================================
// CHECKOUT
// =====================================================

const Checkout = () => {
  const { cart, currentUser } = useContext(myContext);

  const navigate = useNavigate();

  // =====================================================
  // ADDRESS
  // =====================================================

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: "",
  });

  const [savedAddresses, setSavedAddresses] = useState([]);

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [showAddressForm, setShowAddressForm] = useState(false);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // PROMO CODE
  // =====================================================

  const [promoCode, setPromoCode] = useState("");

  const [appliedPromo, setAppliedPromo] = useState(null);

  const [promoLoading, setPromoLoading] = useState(false);

  // =====================================================
  // LOAD ADDRESSES
  // =====================================================

  useEffect(() => {
    if (currentUser?.id) {
      const addresses = getSavedAddresses(currentUser.id);

      setSavedAddresses(addresses);

      // Automatically select first saved address
      if (addresses.length > 0) {
        const firstAddress = addresses[0];

        setSelectedAddressId(firstAddress.id);

        setAddress({
          fullName: firstAddress.fullName,
          phone: firstAddress.phone,
          addressLine: firstAddress.addressLine,
          city: firstAddress.city,
          pincode: firstAddress.pincode,
        });

        setShowAddressForm(false);
      } else {
        // No saved address
        setShowAddressForm(true);
      }
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

  const promoDiscount = appliedPromo
    ? Number(appliedPromo.discount)
    : 0;

  const discountedSubtotal = Number(
    Math.max(cartTotal - promoDiscount, 0).toFixed(2),
  );

  const tax = Number(
    (discountedSubtotal * 0.05).toFixed(2),
  );

  const finalTotal = Number(
    (discountedSubtotal + tax).toFixed(2),
  );

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
  // SELECT SAVED ADDRESS
  // =====================================================

  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);

    setAddress({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      pincode: addr.pincode,
    });

    setShowAddressForm(false);
  };

  // =====================================================
  // SHOW NEW ADDRESS FORM
  // =====================================================

  const handleAddNewAddress = () => {
    setSelectedAddressId(null);

    setAddress({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      pincode: "",
    });

    setShowAddressForm(true);
  };

  // =====================================================
  // SAVE NEW ADDRESS
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

    // Automatically select newly added address
    setSelectedAddressId(newAddress.id);

    // Hide form
    setShowAddressForm(false);

    alert("Address saved");
  };

  // =====================================================
  // DELETE ADDRESS
  // =====================================================

  const handleDeleteAddress = (id) => {
    const updated = savedAddresses.filter(
      (addr) => addr.id !== id,
    );

    setSavedAddresses(updated);

    saveAddresses(currentUser.id, updated);

    // If deleted address was selected
    if (selectedAddressId === id) {
      if (updated.length > 0) {
        handleSelectAddress(updated[0]);
      } else {
        setSelectedAddressId(null);

        setShowAddressForm(true);

        setAddress({
          fullName: "",
          phone: "",
          addressLine: "",
          city: "",
          pincode: "",
        });
      }
    }
  };

  // =====================================================
  // APPLY PROMO CODE
  // =====================================================

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      alert("Please enter a promo code");
      return;
    }

    if (!cart.length) {
      alert("Your cart is empty");
      return;
    }

    try {
      setPromoLoading(true);

      const response = await api.post(
        "/promo-codes/apply",
        {
          code: promoCode.trim(),
          cartTotal: Number(cartTotal.toFixed(2)),
        },
      );

      if (response.data.success) {
        setAppliedPromo({
          code: response.data.promoCode,
          discount: Number(response.data.discount),
          finalTotal: Number(response.data.finalTotal),
        });

        setPromoCode(response.data.promoCode);

        alert(response.data.message);
      }
    } catch (error) {
      console.error("Apply Promo Error:", error);

      setAppliedPromo(null);

      const message =
        error.response?.data?.message ||
        "Failed to apply promo code";

      alert(message);
    } finally {
      setPromoLoading(false);
    }
  };

  // =====================================================
  // REMOVE PROMO CODE
  // =====================================================

  const handleRemovePromo = () => {
    setAppliedPromo(null);

    setPromoCode("");
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
      alert("Please select or add a shipping address");

      return;
    }

    navigate("/payment-mock", {
      state: {
        address,

        promoCode: appliedPromo?.code || null,

        promoDiscount: promoDiscount,

        subtotal: cartTotal,

        discountedSubtotal: discountedSubtotal,

        tax: tax,

        totalAmount: finalTotal,
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
    <div className="container checkout-page py-4 mb-5">

      {/* =================================================
          CHECKOUT HEADER
      ================================================= */}

      <div className="checkout-header mb-4">

        <div>
          <span className="checkout-eyebrow">
            SECURE CHECKOUT
          </span>

          <h2>Complete Your Order</h2>

          <p>
            Review your details and place your order.
          </p>
        </div>

        <div className="checkout-step">

          <span className="step-active">
            1
          </span>

          <span>Address</span>

          <span className="step-line"></span>

          <span className="step-active">
            2
          </span>

          <span>Payment</span>

        </div>

      </div>

      <div className="row">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="col-md-8">

          {/* =================================================
              USER DETAILS
          ================================================= */}

          <div className="checkout-card mb-3">

            <div className="user-details-card">

              <div className="user-avatar">
                {currentUser?.name
                  ? currentUser.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div>

                <h6 className="mb-1">
                  User Details
                </h6>

                <p className="mb-1">
                  <strong>Name:</strong>{" "}
                  {currentUser.name || "User"}
                </p>

                <p className="mb-0">
                  <strong>Email:</strong>{" "}
                  {currentUser.email}
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              SAVED ADDRESSES
          ================================================= */}

          <div className="checkout-card mb-3">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h6 className="mb-0">
                Delivery Address
              </h6>

              {savedAddresses.length > 0 && (
                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={handleAddNewAddress}
                >
                  + Add New Address
                </button>
              )}

            </div>

            {/* SAVED ADDRESSES */}

            {savedAddresses.length > 0 ? (

              <div>

                {savedAddresses.map((addr) => (

                  <div
                    key={addr.id}
                    className={`address-card mb-2 ${
                      selectedAddressId === addr.id
                        ? "address-selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectAddress(addr)
                    }
                  >

                    <div className="d-flex align-items-start">

                      {/* RADIO */}

                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={
                          selectedAddressId === addr.id
                        }
                        onChange={() =>
                          handleSelectAddress(addr)
                        }
                        className="me-3 mt-1"
                      />

                      {/* ADDRESS */}

                      <div className="flex-grow-1">

                        <strong>
                          {addr.fullName}
                        </strong>

                        <p className="mb-1 mt-1">
                          {addr.addressLine}
                        </p>

                        <p className="mb-1">
                          {addr.city} - {addr.pincode}
                        </p>

                        <small>
                          {addr.phone}
                        </small>

                      </div>

                      {/* DELETE */}

                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();

                          handleDeleteAddress(addr.id);
                        }}
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-muted mb-0">
                No saved addresses. Please add a new
                address.
              </p>

            )}

          </div>

          {/* =================================================
              NEW ADDRESS FORM
          ================================================= */}

          {showAddressForm && (

            <div className="checkout-card mb-3">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <h6 className="mb-0">
                  Add New Address
                </h6>

                {savedAddresses.length > 0 && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setShowAddressForm(false)
                    }
                  >
                    Cancel
                  </button>
                )}

              </div>

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
                className="btn btn-dark mt-2"
                onClick={handleSaveAddress}
              >
                Save Address
              </button>

            </div>

          )}

        </div>

        {/* =================================================
            RIGHT COLUMN
        ================================================= */}

        <div className="col-md-4">

          <div className="checkout-summary">

            <h6>
              Order Summary
            </h6>

            {/* =================================================
                CART ITEMS
            ================================================= */}

            <div className="checkout-cart-items">

              {cart.map((item) => (

                <div
                  key={item._id}
                  className="cart-item"
                >

                  <span className="cart-item-name">
                    {item.name} × {item.quantity}
                  </span>

                  <span className="cart-item-price">
                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}
                  </span>

                </div>

              ))}

            </div>

            <hr />

            {/* =================================================
                PROMO
            ================================================= */}

            <div className="promo-section">

              <h6>
                Promo Code
              </h6>

              {!appliedPromo ? (

                <div className="d-flex gap-2">

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) =>
                      setPromoCode(
                        e.target.value.toUpperCase(),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleApplyPromo();
                      }
                    }}
                  />

                  <button
                    className="btn btn-dark"
                    onClick={handleApplyPromo}
                    disabled={promoLoading}
                  >
                    {promoLoading ? "..." : "Apply"}
                  </button>

                </div>

              ) : (

                <div className="border rounded p-2">

                  <div className="d-flex justify-content-between align-items-center">

                    <div>

                      <strong>
                        {appliedPromo.code}
                      </strong>

                      <div className="text-success small">
                        Promo applied
                      </div>

                    </div>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleRemovePromo}
                    >
                      Remove
                    </button>

                  </div>

                </div>

              )}

            </div>

            {/* =================================================
                PRICE BREAKDOWN
            ================================================= */}

            <div className="price-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{cartTotal.toFixed(2)}
              </span>

            </div>

            {promoDiscount > 0 && (

              <div className="price-row discount-row">

                <span>
                  Promo Discount
                </span>

                <span>
                  -₹{promoDiscount.toFixed(2)}
                </span>

              </div>

            )}

            {promoDiscount > 0 && (

              <div className="price-row">

                <span>
                  After Discount
                </span>

                <span>
                  ₹{discountedSubtotal.toFixed(2)}
                </span>

              </div>

            )}

            <div className="price-row">

              <span>
                Tax (5%)
              </span>

              <span>
                ₹{tax.toFixed(2)}
              </span>

            </div>

            {/* =================================================
                TOTAL
            ================================================= */}

            <div className="total-row">

              <span>
                Total
              </span>

              <span>
                ₹{finalTotal.toFixed(2)}
              </span>

            </div>

            {/* =================================================
                PLACE ORDER
            ================================================= */}

            <button
              className="place-order-btn mt-3"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              Place Order & Pay
            </button>

            {/* =================================================
                SECURE CHECKOUT
            ================================================= */}

            <div className="secure-checkout">
              🔒 <strong>Secure Checkout</strong>
              {" "}· Your order details are protected
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;
