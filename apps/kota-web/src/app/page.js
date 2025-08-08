"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tiltValues, setTiltValues] = useState({});
  const productRefs = useRef([]);
  const { addToCart, cartItems, setCartOpen } = useCart();

  // Current date/time display
  const currentDateTime = "2025-08-08 01:47:05";
  const currentUser = "aravindasiva";

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          "https://fakestoreapi.com/products?limit=8"
        );
        const data = await response.json();
        setProducts(data);

        // Initialize tilt values for each product
        const initialTiltValues = {};
        data.forEach((product) => {
          initialTiltValues[product.id] = { x: 0, y: 0 };
        });

        setTiltValues(initialTiltValues);

        productRefs.current = productRefs.current.slice(0, data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Handle 3D tilt effect
  const handleMouseMove = (e, productId) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = (y - centerY) / 10;
    const tiltY = -(x - centerX) / 20;

    setTiltValues((prev) => ({
      ...prev,
      [productId]: { x: tiltX, y: tiltY },
    }));
  };

  const handleMouseLeave = (productId) => {
    setTiltValues((prev) => ({
      ...prev,
      [productId]: { x: 0, y: 0 },
    }));
  };

  // Get product quantity from cart
  const getQuantity = (productId) => {
    return cartItems[productId] || 0;
  };

  // Handle quantity change
  const handleQuantityChange = (e, productId, change) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, change);
  };

  return (
    <div>
      {/* Hero section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop")',
            opacity: 0.6,
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/30 to-transparent"></div>

        <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10">
          <motion.div
            className="max-w-xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Modern <span className="text-secondary">Essentials</span> For Your
              Lifestyle
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-neutral mb-10 max-w-lg"
            >
              Curated collection of high-quality products designed for everyday
              elegance.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/products" className="btn btn-primary shadow-lg">
                  Explore
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/about"
                  className="btn btn-outline border-2 border-neutral text-neutral hover:bg-neutral hover:text-primary-dark"
                >
                  About
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-neutral to-transparent"></div>
      </section>

      {/* Featured products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4">
              Collection
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-10 w-10 border-4 border-primary rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  ref={(el) => (productRefs.current[index] = el)}
                  className="product-card perspective"
                  variants={fadeInUp}
                  style={{
                    transform: `perspective(1000px) rotateX(${tiltValues[product.id]?.x || 0}deg) rotateY(${tiltValues[product.id]?.y || 0}deg)`,
                  }}
                  onMouseMove={(e) => handleMouseMove(e, product.id)}
                  onMouseLeave={() => handleMouseLeave(product.id)}
                  whileHover={{
                    y: -10,
                    transition: { duration: 0.3, ease: "easeOut" },
                  }}
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="block card h-full relative"
                    title={product.title}
                  >
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
                              onClick={(e) =>
                                handleQuantityChange(e, product.id, 1)
                              }
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
                                onClick={(e) =>
                                  handleQuantityChange(e, product.id, -1)
                                }
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
                                onClick={(e) =>
                                  handleQuantityChange(e, product.id, 1)
                                }
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
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
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
                          className="font-medium text-primary-dark line-clamp-1 pr-4"
                          title={product.title}
                        >
                          {product.title}
                        </h3>
                        <span className="font-medium text-lg text-secondary">
                          ${product.price.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/products"
              className="btn btn-outline text-primary hover:bg-primary hover:text-neutral inline-flex items-center gap-2"
            >
              View All Products
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-primary bg-opacity-5">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: "🌿",
                title: "Sustainable",
                description: "Eco-friendly materials",
              },
              {
                icon: "🚚",
                title: "Free Shipping",
                description: "On orders over $50",
              },
              {
                icon: "🔒",
                title: "Secure Checkout",
                description: "Multiple payment options",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white p-8 rounded-2xl shadow-floating text-center"
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.12)",
                  transition: { duration: 0.3 },
                }}
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-medium text-primary-dark mb-2">
                  {feature.title}
                </h3>
                <p className="text-primary">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter in a fluid design */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-primary to-primary-dark p-8 md:p-12 text-center text-white overflow-hidden relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

            <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
              Stay Connected
            </h2>
            <p className="text-lg mb-8 max-w-lg mx-auto text-neutral">
              Join our newsletter for exclusive deals and updates on new
              products.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-6 py-3 rounded-full text-primary-dark focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <motion.button
                className="btn bg-secondary text-primary-dark hover:bg-secondary-light py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Toast notification */}
      <div
        id="toast"
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-secondary text-primary-dark px-6 py-3 rounded-full shadow-lg hidden animate-in-toast z-50"
      >
        Item added to cart!
      </div>

      {/* Scroll to top button */}
      <ScrollToTopButton />

      {/* Footer content showing date and user */}
      <div className="text-center py-4 text-xs text-primary-dark/70 border-t border-primary-dark/10">
        <p>
          Current Date: {currentDateTime} | User: {currentUser}
        </p>
      </div>
    </div>
  );
}

// Scroll to top button component
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <motion.button
      className="fixed bottom-8 right-8 p-4 rounded-full bg-white text-primary shadow-floating z-30 cursor-pointer"
      onClick={scrollToTop}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title="Scroll to top"
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
          d="M5 15l7-7 7 7"
        />
      </svg>
    </motion.button>
  );
}
