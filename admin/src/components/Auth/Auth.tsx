import { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  identifier: string | null;
  userId: string | null;
  token: string | null;
  login: (identifier: string, id: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("id"));
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  function isTokenExpired(token: string) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  }


  // useEffect(() => {
  //   const storedIsAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  //   const storedIdentifier = localStorage.getItem("identifier");
  //   const storedUserId = localStorage.getItem("id");
  //   const storedToken = localStorage.getItem("token");

  //   console.log("Token from localStorage:", storedToken);

  //   if (storedToken && isTokenExpired(storedToken)) {
  //     logout();
  //     console.log("Token is invalid or expired");
  //   } else if (storedIsAuthenticated && storedIdentifier && storedUserId && storedToken) {
  //     setIsAuthenticated(true);
  //     setIdentifier(storedIdentifier);
  //     setUserId(storedUserId);
  //     setToken(storedToken);
  //     console.log("User is authenticated");
  //   }
  //   // if (storedIsAuthenticated && storedIdentifier && storedUserId && storedToken) {
  //   //   setIsAuthenticated(true);
  //   //   setIdentifier(storedIdentifier);
  //   //   setUserId(storedUserId);
  //   //   setToken(storedToken);
  //   // }
  // }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedIdentifier = localStorage.getItem("identifier");
    const storedUserId = localStorage.getItem("id");
    

    // Kontrollera om token finns och om den är giltig
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setIdentifier(storedIdentifier);
      setUserId(storedUserId);
      setIsAuthenticated(true); // Sätt användaren som autentiserad om token är giltig
    } else {
      // Token är ogiltig eller finns inte, logga ut
      logout();
    }
  }, []);

  const login = (identifier: string, userId: string, token: string) => {
    setIsAuthenticated(true);
    setIdentifier(identifier);
    setUserId(userId);
    setToken(token);
    // localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("identifier", identifier);
    localStorage.setItem("id", userId);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIdentifier(null);
    setUserId(null);
    setToken(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("identifier");
    localStorage.removeItem('token');
    localStorage.removeItem('id');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, identifier, userId, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
