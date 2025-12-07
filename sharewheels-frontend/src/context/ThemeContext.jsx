import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // const [theme, setTheme] = useState(localStorage.getItem("theme") || "light"); -> dark/light mode toggle
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const html = document.documentElement;

    /* if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    } */

    html.classList.add("light");

    localStorage.setItem("theme", "light"); // change dark to theme
  }, [theme]);

  const toggleTheme = () => {
    // setTheme((prev) => (prev === "light" ? "dark" : "light"));    -> disabled
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
