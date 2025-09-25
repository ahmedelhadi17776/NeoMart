import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          bootstrap: ['bootstrap'],
          // Feature-based chunks
          cart: ['./src/contexts/CartContext.jsx', './src/hooks/useCart.js'],
          wishlist: ['./src/contexts/WishlistContext.jsx'],
          auth: ['./src/contexts/AuthContext.jsx'],
          theme: ['./src/contexts/ThemeContext.jsx'],
          // Page chunks
          pages: [
            './src/pages/Home.jsx',
            './src/pages/Products.jsx',
            './src/pages/ProductDetails.jsx',
            './src/pages/Cart.jsx',
            './src/pages/Wishlist.jsx',
            './src/pages/Checkout.jsx',
            './src/pages/Login.jsx',
            './src/pages/Signup.jsx',
            './src/pages/Admin.jsx'
          ],
          // Component chunks
          components: [
            './src/components/Navbar.jsx',
            './src/components/LazyImage.jsx',
            './src/components/CartItem.jsx',
            './src/components/ErrorBoundary.jsx',
            './src/components/Skeleton.jsx'
          ]
        }
      }
    },
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    },
    // Enable source maps for production debugging
    sourcemap: false,
    // Chunk size warnings
    chunkSizeWarningLimit: 1000
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'bootstrap'
    ],
    exclude: ['@vite/client', '@vite/env', 'bootstrap-icons']
  },
  // CSS optimization
  css: {
    devSourcemap: true
  }
})
