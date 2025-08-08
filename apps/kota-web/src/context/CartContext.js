"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const router = useRouter();

  // Load cart from localStorage when component mounts
  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Error parsing user data:", e);
      }

      // If authenticated, fetch cart from server
      fetchCartFromServer(token);
    } else {
      // If not authenticated, load from localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          updateCartCount(parsedCart);
        } catch (e) {
          console.error("Error parsing cart data:", e);
        }
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
      updateCartCount(cartItems);
    }
  }, [cartItems]);

  // Calculate total items in cart
  const updateCartCount = (items) => {
    const count = Object.values(items).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
    setCartItemsCount(count);
  };

  // Fetch cart from server (simulating with Fake Store API)
  const fetchCartFromServer = async (token) => {
    try {
      // For now, we'll use localStorage since Fake Store API doesn't support user-specific carts
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        updateCartCount(parsedCart);
      }
    } catch (error) {
      console.error("Error fetching cart from server:", error);
    }
  };

  // Add item to cart
  const addToCart = (productId, quantity = 1) => {
    setCartItems((prev) => {
      const newCart = {
        ...prev,
        [productId]: (prev[productId] || 0) + quantity,
      };

      // Remove item if quantity is 0
      if (newCart[productId] <= 0) {
        delete newCart[productId];
      }

      return newCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) => ({
      ...prev,
      [productId]: quantity,
    }));
  };

  // Clear cart
  const clearCart = () => {
    setCartItems({});
    localStorage.removeItem("cart");
  };

  // Handle login
  const login = async (email, password) => {
    try {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      // For demo purposes, we'll fetch user data (in a real app this would come with the auth response)
      const userResponse = await fetch("https://fakestoreapi.com/users/1");
      const userData = await userResponse.json();

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: userData.id,
          name: `${userData.name.firstname} ${userData.name.lastname}`,
          email: userData.email,
        })
      );

      setIsAuthenticated(true);
      setUser({
        id: userData.id,
        name: `${userData.name.firstname} ${userData.name.lastname}`,
        email: userData.email,
      });

      // Merge local cart with server cart (in a real app)
      // For now, we'll just keep using the localStorage cart

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Don't clear the cart items, keep them for when user logs back in

    setIsAuthenticated(false);
    setUser(null);
  };

  // Check if authentication is required to add to cart
  const addToCartWithAuthCheck = (productId, quantity = 1) => {
    if (!isAuthenticated) {
      // Store intended action in localStorage
      localStorage.setItem(
        "pendingCartAction",
        JSON.stringify({
          action: "add",
          productId,
          quantity,
        })
      );

      // Store current path to return after login
      localStorage.setItem("returnUrl", window.location.pathname);

      // Open cart which will show login prompt
      setCartOpen(true);

      return false;
    }

    addToCart(productId, quantity);
    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isAuthenticated,
        user,
        login,
        logout,
        addToCartWithAuthCheck,
        cartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
