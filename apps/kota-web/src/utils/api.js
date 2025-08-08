/**
 * API utility for interacting with the MCP server
 */

// Base API URL from environment variables - defaults to localhost:3001 if not set
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper function for HTTP requests
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // Some endpoints might not return JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Products API
export const productsApi = {
  // Get all products
  getAll: async (limit = null) => {
    try {
      // Use our API endpoint
      const endpoint = limit ? `/products?limit=${limit}` : "/products";
      return await fetchWithAuth(endpoint);
    } catch (error) {
      console.error(
        "Error fetching products, falling back to fakestoreapi:",
        error
      );

      // Fallback to fakestoreapi for development
      const fallbackUrl = limit
        ? `https://fakestoreapi.com/products?limit=${limit}`
        : "https://fakestoreapi.com/products";

      const response = await fetch(fallbackUrl);
      return await response.json();
    }
  },

  // Get a single product by ID
  getById: async (id) => {
    try {
      return await fetchWithAuth(`/products/${id}`);
    } catch (error) {
      console.error(
        `Error fetching product ${id}, falling back to fakestoreapi:`,
        error
      );

      // Fallback to fakestoreapi for development
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      return await response.json();
    }
  },

  // Get products by category
  getByCategory: async (category) => {
    try {
      return await fetchWithAuth(`/products/category/${category}`);
    } catch (error) {
      console.error(
        `Error fetching products in category ${category}, falling back to fakestoreapi:`,
        error
      );

      // Fallback to fakestoreapi for development
      const response = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
      );
      return await response.json();
    }
  },

  // Get product suggestions based on a product ID
  getSuggestions: async (productId, limit = 4) => {
    try {
      return await fetchWithAuth(
        `/products/${productId}/suggestions?limit=${limit}`
      );
    } catch (error) {
      console.error(
        `Error fetching product suggestions, falling back to random products:`,
        error
      );

      // Fallback to random products from fakestoreapi
      const response = await fetch(
        `https://fakestoreapi.com/products?limit=${limit}`
      );
      return await response.json();
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      return await fetchWithAuth("/products/categories");
    } catch (error) {
      console.error(
        "Error fetching categories, falling back to fakestoreapi:",
        error
      );

      // Fallback to fakestoreapi for development
      const response = await fetch(
        "https://fakestoreapi.com/products/categories"
      );
      return await response.json();
    }
  },

  // Get estimated delivery date for a product
  getEstimatedDelivery: async (productId) => {
    try {
      return await fetchWithAuth(`/products/${productId}/delivery-estimate`);
    } catch (error) {
      console.error("Error fetching delivery estimate, using fallback:", error);

      // Generate a random delivery estimate as fallback
      const today = new Date();
      const deliveryDays = Math.floor(Math.random() * 5) + 2; // 2-7 days
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + deliveryDays);

      return {
        estimatedDeliveryDate: deliveryDate.toISOString().split("T")[0],
        shippingMethod: "Standard Shipping",
        shippingCost: 4.99,
      };
    }
  },
};

// Auth API
export const authApi = {
  // Login with username and password
  login: async (username, password) => {
    try {
      return await fetchWithAuth("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
    } catch (error) {
      console.error("Login error, using mock authentication:", error);

      // Simulate login for development
      if (username === "johnd" && password === "m38rmF$") {
        return {
          token: "mock_token_123",
          user: {
            id: 1,
            username: "johnd",
            email: "john@example.com",
            name: {
              firstname: "John",
              lastname: "Doe",
            },
          },
        };
      } else {
        throw new Error("Invalid credentials");
      }
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      return await fetchWithAuth("/user");
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
};

// Cart API
export const cartApi = {
  // Get cart items from localStorage
  getLocalCart: () => {
    if (typeof window === "undefined") return {};

    try {
      const cartData = localStorage.getItem("cart");
      return cartData ? JSON.parse(cartData) : {};
    } catch (e) {
      console.error("Error parsing cart:", e);
      return {};
    }
  },

  // Add item to cart
  addToCart: (productId, quantity = 1) => {
    if (typeof window === "undefined") return {};

    try {
      const cartData = localStorage.getItem("cart");
      const cart = cartData ? JSON.parse(cartData) : {};

      // Update quantity
      cart[productId] = (cart[productId] || 0) + quantity;

      // Remove if quantity is 0 or less
      if (cart[productId] <= 0) {
        delete cart[productId];
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      return cart;
    } catch (error) {
      console.error("Error updating cart:", error);
      return {};
    }
  },

  // Remove item from cart
  removeFromCart: (productId) => {
    if (typeof window === "undefined") return {};

    try {
      const cartData = localStorage.getItem("cart");
      if (!cartData) return {};

      const cart = JSON.parse(cartData);
      delete cart[productId];

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      return cart;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return {};
    }
  },

  // Update item quantity
  updateQuantity: (productId, quantity) => {
    if (typeof window === "undefined") return {};

    try {
      // Remove if quantity is 0
      if (quantity <= 0) {
        return cartApi.removeFromCart(productId);
      }

      const cartData = localStorage.getItem("cart");
      const cart = cartData ? JSON.parse(cartData) : {};

      // Update quantity
      cart[productId] = quantity;

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      return cart;
    } catch (error) {
      console.error("Error updating quantity:", error);
      return {};
    }
  },

  // Clear cart
  clearCart: () => {
    if (typeof window === "undefined") return {};

    localStorage.removeItem("cart");
    return {};
  },

  // Calculate estimated delivery for cart items
  getCartEstimate: async (cartItems) => {
    try {
      // In a real implementation, this would call our API
      // For now, generate a random estimate

      // Base delivery date is 3-7 days from now
      const today = new Date();
      const deliveryDays = Math.floor(Math.random() * 5) + 3;
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + deliveryDays);

      // Calculate shipping cost based on cart total
      const shippingCost = Object.keys(cartItems).length > 3 ? 0 : 4.99;

      return {
        estimatedDeliveryDate: deliveryDate.toISOString().split("T")[0],
        shippingMethod:
          shippingCost === 0 ? "Free Shipping" : "Standard Shipping",
        shippingCost,
      };
    } catch (error) {
      console.error("Error calculating cart estimate:", error);
      return null;
    }
  },
};
