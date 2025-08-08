"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { productsApi } from "../../utils/api";
import ImageMagnifier from "./ImageMagnifier";

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onViewDetails,
}) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [estimatedDelivery, setEstimatedDelivery] = useState(null);
  const { addToCart, cartItems } = useCart();

  // Reset quantity when product changes
  useEffect(() => {
    if (product) {
      const currentQuantity = cartItems[product.id] || 0;
      setQuantity(currentQuantity > 0 ? currentQuantity : 1);
    }
  }, [product, cartItems]);

  // Fetch related products when product changes
  useEffect(() => {
    if (!product) return;

    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch all products to get details and find related items
        const allProducts = await productsApi.getAll();

        // Find products in same category
        const sameCategoryProducts = allProducts.filter(
          (p) => p.category === product.category && p.id !== product.id
        );

        // Shuffle and take top 4
        const shuffled = [...sameCategoryProducts].sort(
          () => 0.5 - Math.random()
        );
        setRelatedProducts(shuffled.slice(0, 4));

        // Simulate delivery estimate
        const today = new Date();
        const deliveryDays = Math.floor(Math.random() * 5) + 2;
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + deliveryDays);

        setEstimatedDelivery({
          estimatedDeliveryDate: deliveryDate.toISOString().split("T")[0],
          shippingMethod: "Standard Shipping",
          shippingCost: product.price > 50 ? 0 : 4.99,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [product]);

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

  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      // Set exact quantity rather than adding
      const currentQuantity = cartItems[product.id] || 0;
      const change = quantity - currentQuantity;

      if (change !== 0) {
        addToCart(product.id, change);
      }

      // Show toast notification
      const toast = document.getElementById("toast");
      if (toast) {
        toast.classList.remove("hidden");
        setTimeout(() => {
          toast.classList.add("hidden");
        }, 3000);
      }
    }
  };

  // Handle view related product - Fixed function
  const handleViewRelatedProduct = (relatedProduct) => {
    // First close current modal
    onClose();

    // Then wait a bit for the modal to close
    setTimeout(() => {
      // Check if onViewDetails is a function before calling it
      if (typeof onViewDetails === "function") {
        onViewDetails(relatedProduct);
      } else {
        // Fallback for when onViewDetails is not available
        console.log("View details function not available");
        // You could implement a fallback behavior here if needed
      }
    }, 300); // Slightly longer timeout to ensure modal closes first
  };

  // If no product is provided or modal is closed, don't render
  if (!product || !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - explicitly handle click to close */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal container - with scrollable content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="relative w-full max-w-5xl my-8">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()} // Prevent clicks from reaching backdrop
              >
                {/* Close button inside modal */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-dark/10 z-10 transition-colors"
                  aria-label="Close modal"
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

                {/* FULLY SCROLLABLE CONTENT - wrapper for all content */}
                <div
                  className="overflow-y-auto"
                  style={{ maxHeight: "calc(80vh - 20px)" }}
                >
                  {/* Main content area with flex layout */}
                  <div className="flex flex-col md:flex-row">
                    {/* Product Image with magnifier */}
                    <div className="w-full md:w-2/5 flex items-center justify-center bg-white p-6 md:border-r">
                      <motion.div
                        className="w-full h-48 md:h-64 relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <ImageMagnifier
                          src={product.image}
                          alt={product.title}
                          height="100%"
                          zoomLevel={2.5}
                          magnifierSize={150}
                        />
                        <div className="text-xs text-center text-primary-dark/50 mt-2">
                          Hover over image to zoom
                        </div>
                      </motion.div>
                    </div>

                    {/* Product Details */}
                    <div className="w-full md:w-3/5 flex flex-col">
                      <div className="p-6">
                        {/* Product info */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mb-4"
                        >
                          <span className="inline-block px-3 py-1 bg-neutral text-primary-dark text-xs rounded-full mb-2 capitalize">
                            {product.category}
                          </span>
                          <h1 className="text-xl md:text-2xl font-bold text-primary-dark mb-2">
                            {product.title}
                          </h1>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center mr-3">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 ${star <= Math.round(product.rating?.rate || 4.5) ? "text-yellow-400" : "text-gray-300"}`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-primary-dark/70">
                              {product.rating?.rate || 4.5} (
                              {product.rating?.count || 120} reviews)
                            </span>
                          </div>
                          <div className="text-2xl font-bold text-secondary">
                            ${product.price.toFixed(2)}
                          </div>
                        </motion.div>

                        {/* Description - More compact */}
                        <motion.div
                          className="mb-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <h3 className="text-base font-medium mb-1">
                            Description
                          </h3>
                          <p className="text-primary-dark text-sm">
                            {product.description}
                          </p>
                        </motion.div>

                        {/* Delivery estimate */}
                        {estimatedDelivery && (
                          <motion.div
                            className="bg-neutral rounded-lg p-3 mb-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
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
                                    estimatedDelivery?.estimatedDeliveryDate
                                  )}
                                  {estimatedDelivery?.shippingMethod &&
                                    ` • ${estimatedDelivery.shippingMethod}`}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Add to Cart section */}
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          <div className="flex items-center mb-4">
                            <div className="flex items-center border rounded-full overflow-hidden mr-4">
                              <button
                                onClick={() =>
                                  setQuantity(Math.max(1, quantity - 1))
                                }
                                className="px-3 py-1.5 bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors"
                                aria-label="Decrease quantity"
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

                              <span className="px-4 font-semibold">
                                {quantity}
                              </span>

                              <button
                                onClick={() => setQuantity(quantity + 1)}
                                className="px-3 py-1.5 bg-neutral-dark/10 hover:bg-neutral-dark/20 transition-colors"
                                aria-label="Increase quantity"
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

                            <span className="text-sm text-primary-dark/70">
                              {product.rating?.count || 120} items available
                            </span>
                          </div>

                          <div className="flex space-x-4">
                            <motion.button
                              className="btn btn-primary py-2.5 flex-1"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={handleAddToCart}
                            >
                              Add to Cart
                            </motion.button>

                            <motion.button
                              className="btn btn-outline py-2.5 border-2 border-primary"
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => {
                                handleAddToCart();
                                onClose();
                              }}
                            >
                              Buy Now
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Related products - now fully visible with scroll */}
                  {relatedProducts.length > 0 && (
                    <div className="border-t px-6 py-6">
                      <h3 className="font-medium mb-4">Similar Products</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {relatedProducts.map((related) => (
                          <motion.div
                            key={related.id}
                            className="bg-neutral rounded-lg p-3 cursor-pointer hover:bg-neutral-dark/20 transition-colors"
                            whileHover={{ y: -5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewRelatedProduct(related);
                            }}
                          >
                            <div className="h-16 flex items-center justify-center mb-2">
                              <img
                                src={related.image}
                                alt={related.title}
                                className="h-full object-contain"
                              />
                            </div>
                            <p className="text-xs line-clamp-2 mb-1">
                              {related.title}
                            </p>
                            <p className="text-secondary font-medium text-sm">
                              ${related.price.toFixed(2)}
                            </p>
                            <motion.button
                              className="bg-secondary text-primary-dark text-xs px-3 py-1 rounded-full mt-2 w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add to cart
                                addToCart(related.id, 1);
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Add to cart
                            </motion.button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Toast notification */}
          <div
            id="toast"
            className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-secondary text-primary-dark px-6 py-3 rounded-full shadow-lg hidden animate-in-toast z-50"
          >
            Item added to cart!
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
