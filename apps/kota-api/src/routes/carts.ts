import { Router } from "express";
import { Response } from "express";
import { fakeStoreApi, handleApiError } from "../utils/api";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

// Create the router with a descriptive name
export const cartRouter: Router = Router();

// Define proper interfaces for cart and cart items
interface CartItem {
  productId: number;
  quantity: number;
}

interface Cart {
  id?: number;
  userId: number;
  date: string;
  products: CartItem[];
}

// Apply auth middleware to all cart routes
cartRouter.use(authMiddleware);

/**
 * Get the current user's cart
 */
async function getUserCart(req: AuthRequest, res: Response) {
  try {
    // In a real app, we'd extract the user ID from the JWT token
    const userId = 1; // Hardcoded for demo purposes

    const response = await fakeStoreApi.get(`/carts/user/${userId}`);

    // Get the most recent cart (FakeStore API returns an array)
    const carts = response.data;

    if (!carts || carts.length === 0) {
      return res.json({ message: "Cart is empty", products: [] });
    }

    // Sort by date (descending) and get the most recent
    const latestCart = carts.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];

    // Enhance cart with product details
    const enhancedCart = await enhanceCartWithProductDetails(latestCart);

    res.json(enhancedCart);
  } catch (error) {
    const errorResponse = handleApiError(error, "Error fetching user cart");
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Add item to user's cart
 */
async function addToCart(req: AuthRequest, res: Response) {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // In a real app, we'd extract the user ID from the JWT token
    const userId = 1; // Hardcoded for demo purposes

    // First, check if product exists
    try {
      await fakeStoreApi.get(`/products/${productId}`);
    } catch (err) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get current cart for the user
    let currentCart: Cart | null = null;
    try {
      const cartsResponse = await fakeStoreApi.get(`/carts/user/${userId}`);
      const carts = cartsResponse.data;

      if (carts && carts.length > 0) {
        // Sort by date (descending) and get the most recent
        currentCart = carts.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
      }
    } catch (err) {
      // No existing cart, which is fine
    }

    // Create payload for the cart update or creation
    const cartPayload: Cart = {
      userId,
      date: new Date().toISOString(),
      products: [],
    };

    if (currentCart && currentCart.products) {
      // Copy existing products
      cartPayload.products = [...currentCart.products];

      // Check if product already exists in cart
      const existingProductIndex = cartPayload.products.findIndex(
        (item: CartItem) => item.productId === Number(productId)
      );

      if (
        existingProductIndex >= 0 &&
        cartPayload.products[existingProductIndex]
      ) {
        // Update quantity
        cartPayload.products[existingProductIndex].quantity += Number(quantity);
      } else {
        // Add new product
        cartPayload.products.push({
          productId: Number(productId),
          quantity: Number(quantity),
        });
      }
    } else {
      // New cart with first product
      cartPayload.products = [
        {
          productId: Number(productId),
          quantity: Number(quantity),
        },
      ];
    }

    // In a real app with a real API, we would update the existing cart
    // With FakeStore API, we'll create a new cart since updates aren't persisted
    const response = await fakeStoreApi.post("/carts", cartPayload);

    // Enhance the response with product details
    const enhancedCart = await enhanceCartWithProductDetails(response.data);

    res.status(201).json({
      message: "Item added to cart",
      cart: enhancedCart,
    });
  } catch (error) {
    const errorResponse = handleApiError(error, "Error adding item to cart");
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Remove item from user's cart
 */
async function removeFromCart(req: AuthRequest, res: Response) {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // In a real app, we'd extract the user ID from the JWT token
    const userId = 1; // Hardcoded for demo purposes

    // Get current cart for the user
    let currentCart: Cart;
    try {
      const cartsResponse = await fakeStoreApi.get(`/carts/user/${userId}`);
      const carts = cartsResponse.data;

      if (!carts || carts.length === 0) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Sort by date (descending) and get the most recent
      currentCart = carts.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
    } catch (err) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if product exists in cart
    if (
      !currentCart.products ||
      !currentCart.products.some(
        (item: CartItem) => item.productId === Number(productId)
      )
    ) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from cart
    const updatedProducts = currentCart.products.filter(
      (item: CartItem) => item.productId !== Number(productId)
    );

    // Create updated cart
    const cartPayload: Cart = {
      userId,
      date: new Date().toISOString(),
      products: updatedProducts,
    };

    // In a real app with a real API, we would update the existing cart
    // With FakeStore API, we'll create a new cart since updates aren't persisted
    const response = await fakeStoreApi.post("/carts", cartPayload);

    // Enhance the response with product details
    const enhancedCart = await enhanceCartWithProductDetails(response.data);

    res.json({
      message: "Item removed from cart",
      cart: enhancedCart,
    });
  } catch (error) {
    const errorResponse = handleApiError(
      error,
      "Error removing item from cart"
    );
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Update quantity of an item in cart
 */
async function updateCartItemQuantity(req: AuthRequest, res: Response) {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate required fields
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    if (!quantity || isNaN(Number(quantity)) || Number(quantity) < 1) {
      return res.status(400).json({
        message: "Valid quantity is required (must be a positive number)",
      });
    }

    // In a real app, we'd extract the user ID from the JWT token
    const userId = 1; // Hardcoded for demo purposes

    // Get current cart for the user
    let currentCart: Cart;
    try {
      const cartsResponse = await fakeStoreApi.get(`/carts/user/${userId}`);
      const carts = cartsResponse.data;

      if (!carts || carts.length === 0) {
        return res.status(404).json({ message: "Cart not found" });
      }

      // Sort by date (descending) and get the most recent
      currentCart = carts.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];
    } catch (err) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Check if product exists in cart
    const productIdNum = Number(productId);
    if (
      !currentCart.products ||
      !currentCart.products.some(
        (item: CartItem) => item.productId === productIdNum
      )
    ) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Update the product quantity
    const updatedProducts = currentCart.products.map((item: CartItem) => {
      if (item.productId === productIdNum) {
        return { ...item, quantity: Number(quantity) };
      }
      return item;
    });

    // Create updated cart
    const cartPayload: Cart = {
      userId,
      date: new Date().toISOString(),
      products: updatedProducts,
    };

    // In a real app with a real API, we would update the existing cart
    // With FakeStore API, we'll create a new cart since updates aren't persisted
    const response = await fakeStoreApi.post("/carts", cartPayload);

    // Enhance the response with product details
    const enhancedCart = await enhanceCartWithProductDetails(response.data);

    res.json({
      message: "Cart item quantity updated",
      cart: enhancedCart,
    });
  } catch (error) {
    const errorResponse = handleApiError(
      error,
      "Error updating cart item quantity"
    );
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Calculate shipping and tax estimates for the current cart
 */
async function getCartEstimates(req: AuthRequest, res: Response) {
  try {
    // In a real app, we'd extract the user ID from the JWT token
    const userId = 1; // Hardcoded for demo purposes

    // Get current cart for the user
    try {
      const cartsResponse = await fakeStoreApi.get(`/carts/user/${userId}`);
      const carts = cartsResponse.data;

      if (!carts || carts.length === 0) {
        return res.json({
          message: "Cart is empty",
          subtotal: 0,
          shipping: 0,
          tax: 0,
          total: 0,
        });
      }

      // Sort by date (descending) and get the most recent
      const latestCart = carts.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

      // Enhance cart with product details
      const enhancedCart = await enhanceCartWithProductDetails(latestCart);

      // Calculate estimates
      const subtotal = enhancedCart.total || 0;

      // Calculate shipping based on subtotal
      let shipping = 0;
      if (subtotal > 0) {
        if (subtotal < 50) {
          shipping = 5.99;
        } else if (subtotal < 100) {
          shipping = 3.99;
        } else {
          shipping = 0; // Free shipping for orders over $100
        }
      }

      // Calculate tax (assuming 8% tax rate)
      const taxRate = 0.08;
      const tax = parseFloat((subtotal * taxRate).toFixed(2));

      // Calculate final total
      const total = parseFloat((subtotal + shipping + tax).toFixed(2));

      res.json({
        subtotal,
        shipping,
        tax,
        total,
        freeShippingThreshold: 100,
        amountToFreeShipping:
          subtotal >= 100 ? 0 : parseFloat((100 - subtotal).toFixed(2)),
        estimatedDelivery: {
          standard: "3-5 business days",
          express: "1-2 business days",
        },
      });
    } catch (error) {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    const errorResponse = handleApiError(
      error,
      "Error calculating cart estimates"
    );
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Helper function to enhance cart with product details
 */
async function enhanceCartWithProductDetails(cart: any) {
  if (!cart.products || cart.products.length === 0) {
    return { ...cart, products: [], total: 0 };
  }

  // Get product details for each item in cart
  const enhancedProducts = await Promise.all(
    cart.products.map(async (item: CartItem) => {
      try {
        const productResponse = await fakeStoreApi.get(
          `/products/${item.productId}`
        );
        const product = productResponse.data;

        return {
          id: item.productId,
          title: product.title,
          price: product.price,
          description: product.description,
          category: product.category,
          image: product.image,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        };
      } catch (error) {
        // If product not found, return basic info
        return {
          id: item.productId,
          title: `Product ${item.productId}`,
          price: 0,
          quantity: item.quantity,
          subtotal: 0,
        };
      }
    })
  );

  // Calculate cart total
  const total = enhancedProducts.reduce(
    (sum: number, item: any) => sum + item.subtotal,
    0
  );

  return {
    id: cart.id,
    userId: cart.userId,
    date: cart.date,
    products: enhancedProducts,
    total: parseFloat(total.toFixed(2)),
  };
}

// Register routes
cartRouter.get("/", getUserCart);
cartRouter.post("/add", addToCart);
cartRouter.delete("/:productId", removeFromCart);
cartRouter.patch("/:productId", updateCartItemQuantity);
cartRouter.get("/estimates", getCartEstimates);

export default cartRouter;
