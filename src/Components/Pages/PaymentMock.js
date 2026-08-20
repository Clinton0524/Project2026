import React, { useContext } from "react";
import { myContext } from "../Context/Context";
import { useNavigate } from "react-router-dom";

const PaymentMock = () => {
  const { setCart } = useContext(myContext);
  const navigate = useNavigate();

  const handleFakePayment = () => {
    // simulate payment success
    setTimeout(() => {
      setCart([]);
      navigate("/orderSuccess");
    }, 1000);
  };

  return (
    <div className="container mt-5 text-center">
      <h4>Mock Payment</h4>
      <p>This is a test payment (no real money)</p>

      <button className="btn btn-success" onClick={handleFakePayment}>
        Pay Now (Test)
      </button>
    </div>
  );
};

export default PaymentMock;
