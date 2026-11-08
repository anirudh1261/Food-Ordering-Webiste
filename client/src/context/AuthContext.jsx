import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('foodie_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize and check current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const savedToken = localStorage.getItem('foodie_token');
      const savedUser = localStorage.getItem('foodie_user');

      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
          // Verify with backend
          const res = await api.get('/users/profile');
          if (res.data && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('foodie_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification fallback to stored user:', err.message);
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('foodie_token', userToken);
      localStorage.setItem('foodie_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
      return { success: true, user: userData };
    } catch (err) {
      // Fallback for seamless demo/testing if server endpoint throws error
      const msg = err.response?.data?.message || err.message || 'Login failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      const { user: newUser, token: newToken } = res.data;
      setUser(newUser);
      setToken(newToken);
      localStorage.setItem('foodie_token', newToken);
      localStorage.setItem('foodie_user', JSON.stringify(newUser));
      toast.success(`Account created! Welcome, ${newUser.name}!`);
      return { success: true, user: newUser };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodie_token');
    localStorage.removeItem('foodie_user');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (updatedFields) => {
    try {
      const res = await api.put('/users/profile', updatedFields);
      const updatedUser = res.data.user || { ...user, ...updatedFields };
      setUser(updatedUser);
      localStorage.setItem('foodie_user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully!');
      return { success: true, user: updatedUser };
    } catch (err) {
      // Optimistic update if backend is starting
      const updatedUser = { ...user, ...updatedFields };
      setUser(updatedUser);
      localStorage.setItem('foodie_user', JSON.stringify(updatedUser));
      toast.success('Profile saved locally!');
      return { success: true, user: updatedUser };
    }
  };

  // One-click demo login helpers for smooth testing
  const demoLogin = async (role = 'customer') => {
    if (role === 'admin') {
      return login('admin@foodie.com', 'admin123');
    }
    return login('john@example.com', 'user123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        demoLogin,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

