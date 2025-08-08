import Header from "@/components/layout/Header";
import Cart from "@/components/cart/Cart";
import "./globals.css";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Kota Store - Modern Essentials",
  description: "Shop our curated collection of high-quality products.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-neutral text-primary-dark">
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <footer className="bg-primary-dark text-neutral py-10">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Kota</h3>
                    <p className="text-sm text-neutral-dark">
                      Modern essentials for your lifestyle.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Shop</h4>
                    <ul className="space-y-2 text-sm text-neutral-dark">
                      <li>
                        <a href="#" className="hover:text-neutral">
                          All Products
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-neutral">
                          Featured
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-neutral">
                          New Arrivals
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">About</h4>
                    <ul className="space-y-2 text-sm text-neutral-dark">
                      <li>
                        <a href="#" className="hover:text-neutral">
                          Our Story
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-neutral">
                          Contact
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-neutral">
                          Careers
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Help</h4>
                    <ul className="space-y-2 text-sm text-neutral-dark">
                      <li>
                        <a href="#" className="hover:text-neutral">
                          Shipping
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-neutral">
                          Returns
                        </a>
                      </li>
                      <li>
                        <a href="#" className="hover:text-neutral">
                          FAQ
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t border-neutral-dark/30 mt-8 pt-6 text-sm text-center text-neutral-dark">
                  <p>
                    © {new Date().getFullYear()} Kota Store. Demo project using
                    Fake Store API.
                  </p>
                  <p className="mt-1">
                    Current Date: 2025-08-08 01:47:05 | User: aravindasiva
                  </p>
                </div>
              </div>
            </footer>
            <Cart />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
