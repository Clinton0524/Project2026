
import { useContext, useEffect, useState } from "react";
import { myContext } from "../Context/Context";
import api from "../Api/Api";
import "../Css/Offers.css"

const Offers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    cart,
    addToCart,
    incrementQty,
    decrementQty,
  } = useContext(myContext);

  // =========================
  // FETCH OFFER PRODUCTS
  // =========================
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);

        const response = await api.get("/products/offers");

        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // =========================
  // DISCOUNT PERCENTAGE
  // =========================
  const getDiscount = (oldPrice, price) => {
    if (!oldPrice || !price) return 0;

    return Math.round(((oldPrice - price) / oldPrice) * 100);
  };

  return (
    <div className="offers-page">

      {/* =========================
          OFFER HERO
      ========================= */}
      <section className="offers-hero">
        <div className="offers-hero-content">
          <span className="offers-small-text">
            LIMITED TIME DEALS
          </span>

          <h1>
            Special <span>Offers</span>
          </h1>

          <p>
            Grab your favourite products at amazing prices.
            Don't miss these limited-time deals!
          </p>

          <div className="offer-hero-badge">
            <i className="bi bi-tag-fill"></i>
            Best Deals • Best Prices
          </div>
        </div>

        <div className="offers-hero-shape shape-one"></div>
        <div className="offers-hero-shape shape-two"></div>
      </section>

      {/* =========================
          OFFER HEADER
      ========================= */}
      <div className="container">

        <div className="offers-heading-row">
          <div>
            <h2>
              Today's <span>Best Deals</span>
            </h2>

            <p>
              {products.length > 0
                ? `${products.length} products available on offer`
                : "Exclusive deals just for you"}
            </p>
          </div>

          <div className="offers-icon-box">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>
        </div>

        {/* =========================
            LOADING
        ========================= */}
        {loading && (
          <div className="offers-loading">
            <div className="spinner-border text-danger"></div>
            <p>Loading amazing offers...</p>
          </div>
        )}

        {/* =========================
            EMPTY OFFERS
        ========================= */}
        {!loading && products.length === 0 && (
          <div className="no-offers">
            <div className="no-offers-icon">
              <i className="bi bi-tag"></i>
            </div>

            <h3>No Offers Available</h3>

            <p>
              There are no special offers available right now.
              Please check again later!
            </p>
          </div>
        )}

        {/* =========================
            OFFER PRODUCTS
        ========================= */}
        {!loading && products.length > 0 && (
          <div className="row g-3 pb-5">

            {products.map((product) => {
              const cartItem = cart.find(
                (item) => item._id === product._id
              );

              const discount = getDiscount(
                product.oldPrice,
                product.price
              );

              return (
                <div
                  className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2"
                  key={product._id}
                >
                  <div className="offer-card">

                    {/* DISCOUNT BADGE */}
                    <div className="discount-badge">
                      {discount}% OFF
                    </div>

                    {/* LIMITED OFFER */}
                    <div className="limited-badge">
                      <i className="bi bi-lightning-fill"></i>
                      DEAL
                    </div>

                    {/* IMAGE */}
                    <div className="offer-image-wrapper">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="offer-product-image"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="offer-card-body">

                      <h5 className="offer-product-name">
                        {product.name}
                      </h5>

                      {product.weight && (
                        <span className="offer-weight">
                          {product.weight}
                        </span>
                      )}

                      <p className="offer-description">
                        {product.description}
                      </p>

                      {/* PRICE */}
                      <div className="offer-price-section">

                        <span className="offer-old-price">
                          ₹ {Number(product.oldPrice).toFixed(2)}
                        </span>

                        <span className="offer-current-price">
                          ₹ {Number(product.price).toFixed(2)}
                        </span>

                      </div>

                      {/* SAVING */}
                      <div className="saving-text">
                        <i className="bi bi-check-circle-fill"></i>
                        You save ₹{" "}
                        {(
                          Number(product.oldPrice) -
                          Number(product.price)
                        ).toFixed(2)}
                      </div>

                      {/* CART */}
                      <div className="offer-cart-section">

                        {!cartItem ? (
                          <button
                            className="offer-add-btn"
                            onClick={() => addToCart(product)}
                          >
                            <i className="bi bi-cart-plus"></i>
                            Add to Cart
                          </button>
                        ) : (
                          <div className="offer-quantity">

                            <button
                              onClick={() =>
                                decrementQty(product._id)
                              }
                            >
                              −
                            </button>

                            <span>
                              {cartItem.quantity}
                            </span>

                            <button
                              onClick={() =>
                                incrementQty(product._id)
                              }
                            >
                              +
                            </button>

                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default Offers;

