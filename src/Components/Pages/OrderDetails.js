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
import "../Css/OrderDetails.css";

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
  const { orderId } = useParams();

  const { currentUser } = useContext(myContext);

  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // =====================================================
  // FETCH ORDER
  // =====================================================

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    fetchOrder();
  }, [currentUser, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/orders/order/${orderId}`
      );

      if (response.data.success) {
        setOrder(response.data.order);
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
  // CANCEL ORDER
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

      const response = await api.put(
        `/orders/cancel/${orderId}`
      );

      if (response.data.success) {
        setOrder(response.data.order);
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
      <div className="container order-loading">
        <div className="spinner-border text-success" />

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
          {error || "Order not found"}
        </h4>

        <button
          className="btn btn-dark mt-3"
          onClick={() => navigate("/orders")}
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
      (history) => history.status
    ) || [];

  return (
    <div className="container mt-4 mb-5 order-details-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="d-flex justify-content-between align-items-center order-page-header">

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
          onClick={() => navigate("/orders")}
        >
          Back to Orders
        </button>

      </div>


      {/* =================================================
          ORDER STATUS
      ================================================= */}

      <div className="card p-4 mb-4">

        <h5>
          Order Status
        </h5>

        <div className="order-status-list mt-4">

          {STATUS_LIST.map(
            (status, index) => {

              const completed =
                completedStatuses.includes(
                  status
                );

              const isLast =
                index ===
                STATUS_LIST.length - 1;

              return (
                <div
                  key={status}
                  className={`order-status-item ${
                    completed
                      ? "status-completed"
                      : ""
                  } ${
                    isLast
                      ? "status-last"
                      : ""
                  }`}
                >

                  {/* STATUS CIRCLE */}

                  <div
                    className={`order-status-circle ${
                      completed
                        ? "completed"
                        : "pending"
                    }`}
                  >
                    {completed
                      ? "✓"
                      : index + 1}
                  </div>


                  {/* STATUS TEXT */}

                  <div className="order-status-content">

                    <strong>
                      {status}
                    </strong>

                    {completed && (
                      <small>
                        Completed
                      </small>
                    )}

                  </div>

                </div>
              );
            }
          )}

        </div>

      </div>


      {/* =================================================
          PRODUCTS
      ================================================= */}

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
                className="order-product"
              >

                <img
                  className="order-product-image"
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

                  <h6 className="order-product-name">
                    {product?.name ||
                      "Product unavailable"}
                  </h6>

                  <p className="order-product-quantity">
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                </div>

                <strong className="order-product-price">
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


      {/* =================================================
          SHIPPING ADDRESS
      ================================================= */}

      <div className="card p-4 mb-4">

        <h5>
          Shipping Address
        </h5>

        <div className="order-address">

          <p className="mb-1">
            <strong>
              {
                order.shippingAddress
                  ?.fullName
              }
            </strong>
          </p>

          <p className="mb-1">
            {
              order.shippingAddress
                ?.addressLine
            }
          </p>

          <p className="mb-1">
            {
              order.shippingAddress?.city
            }{" "}
            -{" "}
            {
              order.shippingAddress
                ?.pincode
            }
          </p>

          <p className="mb-0">
            Phone:{" "}
            {
              order.shippingAddress
                ?.phone
            }
          </p>

        </div>

      </div>


      {/* =================================================
          PAYMENT
      ================================================= */}

      <div className="card p-4 mb-4">

        <h5>
          Payment
        </h5>

        <div className="order-payment">

          <p>
            <span>
              Method
            </span>

            <strong>
              {order.paymentMethod}
            </strong>
          </p>

          <p>
            <span>
              Payment Status
            </span>

            <strong>
              {order.paymentStatus}
            </strong>
          </p>

          {order.paymentId && (
            <p className="mb-0">
              <span>
                Payment ID
              </span>

              <strong>
                {order.paymentId}
              </strong>
            </p>
          )}

        </div>

      </div>


      {/* =================================================
          TOTAL
      ================================================= */}

      <div className="card p-4">

        <div className="order-total-row">

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


        <div className="order-total-row">

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


        <div className="order-total-final">

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


        {/* CANCEL */}

        {order.status ===
          "Pending" && (

          <button
            className="btn btn-outline-danger order-cancel-btn mt-4"
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