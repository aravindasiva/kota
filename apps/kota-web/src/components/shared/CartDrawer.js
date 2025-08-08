"use client";

import { useEffect } from "react";
import { FiX, FiTrash } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

export default function CartDrawer({ isOpen, onClose, cartItems = [] }) {
  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay"
              onClick={onClose}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: "easeOut" }}
              className="cart-drawer"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-medium text-primary-dark">
                    Your Cart
                  </h2>
                  <button
                    className="p-2 rounded-full hover:bg-neutral focus:outline-none"
                    onClick={onClose}
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-grow overflow-auto p-4">
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <svg
                        className="w-16 h-16 text-primary-light mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        />
                      </svg>
                      <p className="text-primary-dark font-medium">
                        Your cart is empty
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Add items to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-neutral rounded overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-sm font-medium text-primary-dark line-clamp-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity}
                              </p>
                              <p className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <button
                            className="p-1.5 text-primary hover:bg-neutral rounded-full"
                            aria-label="Remove item"
                          >
                            <FiTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t bg-neutral">
                  <div className="flex justify-between mb-4">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <Button variant="primary" className="w-full mb-2">
                    Checkout
                  </Button>
                  <button
                    className="w-full text-center text-primary underline text-sm py-2"
                    onClick={onClose}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
