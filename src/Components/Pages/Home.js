import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { myContext } from "../Context/Context";
import "../Css/Home.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchExclusiveProducts } from "../Redux/ProductSlice";
import image from '../Images/Red Orange Modern Flash Sale Facebok Post.png'
import image1 from '../Images/Orange Green and White Modern Grocery Store Opening Banner.png'
import googlePlay from "../Images/png-transparent-google-play-store-logo-google-play-app-store-android-wallets-text-label-logo.png";
import appStore from "../Images/download-on-the-app-store-vector-11574169009ka9slrru5l.png";
const Home = () => {
  const dispatch = useDispatch();

  const { products, exclusiveProducts } = useSelector(
    (state) => state.products
  );

  const { categories, cart, addToCart, decrementQty, incrementQty } =
    useContext(myContext);

  /* ===== SLIDER SETTINGS ===== */
  const getSlidesToShow = () => {
    const width = window.innerWidth;

    if (width < 576) return 2.2;
    if (width < 768) return 2;
    if (width < 992) return 3;

    return 7;
  };

  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow());
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

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

  const [time, setTime] = useState(
    new Date("2026-09-07T12:00:00").getTime() - Date.now()
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
      {/* ================= HERO SECTION ================= */}
      <section className=" p-0 mt-1">
        <div className="container-fluid flash-banner">
          {/* <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="fw-bold mb-3">
                Shop Smart. <br /> Live Better.
              </h1>
              <p className=" mb-4">
                Discover quality products at the best prices. Fast delivery,
                secure payments, and easy returns.
              </p>

              
            </div> */}

          {/* <div className="col-md-6 text-center">
              <img
                src="https://via.placeholder.com/450x300"
                alt="Shopping"
                className="img-fluid rounded"
              />
            </div> */}
          {/* </div> */}
          <img className="banner-img"
            src={image1}
          />
          {/* <Link to="/products" className="btn btn-dark banner-btn px-4">
                Shop Now
              </Link> */}
        </div>
      </section>




      {/* ================= EXCLUSIVE PRODUCT SLIDER ================= */}
      <section className="py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold Product-headding">Exclusive Products</h3>
            <Link to="/product" className="btn btn-outline-dark headding-button">
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

              return (
                <div key={arr._id} className="px-2">
                  <div className="card">
                    {/* IMAGE */}
                    <Link to={`/product/${arr._id}`} className="img-link">
                      <img
                        src={arr.imageUrl}
                        alt={arr.name}
                        className="card-image"
                      />
                    </Link>
                    {/* DETAILS */}
                    <div className="card-body">
                      <h6 className="card-title mb-1">{arr.name}</h6>
                      <p className="card-description text-truncate mb-0">
                        {arr.description}
                      </p>
                      <p className="quantity mb-0">{arr.weight}</p>
                      <div className="d-flex align-items-center mb-1 ">
                        <span className="price">
                          <strong style={{ color: "green" }}>
                            ₹ {arr.price}
                          </strong>
                        </span>
                        <span className="price">
                          <strong
                            className="old-price"
                            style={{
                              color: "red",
                              textDecoration: "line-through",
                            }}
                          >
                            {arr.oldprice}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* CART CONTROLS */}
                    <div className="mb-1 w-100 d-flex justify-content-center">
                      {!cartItem ? (
                        <button
                          className="btn btn-sm btn-dark exclusive-button "
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
      <section className=" p-0 mb-4">
        <div className="container-fluid flash-banner">
          <img className="banner-img"
            src={image}
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
                {/* GAP WRAPPER */}
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

      {/* ================= SECOND BANNER ================= */}
      <section className="bg-light py-4">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-7">
              {/* <img
                src="https://via.placeholder.com/450x300"
                alt="Deals"
                className="img-fluid rounded"
              /> */}
            </div>

            <div className="col-md-5">
              <h2 className="fw-bold mb-3">Exclusive Deals Just for You</h2>
              <p className="text-muted mb-4">
                Grab limited-time offers on trending products before they’re
                gone.
              </p>

              <Link to="/products" className="btn btn-dark px-4">
                Explore Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT SLIDER ================= */}
      <section className="py-4">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold Product-headding">Featured Products</h3>
            <Link to="/product" className="btn btn-outline-dark headding-button">
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

              return (
                <div key={arr._id} className="px-2">
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
                      <h6
                        className="card-title mb-1"
                        style={{ height: "20px" }}
                      >
                        {arr.name}
                      </h6>

                      <p className="card-text text-truncate mb-1">
                        {arr.description}
                      </p>

                      <strong className="mb-2">₹ {arr.price}</strong>
                    </div>

                    {/* CART CONTROLS */}
                    <div className="mb-1 w-100">
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
          </Slider>
        </div>
      </section>


      {/* ================= NEWSLETTER ================= */}
      <section className="py-2">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="p-3 bg-dark text-light rounded text-center shadow">
                <h3 className="fw-bold mb-0 news-letter-headding">Get 10% Off Your First Order</h3>
                <p className=" mb-4 news-letter-text">
                  Subscribe to our newsletter for exclusive deals and updates Subscribe now!.
                </p>

                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <input
                    type="email"
                    className="form-control w-100 input-news-letter"
                    placeholder="Enter your email"
                  />
                  <button className="btn btn-light news-letter-button">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= APP PROMO ================= */}
      <section className="py-5 bg-light text-dark">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="fw-bold mb-2">Shop Faster on Our Mobile App</h3>
              <p className="text-muted">
                Get exclusive app-only offers and faster checkout.
              </p>
            </div>

       <div className="col-md-4 justify-content-center d-flex gap-3">
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
      </section>
{/* Why Shop With Us Section */}
<section className="why-shop-section py-5">
  <div className="container">

    <div className="text-center mb-5">
      <span className="text-danger fw-semibold">WHY CHOOSE US</span>
      <h2 className="fw-bold mt-2">Shopping Made Simple</h2>
      <p className="text-muted">
        Everything you need for a smooth and enjoyable shopping experience.
      </p>
    </div>

    <div className="row g-3">

      {/* Card 1 */}
      <div className="col-md-6 col-lg-3">
        <div className="service-card text-center h-100">
          <div className="service-icon">
            <i className="bi bi-truck"></i>
          </div>

          <h5 className="fw-bold mt-4">Fast & Free Delivery</h5>

          <p className="text-muted">
            Get your favorite products delivered quickly and safely to your
            doorstep.
          </p>

          <div className="btn btn-dark">
          Learn More
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="col-md-6 col-lg-3">
        <div className="service-card text-center h-100">
          <div className="service-icon">
            <i className="bi bi-shield-check"></i>
          </div>

          <h5 className="fw-bold mt-4">Secure Shopping</h5>

          <p className="text-muted">
            Your personal information and payments are protected with secure
            technology.
          </p>

          <div className="btn btn-dark">
           Shop Securly
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="col-md-6 col-lg-3">
        <div className="service-card text-center h-100">
          <div className="service-icon">
            <i className="bi bi-arrow-repeat"></i>
          </div>

          <h5 className="fw-bold mt-4">Easy Returns</h5>

          <p className="text-muted">
            Changed your mind? Enjoy a simple and hassle-free return process.
          </p>

         <div className="btn btn-dark">
           View Policy
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className="col-md-6 col-lg-3">
        <div className="service-card text-center h-100">
          <div className="service-icon">
            <i className="bi bi-star"></i>
          </div>

          <h5 className="fw-bold mt-4">Quality Products</h5>

          <p className="text-muted">
            Discover carefully selected products that meet our quality
            standards.
          </p>

          <div className="btn btn-dark">
            Explore Products
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
      {/* ================= CUSTOMER REVIEWS ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h3 className="fw-bold text-center mb-4">What Our Customers Say</h3>

          <Slider
            dots={true}
            arrows={false}
            infinite={true}
            autoplay={true}
            autoplaySpeed={3000}
            slidesToShow={1}
            responsive={[{ breakpoint: 768, settings: { slidesToShow: 1 } }]}
          >
            {[
              {
                name: "Rahul Sharma",
                text: "Amazing quality and super fast delivery. Loved the experience!",
              },
              {
                name: "Ananya Patel",
                text: "Great prices and smooth checkout. Highly recommended.",
              },
              {
                name: "Amit Verma",
                text: "Customer support was very helpful. Will shop again!",
              },
            ].map((review, index) => (
              <div key={index} className="px-3">
                <div className="p-4 bg-white shadow-sm rounded text-center h-100">
                  <p className="text-muted fst-italic text-1">“{review.text}”</p>
                  <h6 className="fw-bold mt-3 mb-0 text-2">{review.name}</h6>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>




      {/* <section className="py-5">
        <div className="container">
          <h3 className="fw-bold text-center mb-4">
            Frequently Asked Questions
          </h3>

          {faqs.map((item, index) => (
            <div key={index} className="border rounded mb-2">
              
              <button
                className="w-100 text-start p-3 fw-semibold bg-light border-0"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <div className="d-flex justify-content-between">
                  {item.q}
                  <p>{openIndex === index ? "−" : "+"}</p>
                </div>
              </button>

             
              {openIndex === index && (
                <div className="p-3 border-top text-muted">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default Home;
