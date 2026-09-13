import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { myContext } from "../Context/Context";
import "../Css/Home.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchExclusiveProducts } from "../Redux/ProductSlice";
import video1 from "../Images/Green Yellow Financial Grocery Plan Instagram Reel Mobile Video.mp4";
import image4 from "../Images/Green Modern Grocery Delivery Instagram Post.png";
import image6 from "../Images/Yellow Green and Orange Modern Grocery Instagram Post.png";
import googlePlay from "../Images/png-transparent-google-play-store-logo-google-play-app-store-android-wallets-text-label-logo.png";
import imge from "../Images/Blue and White Simple Grocery Store Promotion Instagram Post.png";

import appStore from "../Images/download-on-the-app-store-vector-11574169009ka9slrru5l.png";
import HeroBanner from "./HeroBanner";

const Home = () => {
  const dispatch = useDispatch();

  const { products, exclusiveProducts } = useSelector(
    (state) => state.products,
  );

  const { categories, cart, addToCart, decrementQty, incrementQty } =
    useContext(myContext);

  /* ===== SLIDER SETTINGS ===== */
  const getSlidesToShow = () => {
    const width = window.innerWidth;

    if (width < 576) return 2.5;
    if (width < 768) return 2;
    if (width < 992) return 3;

    return 7;
  };
  /* ===== SLIDER SETTINGS ===== */
  const getSlidesToShow1 = () => {
    const width = window.innerWidth;

    if (width < 576) return 1;
    if (width < 768) return 2;
    if (width < 992) return 3;

    return 1;
  };

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
  const [slidesToShow1, setSlidesToShow1] = useState(getSlidesToShow1());

  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow());
      setSlidesToShow1(getSlidesToShow1());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Delivery usually takes 3–5 business days.",
    },
    {
      q: "Is Cash on Delivery available?",
      a: "Yes, COD is available on selected products.",
    },
    {
      q: "Can I return a product?",
      a: "Yes, returns are accepted within 7 days.",
    },
  ];

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchExclusiveProducts());
  }, [dispatch]);

  /* ===== FLASH SALE TIMER ===== */
  const [time, setTime] = useState(
    new Date("2026-09-07T12:00:00").getTime() - Date.now(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date("2026-09-07T12:00:00").getTime() - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = Math.max(0, Math.floor(time / 1000));

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return (
    <div className="home">
      <HeroBanner />

      {/* ================= EXCLUSIVE PRODUCT SLIDER ================= */}
      <section className="py-2">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3 className="fw-bold Product-headding">Exclusive Products</h3>

            <Link
              to="/product"
              className="btn btn-outline-dark headding-button"
            >
              View All
            </Link>
          </div>

          <Slider
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={slidesToShow}
            slidesToScroll={slidesToShow}
            swipe={true}
            draggable={true}
            touchMove={true}
          >
            {exclusiveProducts.map((arr) => {
              const cartItem = cart.find((item) => item._id === arr._id);

              const isOutOfStock = Number(arr.stock) <= 0;

              return (
                <div key={arr._id} className="card-container">
                  <div
                    className={`card ${
                      isOutOfStock ? "product-out-of-stock" : ""
                    }`}
                  >
                    {/* IMAGE */}
                    <div className="product-image-wrapper">
                      <Link to={`/product/${arr._id}`} className="img-link">
                        <img
                          src={arr.imageUrl}
                          alt={arr.name}
                          className="card-image"
                        />
                      </Link>

                      {isOutOfStock && (
                        <div className="out-of-stock-label">OUT OF STOCK</div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="card-body">
                      <h6 className="card-title text-truncate mb-1">
                        {arr.name}
                      </h6>

                      <p className="card-description text-truncate mb-0">
                        {arr.description}
                      </p>

                      <p className="quantity mb-0">{arr.weight}</p>

                      <div className="d-flex align-items-center mb-0">
                        <span className="price">
                          <div style={{ color: "green" }}>
                            {arr.oldPrice ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-2">
                                  ₹ {arr.oldPrice}
                                </span>

                                <strong className="text-danger">
                                  ₹ {arr.price}
                                </strong>
                              </>
                            ) : (
                              <strong>₹ {arr.price}</strong>
                            )}
                          </div>
                        </span>
                      </div>
                    </div>

                    {/* CART CONTROLS */}
                    <div className="mb-1 w-100 d-flex justify-content-center">
                      {isOutOfStock ? (
                        <button
                          className="btn btn-sm btn-secondary exclusive-button"
                          disabled
                        >
                          Out of Stock
                        </button>
                      ) : !cartItem ? (
                        <button
                          className="btn btn-sm btn-dark exclusive-button"
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
          </Slider>
        </div>
      </section>

      {/* ================= HERO SECTION 2 ================= */}

      <section className="p-0 mt-1">
        <div className="container">
          <Slider
            dots={false}
            infinite={true}
            speed={500}
            slidesToShow={slidesToShow1}
            slidesToScroll={1}
            autoplay={true}
            autoplaySpeed={5000}
            swipe={true}
            draggable={true}
            touchMove={true}
          >
            {/* <div>
              <img
                className="banner-img-1"
                src={image4}
                alt="Grocery Store Banner"
              />
            </div> */}

            <div>
              <img
                className="banner-img-1"
                src={image6}
                alt="Organic Food Banner"
              />
            </div>
          </Slider>
        </div>
      </section>
      {/* ================= CATEGORIES ================= */}

      <section className="py-4 bg-light">
        <div className="container">
          <h3 className="fw-bold mb-4 Product-headding">Shop by Category</h3>

          <Slider
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={slidesToShow}
            slidesToScroll={slidesToShow}
            swipe={true}
            draggable={true}
            touchMove={true}
          >
            {categories.map((cat) => (
              <div key={cat._id}>
                <div className="px-2">
                  <div className="card h-100 text-center border-0 shadow-sm category-card">
                    <div className="p-3">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        style={{
                          height: "90px",
                          objectFit: "contain",
                          width: "100%",
                        }}
                      />
                    </div>

                    <div className="card-body pt-0">
                      <h6 className="fw-semibold mb-2">{cat.name}</h6>

                      <Link
                        to={`/category/${cat._id}`}
                        className="btn btn-dark btn-sm px-3 cat-btn"
                      >
                        Browse
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* ================= FLASH SALE BANNER ================= */}

      {/* <section className="p-0 mb-4">
        <div className="container flash-banner">
          <img
            className="banner-img-4"
            src={image}
            alt="Flash Sale"
          />

          <div className="timeout">
            {String(days).padStart(2, "0")} :{" "}
            {String(hours).padStart(2, "0")} :{" "}
            {String(minutes).padStart(2, "0")} :{" "}
            {String(secs).padStart(2, "0")}
          </div>

          <div className="btn btn-dark button-hero">
            GRAB DEAL
          </div>
        </div>
      </section> */}

      {/* ================= SECOND BANNER ================= */}

      <section className="exclusive-banner">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* LEFT CONTENT */}
            <div className="col-lg-6 col-md-6">
              <div className="exclusive-content">
                <span className="exclusive-badge">LIMITED TIME OFFER</span>

                <h2>
                  Exclusive Deals
                  <br />
                  Just for You
                </h2>

                <p>
                  Grab amazing discounts on trending products. Shop your
                  favourites before these deals disappear.
                </p>

                <Link to="/offers" className="exclusive-btn">
                  Explore Deals
                  <span> →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= video ================= */}
      <section className="video-banner-section">
        {" "}
        <div className="container">
          {" "}
          <div className="video-banner-wrapper">
            {" "}
            <video className="exclusive-video" autoPlay muted loop playsInline>
              {" "}
              <source src={video1} type="video/mp4" />{" "}
            </video>{" "}
          </div>{" "}
        </div>{" "}
      </section>

      <section className="exclusive-banner">
        <div className="container-fluid">
          <div className="row align-items-center">
            {/* LEFT CONTENT */}
            <div className="col-lg-6 col-md-6">
              <div className="exclusive-content">
                <span className="exclusive-badge">Recipies</span>

                <h2>
                  Cook With Us
                  <br />
                  Just for You
                </h2>

                <p>
                  Discover delicious recipes crafted by our chefs and bring
                  fresh, flavorful meals to your kitchen.{" "}
                </p>

                <Link to="/offers" className="exclusive-btn">
                  Explore Recipies
                  <span> →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED PRODUCT SLIDER ================= */}

      <section className="py-2">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-2 mt-2">
            <h3 className="fw-bold Product-headding">Featured Products</h3>

            <Link
              to="/product"
              className="btn btn-outline-dark headding-button"
            >
              View All
            </Link>
          </div>

          <Slider
            dots={false}
            infinite={false}
            speed={500}
            slidesToShow={slidesToShow}
            slidesToScroll={slidesToShow}
            swipe={true}
            draggable={true}
            touchMove={true}
          >
            {products.map((arr) => {
              const cartItem = cart.find((item) => item._id === arr._id);

              const isOutOfStock = Number(arr.stock) <= 0;

              return (
                <div key={arr._id} className="card-container">
                  <div
                    className={`card ${
                      isOutOfStock ? "product-out-of-stock" : ""
                    }`}
                  >
                    {/* IMAGE */}
                    <div className="product-image-wrapper">
                      <Link to={`/product/${arr._id}`} className="img-link">
                        <img
                          src={arr.imageUrl}
                          alt={arr.name}
                          className="card-image"
                        />
                      </Link>

                      {isOutOfStock && (
                        <div className="out-of-stock-label">OUT OF STOCK</div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="card-body">
                      <h6 className="card-title text-truncate mb-1">
                        {arr.name}
                      </h6>

                      <p className="card-description text-truncate mb-0">
                        {arr.description}
                      </p>

                      <p className="quantity mb-0">{arr.weight}</p>

                      <div className="d-flex align-items-center mb-1">
                        <span className="price">
                          <div style={{ color: "green" }}>
                            {arr.oldPrice ? (
                              <>
                                <span className="text-muted text-decoration-line-through me-2">
                                  ₹ {arr.oldPrice}
                                </span>

                                <strong className="text-danger">
                                  ₹ {arr.price}
                                </strong>
                              </>
                            ) : (
                              <strong>₹ {arr.price}</strong>
                            )}
                          </div>
                        </span>
                      </div>
                    </div>

                    {/* CART CONTROLS */}
                    <div className="mb-1 w-100 d-flex justify-content-center">
                      {isOutOfStock ? (
                        <button
                          className="btn btn-sm btn-secondary exclusive-button"
                          disabled
                        >
                          Out of Stock
                        </button>
                      ) : !cartItem ? (
                        <button
                          className="btn btn-sm btn-dark exclusive-button"
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
          </Slider>
        </div>
      </section>

      {/* ================= APP DOWNLOAD ================= */}

      <section className="app-download-section">
        <div className="container">
          <div className="app-download-card">
            <div className="row align-items-center">
              {/* LEFT CONTENT */}
              <div className="col-lg-7">
                <div className="app-download-content">
                  <span className="app-download-tag">
                    SHOP ANYWHERE, ANYTIME
                  </span>

                  <h2>
                    Your groceries,
                    <br />
                    <span>just a tap away.</span>
                  </h2>

                  <p>
                    Download our mobile app for exclusive offers, faster
                    checkout and a smoother shopping experience.
                  </p>

                  <div className="app-download-buttons">
                    <a href="#" target="_blank" rel="noreferrer">
                      <img
                        src={googlePlay}
                        alt="Get it on Google Play"
                        className="app-store-badge"
                      />
                    </a>

                    <a href="#" target="_blank" rel="noreferrer">
                      <img
                        src={appStore}
                        alt="Download on the App Store"
                        className="app-store-badge"
                      />
                    </a>
                  </div>
                </div>
              </div>

              {/* RIGHT VISUAL */}
              <div className="col-lg-5">
                <div className="app-download-visual">
                  <div className="app-circle app-circle-one"></div>
                  <div className="app-circle app-circle-two"></div>

                  <div className="phone-shape">
                    <div className="phone-screen">
                      <span className="phone-logo">SHOP</span>

                      <div className="phone-line"></div>
                      <div className="phone-product"></div>
                      <div className="phone-product"></div>
                      <div className="phone-product"></div>
                    </div>
                  </div>

                  <div className="app-floating-card">
                    <strong>Exclusive</strong>
                    <span>App Offers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}

      <section className="py-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="p-3 bg-light text-dark rounded text-center shadow">
                <h3 className="fw-bold mb-0 news-letter-headding">
                  Get 10% Off Your First Order
                </h3>

                <p className="mb-4 news-letter-text">
                  Subscribe to our newsletter for exclusive deals and updates.
                </p>

                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <input
                    type="email"
                    className="form-control input-news-letter"
                    placeholder="Enter your email"
                  />

                  <button className="btn btn-dark news-letter-button">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CUSTOMER REVIEWS ================= */}

      <section className="customer-reviews-section">
        <div className="container">
          {/* HEADER */}
          <div className="customer-reviews-header text-center">
            <span className="customer-reviews-label">CUSTOMER REVIEWS</span>

            <h2>
              What Our Customers <span>Say</span>
            </h2>

            <p>Real experiences from customers who shop with us.</p>
          </div>

          {/* REVIEWS SLIDER */}
          <div className="customer-reviews-slider">
            <Slider
              dots={true}
              arrows={false}
              infinite={true}
              autoplay={true}
              autoplaySpeed={3500}
              speed={600}
              slidesToShow={1}
              slidesToScroll={1}
            >
              {[
                {
                  name: "Rahul Sharma",
                  text: "Amazing quality and super fast delivery. Everything arrived fresh and perfectly packed. Loved the overall shopping experience!",
                  rating: 5,
                },
                {
                  name: "Ananya Patel",
                  text: "Great prices and a very smooth checkout process. The products were exactly as shown and delivery was really quick.",
                  rating: 5,
                },
                {
                  name: "Amit Verma",
                  text: "Customer support was very helpful and responsive. The entire experience was simple and hassle-free. Will definitely shop again!",
                  rating: 5,
                },
              ].map((review, index) => (
                <div key={index} className="review-slide">
                  <div className="customer-review-card">
                    {/* QUOTE */}
                    <div className="review-quote">
                      <i className="bi bi-quote"></i>
                    </div>

                    {/* STARS */}
                    <div className="review-stars">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <i key={i} className="bi bi-star-fill"></i>
                      ))}
                    </div>

                    {/* REVIEW */}
                    <p className="review-text">“{review.text}”</p>

                    {/* CUSTOMER */}
                    <div className="review-customer">
                      <div className="review-avatar">
                        {review.name.charAt(0)}
                      </div>

                      <div className="review-customer-info">
                        <h5>{review.name}</h5>

                        <span>Verified Customer</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      {/* ================= WHY SHOP WITH US ================= */}

      <section className="why-shop-section">
        <div className="container">
          {/* HEADER */}
          <div className="why-shop-header text-center">
            <span className="why-shop-label">WHY CHOOSE US</span>

            <h2>
              Shopping Made <span>Simple</span>
            </h2>

            <p>
              Everything you need for a smooth, secure and enjoyable shopping
              experience.
            </p>
          </div>

          {/* FEATURES */}
          <div className="row g-4">
            {/* CARD 1 */}
            <div className="col-md-6 col-lg-3">
              <div className="why-shop-card">
                <div className="why-shop-top">
                  <span className="why-shop-number">01</span>

                  <div className="why-shop-icon">
                    <i className="bi bi-truck"></i>
                  </div>
                </div>

                <h4>Fast & Free Delivery</h4>

                <p>
                  Get your favorite products delivered quickly and safely right
                  to your doorstep.
                </p>

                <div className="why-shop-link">
                  <span>Learn More</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </div>

            {/* CARD 2 */}
            <div className="col-md-6 col-lg-3">
              <div className="why-shop-card">
                <div className="why-shop-top">
                  <span className="why-shop-number">02</span>

                  <div className="why-shop-icon">
                    <i className="bi bi-shield-check"></i>
                  </div>
                </div>

                <h4>Secure Shopping</h4>

                <p>
                  Shop confidently with secure payments and protected personal
                  information.
                </p>

                <div className="why-shop-link">
                  <span>Shop Securely</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </div>

            {/* CARD 3 */}
            <div className="col-md-6 col-lg-3">
              <div className="why-shop-card">
                <div className="why-shop-top">
                  <span className="why-shop-number">03</span>

                  <div className="why-shop-icon">
                    <i className="bi bi-arrow-repeat"></i>
                  </div>
                </div>

                <h4>Easy Returns</h4>

                <p>
                  Changed your mind? Enjoy a simple and hassle-free return
                  experience.
                </p>

                <div className="why-shop-link">
                  <span>View Policy</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </div>

            {/* CARD 4 */}
            <div className="col-md-6 col-lg-3">
              <div className="why-shop-card">
                <div className="why-shop-top">
                  <span className="why-shop-number">04</span>

                  <div className="why-shop-icon">
                    <i className="bi bi-star"></i>
                  </div>
                </div>

                <h4>Quality Products</h4>

                <p>
                  Discover carefully selected products that meet our high
                  quality standards.
                </p>

                <div className="why-shop-link">
                  <span>Explore Products</span>
                  <i className="bi bi-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}

      {/*
      <section className="py-5">
        <div className="container">
          <h3 className="fw-bold text-center mb-4">
            Frequently Asked Questions
          </h3>

          {faqs.map((item, index) => (
            <div key={index} className="border rounded mb-2">
              <button
                className="w-100 text-start p-3 fw-semibold bg-light border-0"
                onClick={() =>
                  setOpenIndex(
                    openIndex === index ? null : index
                  )
                }
              >
                <div className="d-flex justify-content-between">
                  {item.q}

                  <p>
                    {openIndex === index ? "−" : "+"}
                  </p>
                </div>
              </button>

              {openIndex === index && (
                <div className="p-3 border-top text-muted">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      */}
    </div>
  );
};

export default Home;
