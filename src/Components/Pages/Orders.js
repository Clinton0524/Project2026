import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import { myContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";
import api from "../Api/Api";

import "../Css/Orders.css";

const Orders = () => {
  const {
    currentUser,
  } = useContext(myContext);

  const navigate = useNavigate();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cancelling, setCancelling] =
    useState(null);

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  useEffect(() => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/orders/${currentUser.id}`
      );

      if (response.data.success) {
        setOrders(
          response.data.orders || []
        );
      }
    } catch (error) {
      console.error(
        "Fetch orders error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

        return;
      }

      setError(
        error.response?.data?.message ||
          "Failed to load your orders"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = async (
    orderId
  ) => {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this order?"
      );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancelling(orderId);

      const response =
        await api.put(
          `/orders/cancel/${orderId}`
        );

      if (response.data.success) {
        setOrders(
          (previousOrders) =>
            previousOrders.map(
              (order) =>
                order._id === orderId
                  ? response.data.order
                  : order
            )
        );
      }
    } catch (error) {
      console.error(
        "Cancel order error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    } finally {
      setCancelling(null);
    }
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (
    status
  ) => {
    switch (status) {
      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      case "Shipped":
      case "Out for Delivery":
        return "status-shipped";

      case "Processing":
      case "Packed":
        return "status-processing";

      case "Confirmed":
        return "status-confirmed";

      default:
        return "status-pending";
    }
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!currentUser) {
    return (
      <div className="orders-page">
        <div className="orders-error">
          <h3>
            Please login
          </h3>

          <button
            onClick={() =>
              navigate("/login")
            }
            className="orders-login-btn"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">

          <div className="spinner-border" />

          <p>
            Loading your orders...
          </p>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="orders-page">

        <div className="orders-error">

          <h3>
            Unable to load orders
          </h3>

          <p>
            {error}
          </p>

          <button
            onClick={fetchOrders}
            className="orders-login-btn"
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="orders-page">

      <div className="orders-container">

        <div className="orders-header">

          <div>
            <h1>
              My Orders
            </h1>

            <p>
              Track and manage your purchases
            </p>
          </div>

          <div className="orders-count">
            {orders.length}{" "}
            {orders.length === 1
              ? "Order"
              : "Orders"}
          </div>

        </div>

        {orders.length === 0 ? (

          <div className="empty-orders">

            <div className="empty-orders-icon">
              🛒
            </div>

            <h2>
              No orders yet
            </h2>

            <p>
              You haven't placed any
              orders yet.
            </p>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Start Shopping
            </button>

          </div>

        ) : (

          <div className="orders-list">

            {orders.map((order) => (

              <div
                className="order-card"
                key={order._id}
              >

                <div className="order-card-header">

                  <div>

                    <span className="order-label">
                      ORDER ID
                    </span>

                    <strong>
                      #
                      {order._id
                        .slice(-8)
                        .toUpperCase()}
                    </strong>

                  </div>

                  <div className="order-date">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>

                </div>

                <div className="order-products">

                  {order.items.map(
                    (item, index) => {

                      const product =
                        item.productId;

                      return (
                        <div
                          className="order-product"
                          key={
                            product?._id ||
                            index
                          }
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
                          />

                          <div className="order-product-info">

                            <h4>
                              {product?.name ||
                                "Product unavailable"}
                            </h4>

                            <p>
                              Qty:{" "}
                              {item.quantity}
                            </p>

                            <span>
                              ₹
                              {Number(
                                item.price
                              ).toFixed(2)}
                            </span>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

                <div className="order-footer">

                  <div className="order-summary">

                    <div>
                      <span>
                        Payment
                      </span>

                      <strong>
                        {order.paymentMethod}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Total
                      </span>

                      <strong>
                        ₹
                        {Number(
                          order.totalAmount
                        ).toFixed(2)}
                      </strong>
                    </div>

                  </div>

                  <div className="order-status-section">

                    <span
                      className={`order-status ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                    <div className="order-actions">

                      <button
                        className="view-order-btn"
                        onClick={() =>
                          navigate(
                            `/orders/${order._id}`
                          )
                        }
                      >
                        View Details
                      </button>

                      {order.status ===
                        "Pending" && (
                        <button
                          className="cancel-order-btn"
                          disabled={
                            cancelling ===
                            order._id
                          }
                          onClick={() =>
                            handleCancel(
                              order._id
                            )
                          }
                        >
                          {cancelling ===
                          order._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}

                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Orders;