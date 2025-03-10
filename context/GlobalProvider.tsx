import { getCurrentUser } from "@/api/services/user.service";
import { UserResponse } from "@/api/types/user.types";
import { createContext, useContext, useState, useEffect } from "react";

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  user: UserResponse | null;
  setUser: (user: any) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};

const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setUser(user);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.log("Error getting current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser, isLoading, setIsLoading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
