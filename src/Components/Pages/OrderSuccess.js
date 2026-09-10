import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const OrderSuccess = () => {
  const location =
    useLocation();

  const navigate =
    useNavigate();

  const order =
    location.state?.order;

  return (
    <div className="container mt-5">

      <div className="card shadow-sm p-5 text-center">

        <div
          style={{
            fontSize: "60px",
          }}
        >
          ✓
        </div>

        <h2 className="mt-3">
          Order Placed Successfully!
        </h2>

        {order && (
          <>
            <p className="text-muted">
              Your order ID is:
            </p>

            <h5>
              #
              {order._id
                .slice(-8)
                .toUpperCase()}
            </h5>

            <p className="mt-3">
              Total Amount:{" "}
              <strong>
                ₹
                {Number(
                  order.totalAmount
                ).toFixed(2)}
              </strong>
            </p>
          </>
        )}

        <div className="mt-4">

          <button
            className="btn btn-dark me-2"
            onClick={() =>
              navigate("/orders")
            }
          >
            View Orders
          </button>

          <button
            className="btn btn-outline-dark"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue Shopping
          </button>

        </div>

      </div>

    </div>
  );
};

export default OrderSuccess;