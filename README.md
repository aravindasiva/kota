# Kota Store - Modern E-Commerce Application

![alt text](image.png)![alt text](image-1.png)
![alt text](image-2.png)![alt text](image-3.png)

[Kota Store Preview](https://via.placeholder.com/1200x630?text=Kota+Store+Preview)

A modern e-commerce application built with Next.js, featuring a responsive design, seamless cart management, and user authentication. This application demonstrates a complete MCP (Model-Context-Protocol) architecture by integrating with the FakeStore API.

## 🌟 Features

- **User Authentication** - Complete login system with session management
- **Product Browsing** - View all products with filtering and sorting capabilities
- **Product Details** - Detailed product view with image magnification and related products
- **Shopping Cart** - Add, remove, and modify items in your cart
- **Responsive Design** - Works beautifully on all devices
- **Advanced UI Features**:
  - Image magnification on hover
  - Animated backgrounds
  - Custom scrollbars
  - Smooth animations and transitions
  - "Scroll to top" functionality
  - Product recommendations

## 🚀 Demo

![Demo GIF](https://via.placeholder.com/800x450?text=Demo+GIF)

[View Live Demo](https://github.com/aravindasiva/kota)

## 🛠️ Technology Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - React 18
  - TailwindCSS for styling
  - Framer Motion for animations
  - Context API for state management

- **Backend Integration:**
  - FakeStore API for product data
  - Custom MCP server implementation

- **Tools:**
  - NX Monorepo for project management
  - ESLint for code quality
  - Prettier for code formatting

## 📂 Project Structure

The project follows a monorepo structure using NX:

\`\`\`
kota/
├── apps/
│   ├── kota-api/        # Express API server (MCP implementation)
│   │   ├── src/
│   │   │   ├── controllers/  # API controllers
│   │   │   ├── models/       # Data models
│   │   │   ├── routes/       # API routes
│   │   │   └── main.ts       # Entry point
│   ├── kota-web/        # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/          # Next.js app router
│   │   │   ├── components/   # React components
│   │   │   ├── context/      # React context providers
│   │   │   ├── utils/        # Utility functions
│   │   │   └── styles/       # Global styles
├── libs/                # Shared libraries
└── nx.json              # NX configuration
\`\`\`

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- NX CLI (optional for monorepo commands)

### Environment Variables

Create a \`.env\` file in both the \`apps/kota-api\` and \`apps/kota-web\` directories:

For \`apps/kota-api/.env\`:
\`\`\`
PORT=3001
NODE_ENV=development
FAKESTORE_API_URL=https://fakestoreapi.com
\`\`\`

For \`apps/kota-web/.env.local\`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:3001/api
\`\`\`

### Installation Steps

1. Clone the repository:
\`\`\`bash
git clone https://github.com/aravindasiva/kota.git
cd kota
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Start the development servers:
\`\`\`bash
# Start both API and web applications
npx nx run-many --target=serve --projects=kota-api,kota-web --parallel

# Or start them individually
npx nx serve kota-api
npx nx serve kota-web
\`\`\`

4. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API: [http://localhost:3001/api](http://localhost:3001/api)

## 🌐 API Integration

This application uses the FakeStore API through a custom MCP server implementation. The API provides:

- Product catalog and details
- User authentication
- Shopping cart management

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| \`/api/products\` | GET | Get all products |
| \`/api/products/:id\` | GET | Get product details |
| \`/api/products/category/:category\` | GET | Get products by category |
| \`/api/auth/login\` | POST | User login |
| \`/api/auth/register\` | POST | User registration |
| \`/api/cart\` | GET | Get user's cart |
| \`/api/cart\` | POST | Add item to cart |
| \`/api/cart/:id\` | DELETE | Remove item from cart |

## 🧪 Testing

\`\`\`bash
# Run all tests
npx nx run-many --target=test --all

# Run tests for a specific project
npx nx test kota-web
npx nx test kota-api
\`\`\`

## 📱 Mobile Responsiveness

![Mobile Preview](https://via.placeholder.com/400x800?text=Mobile+View)

The application is fully responsive and optimized for:
- Desktop
- Tablet
- Mobile devices

## ✨ User Experience Improvements

- **Product Image Magnifier**: Zoom in on product images for detailed viewing
- **Animated Background**: Subtle, flowing background animations enhance the visual experience
- **Custom Scrollbars**: Sleek, modern scrollbars for better navigation
- **Related Products**: Product recommendations based on browsing history
- **Intuitive Cart**: Easy-to-use cart with quantity adjustments and quick removal
- **Smooth Animations**: Page transitions and UI interactions use subtle animations

## 🔒 Security Features

- Secure authentication flow
- Protected API endpoints
- Input validation and sanitization

## 🚦 Project Status

This project was developed to demonstrate fullstack development skills.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [FakeStore API](https://fakestoreapi.com/) for providing product data
- [Next.js](https://nextjs.org/) for the frontend framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📞 Contact

Aravinda Siva - [GitHub](https://github.com/aravindasiva)

Project Link: [https://github.com/aravindasiva/kota](https://github.com/aravindasiva/kota)

---

Made with ❤️ by aravindasiva