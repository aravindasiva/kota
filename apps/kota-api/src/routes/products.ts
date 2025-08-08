import { Router, Response } from "express";
import axios from "axios";
import { AuthRequest } from "../middleware/authMiddleware";
import { fakeStoreApi, handleApiError } from "../utils/api";

const productRouter = Router();

/**
 * Get all products
 * Public endpoint - no authentication required
 */
async function getAllProducts(req: AuthRequest, res: Response) {
  try {
    const response = await fakeStoreApi.get("/products");
    res.json(response.data);
  } catch (error) {
    const errorResponse = handleApiError(error, "Error fetching products");
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Get a single product by ID
 * Public endpoint - no authentication required
 */
async function getProductById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const response = await fakeStoreApi.get(`/products/${id}`);
    res.json(response.data);
  } catch (error) {
    const errorResponse = handleApiError(error, "Error fetching product");
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Get products by category
 * Public endpoint - no authentication required
 */
async function getProductsByCategory(req: AuthRequest, res: Response) {
  try {
    const { category } = req.params;
    const response = await fakeStoreApi.get(`/products/category/${category}`);
    res.json(response.data);
  } catch (error) {
    const errorResponse = handleApiError(
      error,
      "Error fetching products by category"
    );
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Get all categories
 * Public endpoint - no authentication required
 */
async function getAllCategories(req: AuthRequest, res: Response) {
  try {
    const response = await fakeStoreApi.get("/products/categories");
    res.json(response.data);
  } catch (error) {
    const errorResponse = handleApiError(error, "Error fetching categories");
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

/**
 * Get product recommendations based on a specific product
 * Public endpoint - no authentication required
 */
async function getProductRecommendations(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    // First, get the product to determine its category
    let product;
    try {
      const productResponse = await fakeStoreApi.get(`/products/${id}`);
      product = productResponse.data;
    } catch (error) {
      return res
        .status(404)
        .json({ message: `Product with ID ${id} not found` });
    }

    // Get products from the same category
    const categoryResponse = await fakeStoreApi.get(
      `/products/category/${product.category}`
    );
    const categoryProducts = categoryResponse.data;

    // Filter out the current product and limit to 5 items
    const recommendations = categoryProducts
      .filter((p: any) => p.id !== Number(id))
      .slice(0, 5)
      .map((p: any) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        category: p.category,
        rating: p.rating,
      }));

    res.json({
      productId: Number(id),
      recommendations,
    });
  } catch (error) {
    const errorResponse = handleApiError(
      error,
      "Error fetching product recommendations"
    );
    res.status(errorResponse.status).json({ message: errorResponse.message });
  }
}

// Register routes
productRouter.get("/", getAllProducts);
productRouter.get("/categories", getAllCategories);
productRouter.get("/category/:category", getProductsByCategory);
productRouter.get("/:id", getProductById);
productRouter.get("/:id/recommendations", getProductRecommendations);

export default productRouter;
