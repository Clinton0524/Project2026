import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { MyProvider } from "./Components/Context/Context";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";

import Store from "./Components/Redux/Store";
import { Provider } from "react-redux";

// ==================== NORMAL IMPORT ====================
// Keep Products normal so its existing product-card styling
// and CSS loading behavior remain unchanged.
import Products from "./Components/Pages/Products";

// ==================== LAZY LOADED PAGES ====================

const Home = lazy(() => import("./Components/Pages/Home"));

const Cart = lazy(() => import("./Components/Pages/Cart"));

const Login = lazy(() => import("./Components/Pages/Login"));

const Register = lazy(() => import("./Components/Pages/Register"));

const ProductDetail = lazy(() => import("./Components/Pages/ProductDetail"));

const Checkout = lazy(() => import("./Components/Pages/Checkout"));

const PaymentMock = lazy(() => import("./Components/Pages/PaymentMock"));

const OrderSuccess = lazy(() => import("./Components/Pages/OrderSuccess"));

const CategoryProducts = lazy(
  () => import("./Components/Pages/CategoryProducts"),
);

const Orders = lazy(() => import("./Components/Pages/Orders"));

const OrderDetails = lazy(() => import("./Components/Pages/OrderDetails"));

const Offers = lazy(() => import("./Components/Pages/Offers"));

function App() {
  return (
    <Provider store={Store}>
      <MyProvider>
        <Router>
          <ScrollToTop />

          <div className="app-layout">
            <Navbar />

            <main className="content">
              <Suspense fallback={null}>
                <Routes>
                  {/* HOME */}
                  <Route path="/" element={<Home />} />

                  {/* CART */}
                  <Route path="/cart" element={<Cart />} />

                  {/* LOGIN */}
                  <Route path="/login" element={<Login />} />

                  {/* REGISTER */}
                  <Route path="/register" element={<Register />} />

                  {/* PRODUCTS */}
                  <Route path="/product" element={<Products />} />

                  {/* PRODUCT DETAIL */}
                  <Route path="/product/:id" element={<ProductDetail />} />

                  {/* CATEGORY PRODUCTS */}
                  <Route
                    path="/category/:catid"
                    element={<CategoryProducts />}
                  />

                  {/* OFFERS */}
                  <Route path="/offers" element={<Offers />} />

                  {/* CHECKOUT */}
                  <Route path="/checkout" element={<Checkout />} />

                  {/* PAYMENT */}
                  <Route path="/payment-mock" element={<PaymentMock />} />

                  {/* ORDERS */}
                  <Route path="/orders" element={<Orders />} />

                  {/* ORDER DETAILS */}
                  <Route path="/orders/:orderId" element={<OrderDetails />} />

                  {/* ORDER SUCCESS */}
                  <Route path="/order-success" element={<OrderSuccess />} />
                </Routes>
              </Suspense>
            </main>

            <Footer />
          </div>
        </Router>
      </MyProvider>
    </Provider>
  );
}

export default App;
