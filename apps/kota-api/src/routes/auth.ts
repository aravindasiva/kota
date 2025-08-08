import { Router } from 'express';
import axios from 'axios';
import { Request, Response } from 'express';

export const authRouter = Router();
const FAKE_STORE_API = process.env.FAKE_STORE_API_URL || 'https://fakestoreapi.com';

/**
 * Authenticates a user and returns a token
 */
async function loginUser(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    
    // Basic validation
    if (!username || !password) {
      return res.status(400).json({ 
        message: 'Username and password are required' 
      });
    }
    
    // Forward the request to Fake Store API
    const response = await axios.post(`${FAKE_STORE_API}/auth/login`, {
      username,
      password
    });
    
    // Return the token from Fake Store API
    res.json({
      token: response.data.token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's an axios error with a response
    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({ 
        message: 'Authentication failed',
        error: error.response.data
      });
    }
    
    // Generic error
    res.status(500).json({ 
      message: 'Authentication service unavailable' 
    });
  }
}

// Register routes
authRouter.post('/login', loginUser);

export default authRouter;