"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { productsApi } from "../../utils/api";
import ProductCard from "../../components/products/ProductCard";
import ProductDetailModal from "../../components/products/ProductDetailModal";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch products and categories
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch all products
        const productsData = await productsApi.getAll();
        setProducts(productsData);
        setFilteredProducts(productsData);

        // Fetch categories
        const categoriesData = await productsApi.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching products data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        // Default sorting - newest first (assuming id represents order)
        result.sort((a, b) => b.id - a.id);
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, sortOption, searchQuery]);

  // Handle product click
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
            Our Products
          </h1>
          <p className="text-primary max-w-2xl mx-auto">
            Discover our curated collection of high-quality products designed
            for everyday elegance.
          </p>
        </motion.div>

        {/* Search & Filters section */}
        <motion.div
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, delay: 0.2 },
            },
          }}
        >
          {/* Search bar */}
          <div className="relative mb-8 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-12 pr-6 rounded-full border-2 border-primary-light bg-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-dark/50 absolute left-4 top-1/2 -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Filters - Simplified */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Categories dropdown */}
            <div className="relative w-full sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-3 pl-4 pr-10 rounded-full border-2 border-primary-light bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-dark/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Sort dropdown */}
            <div className="relative w-full sm:w-64">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full py-3 pl-4 pr-10 rounded-full border-2 border-primary-light bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all duration-300"
              >
                <option value="default">Sort: Newest First</option>
                <option value="price-asc">Sort: Price Low to High</option>
                <option value="price-desc">Sort: Price High to Low</option>
                <option value="name-asc">Sort: Name A to Z</option>
                <option value="name-desc">Sort: Name Z to A</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-primary-dark/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-primary-dark">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "Product" : "Products"} Found
            </h2>

            {selectedCategory !== "all" && (
              <motion.button
                onClick={() => setSelectedCategory("all")}
                className="btn btn-outline py-2 px-4 text-sm rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <span>Clear filters</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
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
                </span>
              </motion.button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <motion.div
                className="h-10 w-10 border-4 border-primary rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, ease: "linear", repeat: Infinity }}
              />
            </div>
          ) : filteredProducts.length === 0 ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-primary-dark/30 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-primary-dark mb-2">
                No products found
              </h3>
              <p className="text-primary-dark/70">
                Try adjusting your filters or search query
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewProduct}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

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
