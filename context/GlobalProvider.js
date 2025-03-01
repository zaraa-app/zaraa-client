// @ts-nocheck
import { getCurrentUser } from "@/api/services/user.service";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const GlobalContext = createContext();

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log("Error getting current user:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
