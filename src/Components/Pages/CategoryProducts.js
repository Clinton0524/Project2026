import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/ProductSlice";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import { myContext } from "../Context/Context";

const CategoryProducts = () => {
  const { catid } = useParams();
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { cart, addToCart, incrementQty, decrementQty } = useContext(myContext);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categoryProducts = products.filter(
    (arr) => arr.category?._id === catid
  );

  return (
    <div className="container mt-4">
      <div className="row g-2">
        {categoryProducts.length === 0 && (
          <p className="text-center mt-5 fw-semibold">
            No products found in this category
          </p>
        )}

        {categoryProducts.map((arr) => {
          const cartItem = cart.find((item) => item._id === arr._id);

          return (
            <div
              className="col-6 col-sm-4 col-md-3 col-lg-2 mb-2"
              key={arr._id}
            >
              <div className="card p-2 h-100 d-flex flex-column align-items-center text-center shadow-sm">
                {/* IMAGE */}
                <img
                  src={arr.imageUrl}
                  alt={arr.name}
                  className="card-img-top"
                  style={{
                    height: "120px",
                    objectFit: "contain",
                    width: "100%",
                  }}
                />

                {/* DETAILS */}
                <div className="card-body p-2 d-flex flex-column w-100 text-start">
                  <h6 className="card-title mb-1">{arr.name}</h6>

                  <p className="card-text text-truncate mb-1">
                    {arr.description}
                  </p>

                  <strong className="mb-2">₹ {arr.price}</strong>
                </div>

                {/* CART CONTROLS */}
                <div className="mb-2 w-100">
                  {!cartItem ? (
                    <button
                      className="btn btn-sm btn-dark w-100"
                      onClick={() => addToCart(arr)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => decrementQty(arr._id)}
                      >
                        -
                      </button>

                      <span className="fw-bold">{cartItem.quantity}</span>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => incrementQty(arr._id)}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryProducts;
