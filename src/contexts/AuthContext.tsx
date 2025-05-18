
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert the AuthProvider to a proper functional component
export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local storage for saved user data
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.isAdmin || false);
    }
  }, []);

  const login = async (email: string, password: string, isAdmin?: boolean) => {
    // Check for admin credentials
    if (email === "admin@municipal.gov" && password === "admin123") {
      const adminUser = {
        id: 'admin1',
        name: 'Administrator',
        email: email,
        isAdmin: true
      };
      
      setUser(adminUser);
      setIsLoggedIn(true);
      setIsAdmin(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    
    // Regular user login (mock)
    else if (email && password) {
      // If isAdmin flag is provided during signup, use it
      const isAdminUser = isAdmin === true || 
                         email.endsWith("@municipal.gov") || 
                         email.endsWith("@gov.in");
      
      const mockUser = {
        id: '1',
        name: email.split('@')[0],
        email: email,
        isAdmin: isAdminUser
      };
      
      setUser(mockUser);
      setIsLoggedIn(true);
      setIsAdmin(isAdminUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
