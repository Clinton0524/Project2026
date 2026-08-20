import { useContext, useMemo, useState, useEffect } from "react";
import { fetchProducts } from "../Redux/ProductSlice";

import { myContext } from "../Context/Context";
import Breadcrumbs from "../BreadCrumbs/Breadcrumbs";
import "../Css/Products.css";
import { useDispatch, useSelector } from "react-redux";
const Products = () => {
  const [maxPrice, setMaxPrice] = useState(1000);
  const [activeCategory, setActiveCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const itemsPerPage = 24;
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const {
    sort,
    setSort,
    cart,
    categories,
    under50,
    setUnder50,
    under100,
    setUnder100,
    under150,
    setUnder150,
    addToCart,
    incrementQty,
    decrementQty,
  } = useContext(myContext);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // FILTER AND SORTING
  const filteredData = useMemo(() => {
    const result = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // CATEGORY FILTER
      if (
        activeCategory.length > 0 &&
        !activeCategory.includes(product.category?.name)
      ) {
        continue;
      }

      // PRICE FILTER
      if (
        (under50 && product.price < 50) ||
        (under100 && product.price < 100) ||
        (under150 && product.price < 150) ||
        (!under50 && !under100 && !under150 && product.price <= maxPrice)
      ) {
        result.push(product);
      }
    }

    // SORT BY PRICE AND ALPHABET
    return result.sort((a, b) => {
      if (sort === "asc") return a.name.localeCompare(b.name);
      if (sort === "desc") return b.name.localeCompare(a.name);
      if (sort === "h-l") return b.price - a.price;
      if (sort === "l-h") return a.price - b.price;
      return 0;
    });
  }, [products, sort, maxPrice, under50, under100, under150, activeCategory]);

  const handleSortToggle = (value) => {
    setSort((prev) => (prev === value ? "" : value));
  };
  const handleSlider = (value) => {
    setMaxPrice(value);
    setUnder50(false);
    setUnder100(false);
    setUnder150(false);
  };
  // Function to toggle category
  const toggleCategory = (categoryName) => {
    setActiveCategory(
      (prev) =>
        prev.includes(categoryName)
          ? prev.filter((c) => c !== categoryName) // remove
          : [...prev, categoryName] // add
    );
  };

  //PAGINATION
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-2 mb-3 desktop-filters">
          <h6 className="text-start">Sort</h6>

          <div className="form-check text-start">
            <input
              className="form-check-input"
              type="radio"
              checked={sort === "asc"}
              onClick={() => handleSortToggle("asc")}
            />
            <label className="form-check-label">A – Z</label>
          </div>

          <div className="form-check text-start">
            <input
              className="form-check-input"
              type="radio"
              checked={sort === "desc"}
              onClick={() => handleSortToggle("desc")}
            />
            <label className="form-check-label">Z – A</label>
          </div>

          <div className="form-check text-start">
            <input
              className="form-check-input"
              type="radio"
              checked={sort === "h-l"}
              onClick={() => handleSortToggle("h-l")}
            />
            <label className="form-check-label">High → Low</label>
          </div>

          <div className="form-check text-start">
            <input
              className="form-check-input"
              type="radio"
              checked={sort === "l-h"}
              onClick={() => handleSortToggle("l-h")}
            />
            <label className="form-check-label">Low → High</label>
          </div>

          {/* Price Slider */}

          <div className="mt-3 text-start">
            <h6>Filter</h6>
            <label>Max Price: ₹{maxPrice}</label>
            <input
              type="range"
              min="0"
              max="1000"
              value={maxPrice}
              onChange={(e) => handleSlider(Number(e.target.value))}
              className="form-range dark-range"
            />
          </div>

          <div className="form-check text-start">
            <input
              className="form-check-input"
              type="radio"
              checked={under50}
              onClick={() => setUnder50(!under50)}
            />
            <label className="form-check-label">less than ₹50</label>
          </div>

          <div className="form-check text-start">
            <input
              className="form-check-input"
              type="radio"
              checked={under100}
              onClick={() => setUnder100(!under100)}
            />
            <label className="form-check-label">less than ₹100</label>
          </div>

          <div className="form-check text-start">
            <input
              className="form-check-input"
              type="radio"
              checked={under150}
              onClick={() => setUnder150(!under150)}
            />
            <label className="form-check-label">less than ₹150</label>
          </div>

          <h6 className="mt-3 text-start">Categories</h6>
          {categories.map((cat) => (
            <div className="form-check text-start" key={cat._id}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={activeCategory.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
              />
              <label className="form-check-label">{cat.name}</label>
            </div>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="col-md-10">
          <div className="d-flex">
            <Breadcrumbs />{" "}
            <div className="d-md-none mb-3 ms-auto">
              <button
                className="filter-icon-btn "
                onClick={() => setFilterOpen(true)}
                aria-label="Open filters"
              >
                <i className="bi bi-funnel"></i>
              </button>
            </div>
          </div>

          <div className="row g-2">
            {currentData.map((arr) => {
              const cartItem = cart.find((item) => item._id === arr._id);

              return (
                <div
                  className="col-6 col-sm-4 col-md-3 col-lg-2 mb-2"
                  key={arr._id}
                >
                  <div className="card p-2 h-100 d-flex flex-column align-items-center text-center shadow-sm">
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
          {/* PAGINATION */}
          <div className="d-flex justify-content-center mt-3 mb-5">
            <div className="btn-group align-items-center">
              <button
                className="btn btn-dark"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>

              <span className="mx-3 fw-bold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                className="btn btn-dark"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
          {filterOpen && (
            <div className="filter-modal-overlay">
              <div className="filter-modal">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Filters</h5>

                  <button
                    className="btn-close"
                    onClick={() => setFilterOpen(false)}
                  ></button>
                </div>

                {/* SORT */}
                <h6 className="text-start">Sort</h6>

                <div className="form-check text-start">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={sort === "asc"}
                    onClick={() => handleSortToggle("asc")}
                  />
                  <label className="form-check-label">A – Z</label>
                </div>

                <div className="form-check text-start">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={sort === "desc"}
                    onClick={() => handleSortToggle("desc")}
                  />
                  <label className="form-check-label">Z – A</label>
                </div>

                <div className="form-check text-start">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={sort === "h-l"}
                    onClick={() => handleSortToggle("h-l")}
                  />
                  <label className="form-check-label">High → Low</label>
                </div>

                <div className="form-check text-start">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={sort === "l-h"}
                    onClick={() => handleSortToggle("l-h")}
                  />
                  <label className="form-check-label">Low → High</label>
                </div>

                {/* PRICE */}
                <div className="mt-3 text-start">
                  <h6>Filter</h6>

                  <label>Max Price: ₹{maxPrice}</label>

                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={maxPrice}
                    onChange={(e) => handleSlider(Number(e.target.value))}
                    className="form-range dark-range"
                  />
                </div>

                <div className="form-check text-start">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={under50}
                    onClick={() => setUnder50(!under50)}
                  />
                  <label className="form-check-label">less than ₹50</label>
                </div>

                <div className="form-check text-start">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={under100}
                    onClick={() => setUnder100(!under100)}
                  />
                  <label className="form-check-label">less than ₹100</label>
                </div>

                <div className="form-check text-start">
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={under150}
                    onClick={() => setUnder150(!under150)}
                  />
                  <label className="form-check-label">less than ₹150</label>
                </div>

                {/* CATEGORIES */}
                <h6 className="mt-3 text-start">Categories</h6>

                {categories.map((cat) => (
                  <div className="form-check text-start" key={cat._id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={activeCategory.includes(cat.name)}
                      onChange={() => toggleCategory(cat.name)}
                    />

                    <label className="form-check-label">{cat.name}</label>
                  </div>
                ))}

                <button
                  className="btn btn-dark w-100 mt-4"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
