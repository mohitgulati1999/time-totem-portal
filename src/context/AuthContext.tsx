
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Auto-authenticate with admin for testing
  const defaultUser = {
    _id: 'admin123',
    username: 'Admin',
    email: 'admin@laneenos.com',
    role: 'admin' as const
  };
  
  const defaultToken = 'test-token-for-development';
  
  const [user, setUser] = useState<User | null>(defaultUser);
  const [token, setToken] = useState<string | null>(defaultToken);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Set to false initially for testing

  // We no longer need to fetch user on mount for testing
  useEffect(() => {
    // Set default authorization header for all requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${defaultToken}`;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      let userData: User;
      let tokenValue: string;
      
      // For testing, we'll simulate the login based on email
      if (email === 'admin@laneenos.com') {
        userData = {
          _id: 'admin123',
          username: 'Admin',
          email: 'admin@laneenos.com',
          role: 'admin'
        };
        tokenValue = 'admin-test-token';
      } else if (email.match(/^member\d+@gmail\.com$/)) {
        const memberNumber = email.match(/^member(\d+)@gmail\.com$/)[1];
        userData = {
          _id: `member${memberNumber}`,
          username: `Member ${memberNumber}`,
          email: email,
          role: 'user'
        };
        tokenValue = `member${memberNumber}-test-token`;
      } else {
        // Fall back to API call for non-hardcoded emails
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email,
          password
        });
        userData = response.data.user;
        tokenValue = response.data.token;
      }
      
      localStorage.setItem('auth_token', tokenValue);
      setToken(tokenValue);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
      toast.success('Logged in successfully');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // For testing, simulate registration
      const userData = {
        _id: 'new-user-123',
        username,
        email,
        role: 'user' as const
      };
      const tokenValue = 'new-user-test-token';
      
      localStorage.setItem('auth_token', tokenValue);
      setToken(tokenValue);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${tokenValue}`;
      toast.success('Registered successfully');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // For testing, we'll reset to admin user instead of fully logging out
    setUser(defaultUser);
    setToken(defaultToken);
    localStorage.setItem('auth_token', defaultToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${defaultToken}`;
    toast.info('Logged out and reset to admin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: true, // Always authenticated for testing
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
