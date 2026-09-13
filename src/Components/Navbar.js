import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Css/Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./Redux/ProductSlice";
import { myContext } from "./Context/Context";
import Image from "../Components/Images/Pink and Blue Playful Kids Clothing Store Logo.png";

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
            to="/"
            onClick={() => {
              setSearch("");
              setModal(false);
              handleMenuClose();
            }}
          >
            <img className="logo-img" src={Image} />
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

       {/* ================= DESKTOP NAVIGATION ================= */}

<div className="desktop-menu">

  {/* HOME */}
  <Link
    className="desktop-nav-link"
    to="/"
  >
    Home
  </Link>

  {/* PRODUCTS */}
  <Link
    className="desktop-nav-link"
    to="/product"
  >
    Products
  </Link>

  {/* ORDERS */}
  <Link
    className="desktop-nav-link"
    to="/orders"
  >
    Orders
  </Link>

  {/* CART */}
  <Link
    className="desktop-nav-link"
    to="/cart"
  >
    Cart

    {cart.length > 0 && (
      <span className="badge bg-dark ms-1">
        {cart.length}
      </span>
    )}
  </Link>

  {/* AUTH */}
  {currentUser ? (
    <>
      <span className="desktop-user-name">
        Hi, <strong>{currentUser.name}</strong>
      </span>

      <button
        className="btn btn-sm btn-outline-dark px-3"
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  ) : (
    <Link
      className="btn btn-dark btn-sm px-3"
      to="/login"
    >
      Login
    </Link>
  )}

</div>


{/* ================= MOBILE SIDE MENU ================= */}

<div className={`mobile-menu ${menuOpen ? "show" : ""}`}>

  {/* HEADER */}
  <div className="mobile-menu-header">

    <div className="mobile-menu-brand">

      <img
        src={Image}
        alt="Logo"
      />

      <div>

        <h5>Welcome</h5>

        {currentUser ? (
          <p>{currentUser.name}</p>
        ) : (
          <p>Shop with us</p>
        )}

      </div>

    </div>

    <button
      className="mobile-menu-close"
      onClick={() => setMenuOpen(false)}
      type="button"
    >
      ✕
    </button>

  </div>


  {/* USER SECTION */}

  {currentUser ? (

    <div className="mobile-user-card">

      <div className="mobile-user-icon">
        👤
      </div>

      <div className="mobile-user-info">

        <span>Hello,</span>

        <strong>
          {currentUser.name}
        </strong>

      </div>

    </div>

  ) : (

    <Link
      to="/login"
      className="mobile-login-card"
      onClick={handleMenuClose}
    >

      <div className="mobile-user-icon">
        👤
      </div>

      <div>

        <strong>
          Login / Register
        </strong>

        <span>
          Access your account
        </span>

      </div>

      <span className="mobile-arrow">
        ›
      </span>

    </Link>

  )}


  {/* MENU TITLE */}

  <div className="mobile-menu-title">
    <span>SHOP & EXPLORE</span>
  </div>


  {/* MAIN LINKS */}

  <ul className="nav-scroll">

    {/* HOME */}

    <li className="nav-item">

      <Link
        className="mobile-menu-link"
        to="/"
        onClick={handleMenuClose}
      >

        <span className="mobile-menu-icon">
          🏠
        </span>

        <span className="mobile-menu-text">

          <strong>
            Home
          </strong>

          <small>
            Discover our products
          </small>

        </span>

        <span className="mobile-arrow">
          ›
        </span>

      </Link>

    </li>


    {/* PRODUCTS */}

    <li className="nav-item">

      <Link
        className="mobile-menu-link"
        to="/product"
        onClick={handleMenuClose}
      >

        <span className="mobile-menu-icon">
          🛍️
        </span>

        <span className="mobile-menu-text">

          <strong>
            All Products
          </strong>

          <small>
            Browse our collection
          </small>

        </span>

        <span className="mobile-arrow">
          ›
        </span>

      </Link>

    </li>


    {/* CATEGORIES */}

    <li className="nav-item">

      <button
        type="button"
        className="mobile-menu-link mobile-menu-button"
        onClick={() => {

          setCategoryOpen(true);
          setMenuOpen(false);

        }}
      >

        <span className="mobile-menu-icon">
          📂
        </span>

        <span className="mobile-menu-text">

          <strong>
            Categories
          </strong>

          <small>
            Shop by category
          </small>

        </span>

        <span className="mobile-arrow">
          ›
        </span>

      </button>

    </li>


    {/* OFFERS */}

    <li className="nav-item">

      <Link
        className="mobile-menu-link offer-menu-link"
        to="/offers"
        onClick={handleMenuClose}
      >

        <span className="mobile-menu-icon">
          🔥
        </span>

        <span className="mobile-menu-text">

          <strong>
            Special Offers
          </strong>

          <small>
            Grab the latest deals
          </small>

        </span>

        <span className="mobile-offer-badge">
          HOT
        </span>

      </Link>

    </li>


    {/* ORDERS */}

    <li className="nav-item">

      <Link
        className="mobile-menu-link"
        to="/orders"
        onClick={handleMenuClose}
      >

        <span className="mobile-menu-icon">
          📦
        </span>

        <span className="mobile-menu-text">

          <strong>
            My Orders
          </strong>

          <small>
            Track your orders
          </small>

        </span>

        <span className="mobile-arrow">
          ›
        </span>

      </Link>

    </li>


    {/* CART */}

    <li className="nav-item">

      <Link
        className="mobile-menu-link"
        to="/cart"
        onClick={handleMenuClose}
      >

        <span className="mobile-menu-icon">
          🛒
        </span>

        <span className="mobile-menu-text">

          <strong>
            My Cart
          </strong>

          <small>

            {cart.length > 0
              ? `${cart.length} item${cart.length > 1 ? "s" : ""} in cart`
              : "Your cart is empty"}

          </small>

        </span>

        {cart.length > 0 && (

          <span className="mobile-cart-count">
            {cart.length}
          </span>

        )}

      </Link>

    </li>

  </ul>


  {/* ACCOUNT */}

  <div className="mobile-menu-divider"></div>

  <div className="mobile-menu-title">
    <span>ACCOUNT</span>
  </div>

  <div className="mobile-account-section">

    {currentUser ? (

      <button
        type="button"
        className="mobile-account-action logout-action"
        onClick={() => {

          handleLogout();
          handleMenuClose();

        }}
      >

        <span>
          🚪
        </span>

        <strong>
          Logout
        </strong>

      </button>

    ) : (

      <Link
        to="/login"
        className="mobile-account-action"
        onClick={handleMenuClose}
      >

        <span>
          🔐
        </span>

        <strong>
          Login
        </strong>

      </Link>

    )}

  </div>


  {/* BOTTOM */}

  <div className="mobile-menu-bottom">

    <div className="mobile-bottom-icon">
      🛒
    </div>

    <div>

      <strong>
        Happy Shopping!
      </strong>

      <span>
        Find something you love today.
      </span>

    </div>

  </div>

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

            {/* MEN */}
            <li>
              <Link to="/">Home</Link>
            </li>
            {/* ALL PRODUCTS */}
            <li>
              <Link to="/product">All Products</Link>
            </li>

            {/* WOMEN */}
            {/* <li>
              <Link to="/product?category=women">Women</Link>
            </li> */}

            {/* ELECTRONICS */}
            {/* <li>
              <Link to="/product?category=electronics">Electronics</Link>
            </li> */}

            {/* SHOES */}
            {/* <li>
              <Link to="/product?category=shoes">Shoes</Link>
            </li> */}

            {/* ACCESSORIES */}
            {/* <li>
              <Link to="/product?category=accessories">Accessories</Link>
            </li> */}

            {/* OFFERS */}
            <li>
              <Link to="/cart"> 🛒 Cart</Link>
            </li>
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
                    <div className="d-flex gap-3">
                      <img className="cat-dropdown-img" src={arr.image} />
                      <p className="catdropdown-name">{arr.name}</p>
                    </div>
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
