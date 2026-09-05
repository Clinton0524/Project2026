import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Css/Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./Redux/ProductSlice";
import { myContext } from "./Context/Context";

const Navbar = () => {
  const dispatch = useDispatch();

  const { currentUser, search, setSearch, cart, handleLogout, categories } =
    useContext(myContext);

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [modal, setModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;

    setSearch(value);
    setModal(value.length > 0);
  };

  const filteredData = products.filter((arr) =>
    arr.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* ================= MAIN NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg shadow-sm sticky-top py-2">
        <div className="container-fluid px-4">
          {/* LOGO */}
          <Link
            className="navbar-brand fw-bold fs-5"
            to="/home"
            onClick={() => {
              setSearch("");
              setModal(false);
              handleMenuClose();
            }}
          >
            Entavo
          </Link>

          {/* ================= MOBILE SEARCH + HAMBURGER ================= */}

          <div className="mobile-search-wrapper">
            {/* SEARCH */}
            <div className="position-relative search-container">
              <input
                value={search}
                onChange={handleChange}
                type="text"
                className="form-control ps-4 search-input"
                placeholder="Search products..."
              />

              {/* SEARCH DROPDOWN */}
              {modal && filteredData.length > 0 && (
                <div className="search-dropdown">
                  {filteredData.map((arr) => (
                    <Link
                      key={arr._id}
                      to={`/product/${arr._id}`}
                      className="text-decoration-none text-dark"
                      onClick={() => {
                        setModal(false);
                        setSearch("");
                      }}
                    >
                      <div className="d-flex align-items-center gap-3 px-3 py-2 search-item">
                        <img
                          src={arr.imageUrl}
                          alt={arr.name}
                          className="search-product-image"
                        />

                        <div>
                          <h6 className="mb-0">{arr.name}</h6>

                          <small className="text-muted">₹ {arr.price}</small>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* HAMBURGER */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              type="button"
              className="hamburger-btn"
            >
              ☰
            </button>
          </div>

          {/* ================= NAVIGATION LINKS ================= */}

          <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
            {/* CLOSE BUTTON */}
            <button
              className="mobile-menu-close"
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>

            <ul className="navbar-nav nav-scroll d-flex flex-row align-items-center gap-4">
              {/* HOME */}
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/"
                  onClick={handleMenuClose}
                >
                  Home
                </Link>
              </li>

              {/* PRODUCTS */}
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/product"
                  onClick={handleMenuClose}
                >
                  Products
                </Link>
              </li>

              {/* ABOUT */}
              <li className="nav-item">
                <Link
                  className="nav-link fw-semibold"
                  to="/home"
                  onClick={handleMenuClose}
                >
                  About
                </Link>
              </li>

              {/* CART */}
              <li className="nav-item position-relative">
                <Link
                  className="nav-link fw-semibold"
                  to="/cart"
                  onClick={handleMenuClose}
                >
                  Cart
                  {cart.length > 0 && (
                    <span className="badge bg-dark ms-1">{cart.length}</span>
                  )}
                </Link>
              </li>

              {/* AUTH */}
              {currentUser ? (
                <>
                  {/* USER */}
                  <li className="nav-item user-name">
                    <span className="text-muted">
                      Hi, <strong>{currentUser.displayName}</strong>
                    </span>
                  </li>

                  {/* LOGOUT */}
                  <li className="nav-item">
                    <button
                      className="btn btn-sm btn-outline-dark  px-3"
                      onClick={() => {
                        handleLogout();
                        handleMenuClose();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                /* LOGIN */
                <li className="nav-item">
                  <Link
                    className="btn btn-dark btn-sm  px-3"
                    to="/login"
                    onClick={handleMenuClose}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* ================= SECOND CATEGORY NAVBAR ================= */}

      <div className="category-navbar">
        <div className="container-fluid px-4">
          {/* CATEGORY HORIZONTAL SCROLL */}
          <ul className="category-list">
            {/* CATEGORIES BUTTON */}
            <li className="category-dropdown">
              <button
                type="button"
                className="category-dropdown-btn"
                onClick={() => setCategoryOpen(!categoryOpen)}
              >
                Categories {categoryOpen ? "▴" : "▾"}
              </button>
            </li>

            {/* ALL PRODUCTS */}
            <li>
              <Link to="/product">All Products</Link>
            </li>

            {/* MEN */}
            <li>
              <Link to="/product?category=men">Men</Link>
            </li>

            {/* WOMEN */}
            <li>
              <Link to="/product?category=women">Women</Link>
            </li>

            {/* ELECTRONICS */}
            <li>
              <Link to="/product?category=electronics">Electronics</Link>
            </li>

            {/* SHOES */}
            <li>
              <Link to="/product?category=shoes">Shoes</Link>
            </li>

            {/* ACCESSORIES */}
            <li>
              <Link to="/product?category=accessories">Accessories</Link>
            </li>

            {/* OFFERS */}
            <li>
              <Link to="/offers">🔥 Offers</Link>
            </li>
          </ul>

          {/* ================= CATEGORY DROPDOWN ================= */}

          {categoryOpen && (
            <div className="category-dropdown-menu category-show">
              {categories.map((arr) => (
                <div key={arr._id}>
                  <Link
                    onClick={() => setCategoryOpen(false)}
                    to={`/category/${arr._id}`}
                  >
                    {" "}
                    <p>{arr.name}</p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
