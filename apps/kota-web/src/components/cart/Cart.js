"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    isAuthenticated,
    user,
    login,
    logout,
  } = useCart();

  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");

  // Fetch product details for cart items
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        // Get unique product IDs from cart
        const productIds = Object.keys(cartItems);

        if (productIds.length === 0) {
          setProducts({});
          setIsLoading(false);
          return;
        }

        // Fetch each product
        const productDetails = {};
        for (const id of productIds) {
          const response = await fetch(
            `https://fakestoreapi.com/products/${id}`
          );
          const data = await response.json();
          productDetails[id] = data;
        }

        setProducts(productDetails);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cartOpen && Object.keys(cartItems).length > 0) {
      fetchProducts();
    }
  }, [cartItems, cartOpen]);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      const result = await login(loginForm.email, loginForm.password);

      if (!result.success) {
        setLoginError("Invalid email or password");
      } else {
        // Check for any pending cart actions
        const pendingAction = localStorage.getItem("pendingCartAction");
        if (pendingAction) {
          try {
            const { action, productId, quantity } = JSON.parse(pendingAction);
            if (action === "add") {
              updateQuantity(productId, quantity);
            }
            localStorage.removeItem("pendingCartAction");
          } catch (e) {
            console.error("Error processing pending cart action:", e);
          }
        }
      }
    } catch (error) {
      setLoginError("An error occurred. Please try again.");
    }
  };

  // Calculate total price
  const calculateTotal = () => {
    return Object.entries(cartItems).reduce((total, [productId, quantity]) => {
      const product = products[productId];
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Cart panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {/* Cart header */}
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold text-primary-dark">
                Your Cart
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-neutral rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Cart content */}
            <div className="flex-1 overflow-y-auto p-4">
              {!isAuthenticated ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="bg-neutral p-6 rounded-xl shadow-sm max-w-xs mx-auto w-full">
                    <h3 className="text-center font-medium text-lg mb-4">
                      Login to Continue
                    </h3>

                    {loginError && (
                      <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                        {loginError}
                      </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          className="input py-1.5 px-3 text-sm w-full"
                          value={loginForm.email}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          className="input py-1.5 px-3 text-sm w-full"
                          value={loginForm.password}
                          onChange={(e) =>
                            setLoginForm({
                              ...loginForm,
                              password: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-primary w-full">
                        Login
                      </button>
                    </form>

                    <div className="mt-4 text-center text-sm text-primary-dark/70">
                      <p>Use these demo credentials:</p>
                      <p className="font-medium mt-1">
                        Email: john@example.com
                      </p>
                      <p className="font-medium">Password: m38rmF$</p>
                    </div>
                  </div>
                </div>
              ) : Object.keys(cartItems).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-neutral-dark mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-primary-dark mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-primary text-center mb-6">
                    Add some products to your cart and they will appear here.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="btn btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(cartItems).map(([productId, quantity]) => {
                    const product = products[productId];
                    if (!product) return null;

                    return (
                      <div key={productId} className="flex border-b pb-4">
                        <div className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <h4
                              className="font-medium text-sm line-clamp-2"
                              title={product.title}
                            >
                              {product.title}
                            </h4>

                            <button
                              onClick={() => removeFromCart(productId)}
                              className="text-primary-dark/70 hover:text-primary transition-colors"
                              title="Remove item"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>

                          <div className="text-secondary font-medium mt-1">
                            ${product.price.toFixed(2)}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-full overflow-hidden">
                              <button
                                onClick={() =>
                                  updateQuantity(productId, quantity - 1)
                                }
                                className="px-2 py-1 bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M20 12H4"
                                  />
                                </svg>
                              </button>

                              <span className="px-2 min-w-[30px] text-center">
                                {quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQuantity(productId, quantity + 1)
                                }
                                className="px-2 py-1 bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                  />
                                </svg>
                              </button>
                            </div>

                            <div className="font-medium">
                              ${(product.price * quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="text-right pt-4">
                    <button
                      onClick={clearCart}
                      className="text-sm text-primary-dark/70 hover:text-primary transition-colors flex items-center ml-auto"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart footer */}
            {isAuthenticated && Object.keys(cartItems).length > 0 && (
              <div className="border-t p-4">
                <div className="flex justify-between mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>

                <button className="btn btn-primary w-full">Checkout</button>
              </div>
            )}

            {/* User info footer */}
            {isAuthenticated && (
              <div className="border-t p-4 bg-neutral">
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-primary-dark/70">{user?.email}</p>
                  </div>

                  <button
                    onClick={logout}
                    className="text-primary hover:text-primary-dark transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
