import { useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { myContext } from "../Context/Context";
import Breadcrumbs from "../BreadCrumbs/Breadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Redux/ProductSlice";
const ProductDetail = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { addToCart, incrementQty, decrementQty, cart } = useContext(myContext);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  const { products } = useSelector((state) => state.products);
  const product = products.find((item) => item._id === id);

  if (!product) {
    return <h2>Loading product...</h2>;
  }

  const cartItems = cart.find((arr) => arr._id === id);
  return (
    <div className="container mt-5">
      <Breadcrumbs customLabel={product.name} />
      <div className="row">
        <div className="col-4">
          <div className="card">
            <img
              className="mx-auto"
              style={{ width: "300px" }}
              src={product.imageUrl}
              alt={product.name}
            />
          </div>
        </div>

        <div className="col-8 text-start">
          <h5>{product.name}</h5>
          <h3 className="mt-5">${product.price}.00</h3>
          {!cartItems ? (
            <button
              className="btn btn-dark w-50 mt-5"
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
        <div className="col col-md-8 text-start">
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

        <div className="col col-md-4 text-end">
          <h6>Details</h6>
          <p className="mt-3 text-muted">
            Premium build quality
            <br />
            Modern minimalist design
            <br />
            Durable & easy to maintain
            <br />
            Suitable for everyday use
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
