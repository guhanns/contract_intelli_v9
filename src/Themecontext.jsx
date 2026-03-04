import { createContext, useContext, useEffect, useState } from "react";
 
const ThemeContext = createContext();
 
export const useTheme = () => useContext(ThemeContext);
 
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "Dark"; // store match check
  });
 
  const toogleTheme = () => {
    setIsDarkMode((prevState) => !prevState);
  };
 
  const theme = isDarkMode ? "Dark" : "Light";
 
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDarkMode, theme]);
 
  return (
    <ThemeContext.Provider value={{ theme, toogleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
 