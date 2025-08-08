"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { productsApi } from "../../utils/api";
import ProductDetailModal from "../products/ProductDetailModal";

export default function Cart() {
  const {
    cartItems,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
    processCheckout,
  } = useCart();

  const { isAuthenticated, setIsLoginOpen } = useAuth();
  const [products, setProducts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [cartSuggestions, setCartSuggestions] = useState([]);
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Handle view product
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    setCartOpen(false);
  };

  // Fetch product details for cart items
  useEffect(() => {
    if (!cartOpen || Object.keys(cartItems).length === 0) return;

    const fetchProducts = async () => {
      setIsLoading(true);

      try {
        // Get unique product IDs from cart
        const productIds = Object.keys(cartItems);

        // Fetch all products to get details and find related items
        const allProducts = await productsApi.getAll();

        // Create cart products object
        const productDetails = {};
        productIds.forEach((id) => {
          const product = allProducts.find((p) => p.id.toString() === id);
          if (product) productDetails[id] = product;
        });

        setProducts(productDetails);

        // Find product suggestions based on categories in cart
        const cartCategories = Object.values(productDetails).map(
          (p) => p.category
        );
        const uniqueCategories = [...new Set(cartCategories)];

        // Get products that match cart categories but aren't in cart
        const suggestions = allProducts.filter(
          (product) =>
            uniqueCategories.includes(product.category) &&
            !productIds.includes(product.id.toString())
        );

        // Shuffle and limit to 2
        const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
        setCartSuggestions(shuffled.slice(0, 2));

        // Generate delivery estimate
        calculateDeliveryEstimate(productDetails);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [cartItems, cartOpen]);

  // Calculate delivery estimate
  const calculateDeliveryEstimate = (productDetails) => {
    // Base delivery date is 3-7 days from now
    const today = new Date();
    const deliveryDays = Math.floor(Math.random() * 5) + 3;
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    // Calculate subtotal
    const subtotal = Object.entries(cartItems).reduce(
      (total, [id, quantity]) => {
        const product = productDetails[id];
        return total + (product ? product.price * quantity : 0);
      },
      0
    );

    // Free shipping over $50
    const shippingCost = subtotal > 50 ? 0 : 4.99;

    setDeliveryEstimate({
      estimatedDeliveryDate: deliveryDate.toISOString().split("T")[0],
      shippingMethod:
        shippingCost === 0 ? "Free Shipping" : "Standard Shipping",
      shippingCost,
    });
  };

  // Handle checkout button
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      setCartOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const success = await processCheckout(products);
      if (success) {
        setCartOpen(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return Object.entries(cartItems).reduce((total, [productId, quantity]) => {
      const product = products[productId];
      return total + (product ? product.price * quantity : 0);
    }, 0);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
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
                <motion.button
                  onClick={() => setCartOpen(false)}
                  className="p-2 hover:bg-neutral rounded-full transition-colors"
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
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
                </motion.button>
              </div>

              {/* Cart content */}
              <div className="flex-1 overflow-y-auto p-4">
                {Object.keys(cartItems).length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
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
                    </motion.div>
                    <motion.h3
                      className="text-xl font-medium text-primary-dark mb-2"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      Your cart is empty
                    </motion.h3>
                    <motion.p
                      className="text-primary text-center mb-6"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      Add some products to your cart and they will appear here.
                    </motion.p>
                    <motion.button
                      onClick={() => setCartOpen(false)}
                      className="btn btn-primary"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue Shopping
                    </motion.button>
                  </div>
                ) : isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <motion.div
                      className="h-10 w-10 border-4 border-primary rounded-full border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {Object.entries(cartItems).map(
                        ([productId, quantity]) => {
                          const product = products[productId];
                          if (!product) return null;

                          return (
                            <motion.div
                              key={productId}
                              className="flex border-b pb-4"
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 50 }}
                              transition={{ duration: 0.3 }}
                              layout
                            >
                              <div
                                className="w-20 h-20 bg-white rounded-md overflow-hidden flex-shrink-0 cursor-pointer"
                                onClick={() => handleViewProduct(product)}
                              >
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-contain"
                                />
                              </div>

                              <div className="ml-4 flex-1">
                                <div className="flex justify-between">
                                  <h4
                                    className="font-medium text-sm line-clamp-2 cursor-pointer"
                                    title={product.title}
                                    onClick={() => handleViewProduct(product)}
                                  >
                                    {product.title}
                                  </h4>

                                  <motion.button
                                    onClick={() => removeFromCart(productId)}
                                    className="text-red-500 hover:text-red-700 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
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
                                  </motion.button>
                                </div>

                                <div className="text-secondary font-medium mt-1">
                                  ${product.price.toFixed(2)}
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center border rounded-full overflow-hidden">
                                    <motion.button
                                      onClick={() =>
                                        updateQuantity(
                                          productId,
                                          Math.max(0, quantity - 1)
                                        )
                                      }
                                      className="px-2 py-1 bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors"
                                      whileTap={{ scale: 0.95 }}
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
                                    </motion.button>

                                    <span className="px-2 min-w-[30px] text-center">
                                      {quantity}
                                    </span>

                                    <motion.button
                                      onClick={() =>
                                        updateQuantity(productId, quantity + 1)
                                      }
                                      className="px-2 py-1 bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors"
                                      whileTap={{ scale: 0.95 }}
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
                                    </motion.button>
                                  </div>

                                  <div className="font-medium">
                                    ${(product.price * quantity).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        }
                      )}
                    </AnimatePresence>

                    {/* Delivery estimate */}
                    {deliveryEstimate && (
                      <motion.div
                        className="bg-neutral rounded-lg p-3 mt-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-secondary mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <div>
                            <span className="text-xs text-primary-dark/70">
                              Estimated Delivery:
                            </span>
                            <div className="font-medium text-sm">
                              {formatDate(
                                deliveryEstimate.estimatedDeliveryDate
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Product suggestions based on cart categories */}
                    {cartSuggestions.length > 0 && (
                      <motion.div
                        className="mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h3 className="text-sm font-medium mb-3">
                          You might also like:
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {cartSuggestions.map((product) => (
                            <motion.div
                              key={product.id}
                              className="bg-neutral rounded-lg p-2 text-center"
                              whileHover={{ y: -5 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div
                                className="block cursor-pointer"
                                onClick={() => handleViewProduct(product)}
                              >
                                <div className="h-20 flex items-center justify-center">
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-full object-contain"
                                  />
                                </div>
                                <div className="mt-2">
                                  <p
                                    className="text-xs line-clamp-1"
                                    title={product.title}
                                  >
                                    {product.title}
                                  </p>
                                  <p className="text-secondary font-medium text-sm mt-1">
                                    ${product.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <motion.button
                                className="bg-secondary text-primary-dark text-xs px-3 py-1 rounded-full mt-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateQuantity(product.id.toString(), 1);
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Add to cart
                              </motion.button>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    <div className="text-right pt-4">
                      <motion.button
                        onClick={clearCart}
                        className="text-sm text-primary-dark/70 hover:text-primary transition-colors flex items-center ml-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
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
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              {/* Cart footer */}
              {Object.keys(cartItems).length > 0 && (
                <motion.div
                  className="border-t p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary-dark/70">Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-primary-dark/70">Shipping:</span>
                      <span>
                        ${deliveryEstimate?.shippingCost.toFixed(2) || "4.99"}
                      </span>
                    </div>

                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-primary-dark/10">
                      <span>Total:</span>
                      <span>
                        $
                        {(
                          calculateSubtotal() +
                          (deliveryEstimate?.shippingCost || 4.99)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    className="btn btn-primary w-full"
                    onClick={handleCheckout}
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Checkout"
                    )}
                  </motion.button>

                  {/* Note when not logged in */}
                  {!isAuthenticated && (
                    <p className="text-xs text-primary-dark/70 text-center mt-2">
                      You'll need to login before completing your purchase
                    </p>
                  )}
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Product detail modal for suggestion clicks */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onViewDetails={handleViewProduct}
      />
    </>
  );
}
