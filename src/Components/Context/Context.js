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
  // LOAD CART FOR CURRENT USER
  // =====================================================

  useEffect(() => {
    if (currentUser?.id) {
      const savedCart = localStorage.getItem(
        `cart_${currentUser.id}`
      );

      try {
        setCart(savedCart ? JSON.parse(savedCart) : []);
      } catch (error) {
        console.error("Cart parsing error:", error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [currentUser]);

  // =====================================================
  // SAVE CART
  // =====================================================

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(
        `cart_${currentUser.id}`,
        JSON.stringify(cart)
      );
    }
  }, [cart, currentUser]);

  // =====================================================
  // FETCH CATEGORIES
  // =====================================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/categories?limit=50`
      );

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Fetch categories error:", error);
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = (product) => {
    if (!currentUser) {
      alert("Please login to add products to cart.");
      return;
    }

    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => item._id === product._id
      );

      if (existing) {
        return previousCart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...previousCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // =====================================================
  // INCREMENT
  // =====================================================

  const incrementQty = (id) => {
    setCart((previousCart) =>
      previousCart.map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  // =====================================================
  // DECREMENT
  // =====================================================

  const decrementQty = (id) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeFromCart = (id) => {
    setCart((previousCart) =>
      previousCart.filter((item) => item._id !== id)
    );
  };

  // =====================================================
  // CLEAR CART
  // =====================================================

  const clearCart = () => {
    setCart([]);
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
        error.response?.data?.message ||
        "Invalid email or password";

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

      const message =
        error.response?.data?.message ||
        "Registration failed";

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

  return (
    <myContext.Provider value={value}>
      {children}
    </myContext.Provider>
  );
};