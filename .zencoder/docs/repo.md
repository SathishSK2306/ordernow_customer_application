npm# OrderNow Customer Application Information

## Summary

OrderNow is a React-based food ordering application built with Vite. It provides a customer-facing interface for browsing food categories, viewing food items, and placing orders. The application uses modern React features and follows a component-based architecture.

## Structure

- **src/**: Main source code directory
  - **components/**: Reusable UI components (Navbar, FoodItem, CategorySection, etc.)
  - **pages/**: Page components (Home, CategoryPage, FoodDetails)
  - **assets/**: Static assets including images
- **public/**: Static files served directly
- **root/**: Configuration files for build tools and dependencies

## Language & Runtime

**Language**: JavaScript (JSX)
**Version**: ES Modules
**Build System**: Vite 7.0.0
**Package Manager**: npm

## Dependencies

**Main Dependencies**:

- react: ^19.1.0
- react-dom: ^19.1.0
- react-router-dom: ^7.6.3
- framer-motion: ^12.23.0
- react-icons: ^5.5.0

**Development Dependencies**:

- vite: ^7.0.0
- @vitejs/plugin-react: ^4.5.2
- eslint: ^9.29.0
- tailwindcss: ^3.4.1
- postcss: ^8.5.6
- autoprefixer: ^10.4.21

## Build & Installation

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Application Structure

**Entry Point**: src/main.jsx
**Routing**: React Router with the following routes:

- `/`: Home page
- `/category/:categoryName`: Category listing page
- `/food/:foodId`: Food item details page

**UI Framework**: TailwindCSS with custom color extensions
**Animation**: Framer Motion for page transitions

## Key Components

- **Navbar**: Main navigation component
- **HeroSlider**: Featured content slider on home page
- **CategorySection**: Displays food categories
- **FoodItem**: Individual food item card
- **BackToTop**: Utility component for scrolling back to top

## Styling

**CSS Framework**: TailwindCSS 3.4.1
**Configuration**: Custom color palette with gold theme colors
**Post-processing**: PostCSS with autoprefixer
