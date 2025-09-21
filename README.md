# ⚡ FLUX - Modern Shopping Experience

A cutting-edge React-based eCommerce web application featuring dark mode aesthetics, glass morphism design, and modern UI elements. Built with Vite, Bootstrap, and React Router DOM.

## 🚀 Features

- **Product Catalog**: Browse and search products
- **Product Details**: View detailed product information
- **Shopping Cart**: Add/remove items and adjust quantities
- **Authentication**: Mock signup/login with localStorage
- **Search & Filter**: Find products by title, price, and category
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend**: React 19.1.1
- **Build Tool**: Vite 4.5.0
- **Styling**: Bootstrap 5.3.8
- **Icons**: React Bootstrap Icons
- **Routing**: React Router DOM 6.20.1
- **State Management**: React Hooks (useState, useEffect, Context API)
- **Theme Management**: Custom Theme Context with localStorage persistence

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation bar with cart preview & theme toggle
├── pages/
│   ├── Home.jsx            # Product listing page
│   ├── ProductDetails.jsx # Individual product view
│   ├── Cart.jsx           # Shopping cart
│   ├── Login.jsx          # User authentication
│   └── Signup.jsx         # User registration
├── contexts/
│   └── ThemeContext.jsx   # Dark/light mode theme management
├── data/
│   └── products.json      # Sample product data
├── App.jsx                # Main app component with routing
└── App.css               # Custom styles
```

## 🚀 Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to `http://localhost:5173/`

## 🎨 Design System - Gradient Dreams Theme

### **Light Mode**

- **Primary Gradient**: #667EEA → #764BA2 (Purple to violet)
- **Secondary**: #F72585 (Hot pink - CTAs)
- **Accent**: #00D9FF (Cyan - notifications)
- **Background**: #FAFAFA (Light neutral)
- **Text**: #1A1A2E (Dark neutral)
- **Success**: #00F5A0 (Neon green)

### **Dark Mode**

- **Primary Gradient**: #667EEA → #764BA2 (Purple to violet)
- **Secondary**: #F72585 (Hot pink - CTAs)
- **Accent**: #00D9FF (Cyan - notifications)
- **Background**: #0F172A (Dark slate)
- **Text**: #F1F5F9 (Off-white)
- **Success**: #00F5A0 (Neon green)

### Modern UI Features:

- **Dual Theme Support**: Seamless switching between light and dark modes
- **Theme Persistence**: User preference saved in localStorage
- **Glass Morphism**: Translucent cards with backdrop blur effects
- **Gradient Text**: Dynamic gradient text for headings and branding
- **Micro-animations**: Smooth 0.3s transitions and hover effects
- **Neon Glow**: Subtle glow effects on interactive elements
- **Theme Toggle**: Intuitive sun/moon icon toggle in navbar

## 👥 Team Development

This project is designed for team collaboration with assigned roles:

- **Ahmed**: Project setup, routing, navbar
- **Shahd**: Product listing, search/filter, product details
- **Mohamed**: Wishlist features
- **Mostafa**: Shopping cart, checkout
- **Akram**: Authentication, admin panel

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

Ready for deployment on:

- Netlify
- Vercel
- Any static hosting service

## 🎯 Design Philosophy

FLUX represents the future of eCommerce with its:

- **Adaptive Design**: Dual theme support for user preference
- **Modern Aesthetics**: Premium color palette with gradient accents
- **Glass Morphism**: Translucent UI elements with depth
- **Smooth Interactions**: Micro-animations and hover effects
- **Typography**: Space Grotesk for headers, Inter for body text
- **Responsive Design**: Seamless experience across all devices
- **Accessibility**: High contrast ratios and focus indicators

## 📄 License

This project is part of a team learning exercise for React development, showcasing modern web design trends and best practices.
