import { createContext, useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeContext = createContext();

export const themes = {
  gold: {
    primary: '#d4af37',
    secondary: '#f0c75e',
    accent: '#8a6d3b',
    background: '#fffdf7',
    text: '#333333',
    name: 'Gold'
  },
  midnight: {
    primary: '#2c3e50',
    secondary: '#34495e',
    accent: '#3498db',
    background: '#1a1a2e',
    text: '#ecf0f1',
    name: 'Midnight'
  },
  forest: {
    primary: '#2ecc71',
    secondary: '#27ae60',
    accent: '#f1c40f',
    background: '#f4f9f4',
    text: '#2c3e50',
    name: 'Forest'
  },
  spicy: {
    primary: '#e74c3c',
    secondary: '#c0392b',
    accent: '#f39c12',
    background: '#fff5f5',
    text: '#2c3e50',
    name: 'Spicy'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('gold');
  const [isChanging, setIsChanging] = useState(false);
  
  const changeTheme = (themeName) => {
    if (themes[themeName] && themeName !== currentTheme) {
      setIsChanging(true);
      setTimeout(() => {
        setCurrentTheme(themeName);
        setIsChanging(false);
      }, 300);
    }
  };
  
  // Apply theme to document
  useEffect(() => {
    const theme = themes[currentTheme];
    document.documentElement.style.setProperty('--color-primary', theme.primary);
    document.documentElement.style.setProperty('--color-secondary', theme.secondary);
    document.documentElement.style.setProperty('--color-accent', theme.accent);
    document.documentElement.style.setProperty('--color-background', theme.background);
    document.documentElement.style.setProperty('--color-text', theme.text);
  }, [currentTheme]);
  
  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      <AnimatePresence>
        {isChanging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50"
          />
        )}
      </AnimatePresence>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;