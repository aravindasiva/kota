"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { cartApi, productsApi } from "../utils/api";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Load cart from localStorage when component mounts
  useEffect(() => {
    const savedCart = cartApi.getLocalCart();
    setCartItems(savedCart);
    updateCartCount(savedCart);
  }, []);

  // Update cart count whenever items change
  const updateCartCount = (items) => {
    const count = Object.values(items).reduce(
      (sum, quantity) => sum + quantity,
      0
    );
    setCartItemsCount(count);
  };

  // Add item to cart
  const addToCart = (productId, quantity = 1) => {
    const updatedCart = cartApi.addToCart(productId, quantity);
    setCartItems(updatedCart);
    updateCartCount(updatedCart);
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cartApi.removeFromCart(productId);
    setCartItems(updatedCart);
    updateCartCount(updatedCart);
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartApi.updateQuantity(productId, quantity);
    setCartItems(updatedCart);
    updateCartCount(updatedCart);
  };

  // Clear cart
  const clearCart = () => {
    cartApi.clearCart();
    setCartItems({});
    setCartItemsCount(0);
  };

  // Process checkout
  const processCheckout = async (cartProducts) => {
    try {
      // Calculate totals
      const subtotal = Object.entries(cartItems).reduce(
        (total, [productId, quantity]) => {
          const product = cartProducts[productId];
          return total + (product ? product.price * quantity : 0);
        },
        0
      );

      // Get shipping cost - free over $50
      const shipping = subtotal > 50 ? 0 : 4.99;

      // Generate delivery date - 3-7 days from now
      const today = new Date();
      const deliveryDays = Math.floor(Math.random() * 5) + 3;
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + deliveryDays);

      // Create order details
      const orderDetails = {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`, // Random 6 digit order ID
        subtotal,
        shipping,
        total: subtotal + shipping,
        estimatedDelivery: deliveryDate.toISOString().split("T")[0],
        shippingMethod: shipping === 0 ? "Free Shipping" : "Standard Shipping",
        items: Object.entries(cartItems).map(([productId, quantity]) => ({
          productId,
          title: cartProducts[productId]?.title || "Product",
          price: cartProducts[productId]?.price || 0,
          quantity,
        })),
      };

      setOrderDetails(orderDetails);
      setCheckoutSuccess(true);

      // Clear cart
      clearCart();

      return true;
    } catch (error) {
      console.error("Error processing checkout:", error);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemsCount,
        processCheckout,
        checkoutSuccess,
        setCheckoutSuccess,
        orderDetails,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
