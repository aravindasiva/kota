"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { productsApi } from "../utils/api";
import ProductCard from "../components/products/ProductCard";
import ProductDetailModal from "../components/products/ProductDetailModal";
import ScrollToTopButton from "../components/layout/ScrollToTopButton";

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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Use our API utility to get products and limit to 8 for featured items
        const allProducts = await productsApi.getAll();

        // Get highest rated or newest products as featured items
        const featuredProducts = [...allProducts]
          .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
          .slice(0, 8);

        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Handle product click
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div>
      {/* Hero section - UPDATED with simpler background and single button */}
      <section className="relative h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158")',
            opacity: 0.7,
          }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/50 to-transparent"></div>

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
              Inspired by <span className="text-secondary">nature</span>,
              designed for you
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-neutral mb-10 max-w-lg"
            >
              Sustainable products that blend beauty with functionality
            </motion.p>

            <motion.div variants={fadeInUp}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/products" className="btn btn-primary shadow-lg">
                  Explore Collection
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
              Featured Products
            </h2>
            <div className="w-24 h-1 bg-secondary mx-auto mb-6"></div>
            <p className="text-primary max-w-xl mx-auto">
              Our most popular items, selected based on customer ratings and
              popularity.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                className="h-10 w-10 border-4 border-primary rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "linear", repeat: Infinity }}
              />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  variants={fadeInUp}
                  className="h-full" /* Ensure consistent height */
                >
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewProduct}
                  />
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

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onViewDetails={handleViewProduct}
      />

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </div>
  );
}
