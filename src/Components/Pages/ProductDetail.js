import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { myContext } from "../Context/Context";
import Breadcrumbs from "../BreadCrumbs/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import '../Css/ProductDetail.css'
import Slider from "react-slick";
import { fetchProducts, fetchExclusiveProducts } from "../Redux/ProductSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { addToCart, incrementQty, decrementQty, cart } = useContext(myContext);

  /* ===== SLIDER SETTINGS ===== */
  const getSlidesToShow = () => {
    const width = window.innerWidth;

    if (width < 576) return 2.2;
    if (width < 768) return 2;
    if (width < 992) return 3;

    return 7;
  };

  const [slidesToShow] = useState(getSlidesToShow());

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchExclusiveProducts());
  }, [dispatch]);
  const { products, exclusiveProducts } = useSelector((state) => state.products);
  const product = products.find((item) => item._id === id);

  if (!product) {
    return <h2>Loading product...</h2>;
  }




  const cartItems = cart.find((arr) => arr._id === id);

  return (
    <div className="container-fluid product-detail-container mt-2">
      <Breadcrumbs customLabel={product.name} />
      <div className="row mt-2">
        <div className="col-6">
          <div className="">
            <img
              className="mx-auto product-detail-img"
              src={product.imageUrl}
              alt={product.name}
            />
          </div>
        </div>

        <div className="col-6 mt-2 text-start">
          <h5>{product.name}</h5>
          <p className="mb-0">{product.weight}</p>
          <p className="product-detail-price">${product.price}.00</p>
          {!cartItems ? (
            <button
              className="btn btn-dark mt-2 p-1 product-detail-button "
              onClick={() => addToCart(product)}
            >
              Add To Cart
            </button>
          ) : (
            <div className="d-flex align-items-center gap-3 mt-5">
              <button
                className="btn btn-outline-dark px-3"
                onClick={() => decrementQty(product._id)}

              >
                −
              </button>

              <span className="fw-bold fs-5">{cartItems.quantity}</span>

              <button
                className="btn btn-outline-dark px-3"
                onClick={() => incrementQty(product._id)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="row mt-5">
        <div className="col col-md-8 text-start product-description">
          <h6>Description</h6>
          <p className="mt-3 text-muted">
            This product is crafted with high-quality materials to ensure long-
            lasting performance and everyday reliability. Designed with both
            comfort and style in mind, it seamlessly fits into your daily
            routine. The modern finish and attention to detail make it suitable
            for a wide range of uses, whether at home or on the go.
            <br />
            <br />
            Easy to maintain and built for durability, this item offers an
            excellent balance between functionality and aesthetics. A perfect
            choice for users who value quality, simplicity, and a clean design.
          </p>
        </div>
      </div>



      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold Product-headding">Related Products</h3>
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
{/* ================= CUSTOMER REVIEWS ================= */}
      <section className="py-5 bg-light">
        <div className="container">
          <h6 className="fw-bold text-center mb-4">What Our Customers Say</h6>

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
                  <p className="text-muted fst-italic text">“{review.text}”</p>
                  <h6 className="fw-bold mt-3 mb-0 text-1">{review.name}</h6>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </section>


    </div>


  );
};

export default ProductDetail;
