"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useEffect } from "react";

export default function CheckoutSuccessModal() {
  const { checkoutSuccess, setCheckoutSuccess, orderDetails } = useCart();

  // Trigger confetti effect when the modal opens
  useEffect(() => {
    if (checkoutSuccess && typeof window !== "undefined") {
      try {
        // Simple confetti effect
        const colors = [
          "#f44336",
          "#e91e63",
          "#9c27b0",
          "#673ab7",
          "#3f51b5",
          "#2196f3",
          "#03a9f4",
          "#00bcd4",
          "#009688",
          "#4CAF50",
          "#8BC34A",
          "#CDDC39",
          "#FFEB3B",
          "#FFC107",
          "#FF9800",
          "#FF5722",
        ];

        const confettiCount = 200;
        const gravity = 0.5;
        const terminalVelocity = 5;
        const drag = 0.075;

        const canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = "1000";
        document.body.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext("2d");

        const confetti = [];

        for (let i = 0; i < confettiCount; i++) {
          confetti.push({
            color: colors[Math.floor(Math.random() * colors.length)],
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * -1,
            velocity: { x: Math.random() * 6 - 3, y: Math.random() * 3 + 2 },
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 10 - 5,
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
          });
        }

        let animationFrameId;

        function update() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          for (let i = 0; i < confetti.length; i++) {
            const piece = confetti[i];

            // Apply gravity and drag
            piece.velocity.y = Math.min(
              piece.velocity.y + gravity,
              terminalVelocity
            );
            piece.velocity.x *= 1 - drag;

            // Update position
            piece.x += piece.velocity.x;
            piece.y += piece.velocity.y;
            piece.rotation += piece.rotationSpeed;

            // Draw confetti
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(
              -piece.width / 2,
              -piece.height / 2,
              piece.width,
              piece.height
            );
            ctx.restore();

            // Reset if out of screen
            if (piece.y > canvas.height) {
              piece.x = Math.random() * canvas.width;
              piece.y = -20;
              piece.velocity.y = Math.random() * 3 + 2;
            }
          }

          animationFrameId = requestAnimationFrame(update);
        }

        update();

        // Clean up after 4 seconds
        setTimeout(() => {
          cancelAnimationFrame(animationFrameId);
          document.body.removeChild(canvas);
        }, 4000);
      } catch (error) {
        console.error("Error creating confetti effect:", error);
      }
    }
  }, [checkoutSuccess]);

  if (!orderDetails) return null;

  return (
    <AnimatePresence>
      {checkoutSuccess && (
        <>
          {/* Backdrop - close when clicked */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCheckoutSuccess(false)}
          />

          {/* Success modal - properly centered */}
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto py-10">
            <div className="relative w-full max-w-md mx-auto px-4">
              <motion.div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-bold text-primary-dark mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Order Confirmed!
                  </motion.h2>

                  <motion.div
                    className="text-sm text-primary-dark/70 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    Order ID:{" "}
                    <span className="font-medium">{orderDetails.orderId}</span>
                  </motion.div>

                  <motion.p
                    className="text-primary mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Thank you for your purchase. We've received your order and
                    will process it right away.
                  </motion.p>

                  <motion.div
                    className="bg-neutral rounded-xl p-4 mb-6 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-sm text-primary-dark/70 mb-2">
                      Order summary:
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Subtotal:</span>
                      <span className="font-medium">
                        ${orderDetails.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span>Shipping:</span>
                      <span className="font-medium">
                        ${orderDetails.shipping.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-primary-dark/10 pt-2 mt-2">
                      <span>Total:</span>
                      <span>${orderDetails.total.toFixed(2)}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className="mb-6 text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center mb-2">
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
                          Estimated Delivery Date:
                        </span>
                        <div className="font-medium">
                          {orderDetails.estimatedDelivery}
                        </div>
                      </div>
                    </div>
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
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <span className="text-xs text-primary-dark/70">
                          Shipping Method:
                        </span>
                        <div className="font-medium">
                          {orderDetails.shippingMethod}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={() => setCheckoutSuccess(false)}
                    className="btn btn-primary w-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Continue Shopping
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
