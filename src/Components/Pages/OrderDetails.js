import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { myContext } from "../Context/Context";
import api from "../Api/Api";

const STATUS_LIST = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const OrderDetails = () => {
  const { orderId } =
    useParams();

  const { currentUser } =
    useContext(myContext);

  const navigate =
    useNavigate();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancelling, setCancelling] =
    useState(false);

  // =====================================================
  // FETCH ORDER
  // =====================================================

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetchOrder();
  }, [
    currentUser,
    orderId,
  ]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get(
          `/orders/order/${orderId}`
        );

      if (response.data.success) {
        setOrder(
          response.data.order
        );
      }
    } catch (error) {
      console.error(
        "Order details error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this order?"
      )
    ) {
      return;
    }

    try {
      setCancelling(true);

      const response =
        await api.put(
          `/orders/cancel/${orderId}`
        );

      if (response.data.success) {
        setOrder(
          response.data.order
        );
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    } finally {
      setCancelling(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
        <p className="mt-3">
          Loading order...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !order) {
    return (
      <div className="container mt-5 text-center">

        <h4>
          {error ||
            "Order not found"}
        </h4>

        <button
          className="btn btn-dark mt-3"
          onClick={() =>
            navigate("/orders")
          }
        >
          Back to Orders
        </button>

      </div>
    );
  }

  // =====================================================
  // STATUS HISTORY
  // =====================================================

  const completedStatuses =
    order.statusHistory?.map(
      (history) =>
        history.status
    ) || [];

  return (
    <div className="container mt-4 mb-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3>
            Order Details
          </h3>

          <p className="text-muted mb-0">
            Order #
            {order._id
              .slice(-8)
              .toUpperCase()}
          </p>
        </div>

        <button
          className="btn btn-outline-dark"
          onClick={() =>
            navigate("/orders")
          }
        >
          Back to Orders
        </button>

      </div>

      {/* STATUS */}

      <div className="card p-4 mb-4">

        <h5>
          Order Status
        </h5>

        <div className="mt-4">

          {STATUS_LIST.map(
            (status, index) => {

              const completed =
                completedStatuses.includes(
                  status
                );

              return (
                <div
                  key={status}
                  className="d-flex align-items-start mb-3"
                >

                  <div
                    className={`rounded-circle border ${
                      completed
                        ? "bg-success text-white"
                        : "bg-light"
                    }`}
                    style={{
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "center",
                      flexShrink: 0,
                    }}
                  >
                    {completed
                      ? "✓"
                      : index + 1}
                  </div>

                  <div className="ms-3">

                    <strong>
                      {status}
                    </strong>

                    {completed && (
                      <div>
                        <small className="text-muted">
                          Completed
                        </small>
                      </div>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="card p-4 mb-4">

        <h5 className="mb-3">
          Items
        </h5>

        {order.items.map(
          (item, index) => {

            const product =
              item.productId;

            return (
              <div
                key={
                  product?._id ||
                  index
                }
                className="d-flex align-items-center border-bottom py-3"
              >

                <img
                  src={
                    product?.imageUrl ||
                    "/placeholder.png"
                  }
                  alt={
                    product?.name ||
                    "Product"
                  }
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                />

                <div className="ms-3 flex-grow-1">

                  <h6>
                    {product?.name ||
                      "Product unavailable"}
                  </h6>

                  <p className="mb-0">
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                </div>

                <strong>
                  ₹
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </strong>

              </div>
            );
          }
        )}

      </div>

      {/* ADDRESS */}

      <div className="card p-4 mb-4">

        <h5>
          Shipping Address
        </h5>

        <p className="mb-1">
          <strong>
            {order.shippingAddress?.fullName}
          </strong>
        </p>

        <p className="mb-1">
          {order.shippingAddress?.addressLine}
        </p>

        <p className="mb-1">
          {order.shippingAddress?.city} -{" "}
          {order.shippingAddress?.pincode}
        </p>

        <p className="mb-0">
          Phone:{" "}
          {order.shippingAddress?.phone}
        </p>

      </div>

      {/* PAYMENT */}

      <div className="card p-4 mb-4">

        <h5>
          Payment
        </h5>

        <p>
          Method:{" "}
          <strong>
            {order.paymentMethod}
          </strong>
        </p>

        <p>
          Payment Status:{" "}
          <strong>
            {order.paymentStatus}
          </strong>
        </p>

        {order.paymentId && (
          <p className="mb-0">
            Payment ID:{" "}
            {order.paymentId}
          </p>
        )}

      </div>

      {/* TOTAL */}

      <div className="card p-4">

        <div className="d-flex justify-content-between">
          <span>
            Subtotal
          </span>

          <span>
            ₹
            {Number(
              order.subtotal
            ).toFixed(2)}
          </span>
        </div>

        <div className="d-flex justify-content-between mt-2">
          <span>
            Tax
          </span>

          <span>
            ₹
            {Number(
              order.tax
            ).toFixed(2)}
          </span>
        </div>

        <hr />

        <div className="d-flex justify-content-between fw-bold">
          <span>
            Total
          </span>

          <span>
            ₹
            {Number(
              order.totalAmount
            ).toFixed(2)}
          </span>
        </div>

        {order.status ===
          "Pending" && (
          <button
            className="btn btn-outline-danger mt-4"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling
              ? "Cancelling..."
              : "Cancel Order"}
          </button>
        )}

      </div>

    </div>
  );
};

export default OrderDetails;