import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('nutricart_user');
    const storedToken = localStorage.getItem('nutricart_token');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        setToken(response.token);
        localStorage.setItem('nutricart_user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('nutricart_token', response.token);
        }
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const signup = async (name, email, password, goals = [], dietary = []) => {
    try {
      const response = await authAPI.signup(name, email, password, goals, dietary);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        setToken(response.token);
        localStorage.setItem('nutricart_user', JSON.stringify(response.user));
        if (response.token) {
          localStorage.setItem('nutricart_token', response.token);
        }
        return { success: true };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create account' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('nutricart_user');
    localStorage.removeItem('nutricart_token');
  };

  const updateUser = async (updates) => {
    try {
      if (user && user._id) {
        const updatedUser = await authAPI.updateUser(user._id, updates);
        setUser(updatedUser);
        localStorage.setItem('nutricart_user', JSON.stringify(updatedUser));
      } else if (user) {
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        localStorage.setItem('nutricart_user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const addLoyaltyPoints = (points) => {
    if (user) {
      const newPoints = user.loyaltyPoints + points;
      let newTier = user.tier;
      if (newPoints >= 2000) newTier = 'platinum';
      else if (newPoints >= 1000) newTier = 'gold';
      else if (newPoints >= 500) newTier = 'silver';
      
      updateUser({ loyaltyPoints: newPoints, tier: newTier });
    }
  };

  const addOrderToHistory = (mealIds) => {
    if (user) {
      const updatedHistory = [...(user.orderHistory || []), ...mealIds];
      updateUser({ orderHistory: updatedHistory });
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    token,
    login,
    signup,
    logout,
    updateUser,
    addLoyaltyPoints,
    addOrderToHistory,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
