"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartOpen, setCartOpen, cartItemsCount } = useCart();
  const { isAuthenticated, user, logout, setIsLoginOpen } = useAuth();
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-5 left-0 right-0 z-40 px-4">
      <motion.header
        className={`max-w-4xl mx-auto rounded-full bg-white/90 backdrop-blur-md 
                   ${isScrolled ? "shadow-lg" : "shadow-md"} transition-all duration-500`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-2xl md:text-3xl font-bold text-primary">
                𝓚
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-10">
              <Link
                href="/"
                className={`relative font-semibold transition-colors duration-300 ${
                  pathname === "/"
                    ? "text-primary"
                    : "text-primary-dark hover:text-primary"
                }`}
              >
                <span>Home</span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                    pathname === "/" ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>

              <Link
                href="/products"
                className={`relative font-semibold transition-colors duration-300 ${
                  pathname === "/products"
                    ? "text-primary"
                    : "text-primary-dark hover:text-primary"
                }`}
              >
                <span>Products</span>
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-secondary transition-all duration-300 ${
                    pathname === "/products"
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            </div>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <motion.div
                    className="h-8 w-8 rounded-full bg-primary text-neutral flex items-center justify-center font-medium text-sm cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="User menu"
                  >
                    {user?.initials || "U"}
                  </motion.div>

                  {/* User dropdown menu - Fixed positioning */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg overflow-hidden z-20"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <div className="px-4 py-3 border-b">
                          <p className="font-medium text-primary-dark">
                            {user?.name}
                          </p>
                          <p className="text-xs text-primary-dark/70 truncate">
                            {user?.email}
                          </p>
                        </div>

                        <div className="py-1">
                          <motion.button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-primary-dark hover:bg-neutral transition-colors"
                            whileHover={{ backgroundColor: "#f2f2f2" }}
                          >
                            Logout
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <motion.button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-primary-dark hover:text-primary transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Login"
                  title="Login"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </motion.button>
              )}
            </div>

            <motion.button
              className="relative"
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
              title="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary-dark hover:text-primary transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>

              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-secondary text-xs w-5 h-5 flex items-center justify-center rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key="cart-count"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-primary-dark hover:text-primary transition-colors duration-300"
                whileTap={{ scale: 0.9 }}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
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
                ) : (
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
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden px-6 pb-4"
            >
              <nav className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className={`py-2 font-semibold ${pathname === "/" ? "text-primary" : "text-primary-dark hover:text-primary"} transition-colors duration-300`}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={`py-2 font-semibold ${pathname === "/products" ? "text-primary" : "text-primary-dark hover:text-primary"} transition-colors duration-300`}
                >
                  Products
                </Link>

                {isAuthenticated ? (
                  <div className="border-t pt-2 mt-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary text-neutral flex items-center justify-center font-medium text-sm">
                        {user?.initials || "U"}
                      </div>
                      <div>
                        <p className="font-medium text-primary-dark">
                          {user?.name}
                        </p>
                        <button
                          onClick={logout}
                          className="text-xs text-primary hover:underline"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsLoginOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 font-semibold text-primary hover:text-primary-dark transition-colors duration-300 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Login
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}
