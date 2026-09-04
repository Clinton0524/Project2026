import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Css/Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "./Redux/ProductSlice";

import { myContext } from "./Context/Context";

const Navbar = () => {
  const dispatch = useDispatch();

  const { currentUser, search, setSearch, data, cart, handleLogout } =
    useContext(myContext);

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const [modal, setModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setModal(value.length > 0);
  };

  const filteredData = products.filter((arr) =>
    arr.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleMenuClose = () => {
  setMenuOpen(false);
};

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top py-2">
      <div className="container-fluid px-4">
        {/* LOGO */}
        <Link className="navbar-brand fw-bold fs-4" to="/home">
          Entavo
        </Link>

        {/* HAMBURGER BUTTON */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          type="button"
          className="navbar-toggler-icon"
        ></button>

        {/* SEARCH */}
        <div className="position-relative mx-auto w-100 mt-1">
          <input
            value={search}
            onChange={handleChange}
            type="text"
            className="form-control  ps-4 search-input"
            placeholder="Search products..."
          />

          {/* SEARCH DROPDOWN */}
          {modal && filteredData.length > 0 && (
            <div
              className="position-absolute bg-white w-100 mt-2 rounded shadow"
              style={{
                maxHeight: "260px",
                overflowY: "auto",
                zIndex: 1000,
              }}
            >
              {filteredData.map((arr) => (
                <Link
                  key={arr._id}
                  to={`/product/${arr._id}`}
                  className="text-decoration-none text-dark"
                  onClick={() => setModal(false)}
                >
                  <div className="d-flex align-items-center gap-3 px-3 py-2 search-item">
                    <img
                      src={arr.imageUrl}
                      alt={arr.name}
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "contain",
                      }}
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

        {/* LINKS */}
        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          <button
            className="mobile-menu-close"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          <ul className="navbar-nav ms-auto d-flex flex-row align-items-center gap-4">
            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/"  onClick={handleMenuClose}>
              
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/product"  onClick={handleMenuClose}>
                Products
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/home"  onClick={handleMenuClose}>
                About
              </Link>
            </li>

            {/* CART */}
            <li className="nav-item position-relative">
              <Link className="nav-link fw-semibold" to="/cart"  onClick={handleMenuClose}>
                Cart
                {cart.length > 0 && (
                  <span className="badge bg-dark ms-1">{cart.length}</span>
                )}
              </Link>
            </li>

            {/* AUTH */}
            {currentUser ? (
              <>
                <li className="nav-item">
                  <span className="text-muted">
                    Hi, <strong>{currentUser.displayName}</strong>
                  </span>
                </li>

                
                <li className="nav-item">
                  <button
                    className="btn btn-sm btn-outline-dark rounded-pill px-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li> 
               
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="btn btn-dark btn-sm rounded-pill px-3"
                  to="/login"  onClick={handleMenuClose}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
