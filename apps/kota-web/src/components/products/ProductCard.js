"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, onViewDetails }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);
  const { addToCart, cartItems } = useCart();

  // Get product quantity from cart
  const getQuantity = (productId) => {
    return cartItems[productId] || 0;
  };

  // Handle 3D tilt effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = (y - centerY) / 10;
    const tiltY = -(x - centerX) / 20;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Handle quantity change
  const handleQuantityChange = (e, change) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, change);
  };

  return (
    <motion.div
      ref={cardRef}
      className="product-card perspective cursor-pointer h-full"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        y: -10,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      onClick={() => onViewDetails(product)}
    >
      <div className="block card h-full relative">
        <div className="relative pt-[100%] bg-white overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="product-image absolute top-0 left-0 w-full h-full object-contain p-6 transition-transform duration-700"
          />

          <div className="product-overlay bg-primary/50 flex flex-col justify-between">
            <div className="p-5">
              <span className="text-xs uppercase tracking-wider text-neutral mb-2 inline-block">
                {product.category}
              </span>
              <p className="text-neutral">{product.description}</p>
            </div>

            {/* Quantity Controls - Bottom Right */}
            <div className="absolute bottom-4 right-4">
              {getQuantity(product.id) === 0 ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleQuantityChange(e, 1)}
                  className="h-10 w-10 rounded-full bg-secondary text-primary-dark shadow-md flex items-center justify-center"
                  aria-label={`Add ${product.title} to cart`}
                  title="Add to cart"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center bg-white rounded-full shadow-lg overflow-hidden"
                >
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleQuantityChange(e, -1)}
                    className="h-10 w-10 bg-secondary text-primary-dark flex items-center justify-center"
                    aria-label="Decrease quantity"
                    title="Decrease quantity"
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
                        d="M18 12H6"
                      />
                    </svg>
                  </motion.button>

                  <span className="px-3 font-semibold text-primary-dark">
                    {getQuantity(product.id)}
                  </span>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleQuantityChange(e, 1)}
                    className="h-10 w-10 bg-secondary text-primary-dark flex items-center justify-center"
                    aria-label="Increase quantity"
                    title="Increase quantity"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-center">
            <h3
              className="font-medium text-primary-dark line-clamp-2 pr-4 product-title"
              title={product.title}
            >
              {product.title}
            </h3>
            <span className="font-medium text-lg text-secondary">
              ${product.price.toFixed(0)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
