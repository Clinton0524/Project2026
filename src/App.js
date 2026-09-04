import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MyProvider } from "./Components/Context/Context";
import Navbar from "./Components/Navbar";
import Home from "./Components/Pages/Home";
import Cart from "./Components/Pages/Cart";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import Products from "./Components/Pages/Products";
import ProductDetail from "./Components/Pages/ProductDetail";
import Footer from "./Components/Footer";
import Checkout from "./Components/Pages/Checkout";
import PaymentMock from "./Components/Pages/PaymentMock";
import OrderSuccess from "./Components/Pages/Order-success";
import Store from "./Components/Redux/Store";
import { Provider } from "react-redux";
import CategoryProducts from "./Components/Pages/CategoryProducts";
import ScrollToTop from "./Components/ScrollToTop";
function App() {
  return (
    <Provider store={Store}>
      <MyProvider>
        <Router>
          <ScrollToTop />
          <div className="app-layout">
            <Navbar />

            <main className="content">
                
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/product" element={<Products />} />
                <Route path="/payment-mock" element={<PaymentMock />} />
                <Route path="/orderSuccess" element={<OrderSuccess />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                 <Route path="/category/:catid" element={<CategoryProducts />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </MyProvider>
    </Provider>
  );
}

export default App;
