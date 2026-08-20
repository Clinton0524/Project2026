import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth"; // adjust path
import {auth} from '../Firebase/Firebase'
import { signOut } from "firebase/auth";

export const myContext = createContext();

export const MyProvider = ({ children }) => {
  // --- STATES ---
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
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

  //CART IS SAVED IN LOCAL STORAGE FOR DIFFERENT USERS DIFFERENT CART ITEMS
  
  useEffect(() => {
    if (currentUser?.uid) {
      const savedCart = localStorage.getItem(`cart_${currentUser.uid}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    } 
    // else {
    //   setCart([]); // user logged out → empty cart
    // }
  }, [currentUser]);
  useEffect(() => {
    if (currentUser?.uid) {
      localStorage.setItem(`cart_${currentUser.uid}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  // 🔹 ADD TO CART
  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);

    if (!existing) {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // 🔹 INCREMENT
  const incrementQty = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // 🔹 DECREMENT
  const decrementQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  

  // --- FETCH CATEGORIES ---
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://newback-aold.onrender.com/api/categories"
      );
      setCategories(res.data.categories);
    } catch (err) {
      console.log(err);
    }
  };

  // --- AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
       window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  // --- CONTEXT VALUE ---
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
    handleLogout,
    decrementQty,
  };

  return <myContext.Provider value={value}>{children}</myContext.Provider>;
};
