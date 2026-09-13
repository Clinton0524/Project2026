import { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../Api/Api";

export const myContext = createContext();

const API_URL = process.env.REACT_APP_API_URL;

export const MyProvider = ({ children }) => {
  // =====================================================
  // STATES
  // =====================================================

  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const [under50, setUnder50] = useState(false);
  const [under100, setUnder100] = useState(false);
  const [under150, setUnder150] = useState(false);

  const [register, setRegister] = useState({
    name: "",
    email: "",
    password: "",
    currentPassword: "",
  });

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  // =====================================================
  // LOAD CART FROM BACKEND
  // =====================================================

  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [currentUser]);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart");

      if (response.data.success) {
        const backendItems = response.data.cart?.items || [];

        const formattedCart = backendItems.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
        }));

        setCart(formattedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);

      if (error.response?.status === 401) {
        console.log("User is not authorized to fetch cart");
      }

      setCart([]);
    }
  };

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories?limit=50`);

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (product) => {
    if (!currentUser) {
      alert("Please login to add products to cart.");
      return;
    }

    try {
      const response = await api.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });

      if (response.data.success) {
        const backendItems = response.data.cart?.items || [];

        const formattedCart = backendItems.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
        }));

        setCart(formattedCart);
      }
    } catch (error) {
      console.error("Add to cart error:", error);

      alert(error.response?.data?.message || "Failed to add product to cart");
    }
  };

  // =====================================================
  // INCREMENT QUANTITY
  // =====================================================

  const incrementQty = async (id) => {
    try {
      const response = await api.put("/cart/update", {
        productId: id,
        action: "increase",
      });

      if (response.data.success) {
        const backendItems = response.data.cart?.items || [];

        const formattedCart = backendItems.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
        }));

        setCart(formattedCart);
      }
    } catch (error) {
      console.error("Increment quantity error:", error);

      alert(error.response?.data?.message || "Failed to increase quantity");
    }
  };

  // =====================================================
  // DECREMENT QUANTITY
  // =====================================================

  const decrementQty = async (id) => {
    try {
      const response = await api.put("/cart/update", {
        productId: id,
        action: "decrease",
      });

      if (response.data.success) {
        const backendItems = response.data.cart?.items || [];

        const formattedCart = backendItems.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
        }));

        setCart(formattedCart);
      }
    } catch (error) {
      console.error("Decrement quantity error:", error);

      alert(error.response?.data?.message || "Failed to decrease quantity");
    }
  };

  // =====================================================
  // REMOVE ITEM FROM CART
  // =====================================================

  const removeFromCart = async (id) => {
    try {
      const response = await api.delete("/cart/remove", {
        data: {
          productId: id,
        },
      });

      if (response.data.success) {
        const backendItems = response.data.cart?.items || [];

        const formattedCart = backendItems.map((item) => ({
          ...item.productId,
          quantity: item.quantity,
        }));

        setCart(formattedCart);
      }
    } catch (error) {
      console.error("Remove from cart error:", error);

      alert(error.response?.data?.message || "Failed to remove item from cart");
    }
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = async () => {
    try {
      const response = await api.delete("/cart/clear");

      if (response.data.success) {
        setCart([]);
      }
    } catch (error) {
      console.error("Clear cart error:", error);

      alert(error.response?.data?.message || "Failed to clear cart");
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const loginUser = async (email, password) => {
    try {
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setCurrentUser(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message || "Invalid email or password";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const registerUser = async (name, email, password) => {
    try {
      setError("");

      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setCurrentUser(user);
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Register error:", error);

      const message = error.response?.data?.message || "Registration failed";

      setError(message);

      return {
        success: false,
        message,
      };
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setCart([]);

    setLoginInfo({
      email: "",
      password: "",
    });

    setError("");

    window.location.href = "/";
  };

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value = {
    data,
    setData,

    categories,
    setCategories,

    cart,
    setCart,

    currentUser,
    setCurrentUser,

    sort,
    setSort,

    search,
    setSearch,

    error,
    setError,

    under50,
    setUnder50,

    under100,
    setUnder100,

    under150,
    setUnder150,

    register,
    setRegister,

    loginInfo,
    setLoginInfo,

    addToCart,
    incrementQty,
    decrementQty,
    removeFromCart,
    clearCart,

    loginUser,
    registerUser,
    handleLogout,
  };

  return <myContext.Provider value={value}>{children}</myContext.Provider>;
};
