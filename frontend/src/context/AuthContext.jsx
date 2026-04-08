import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// This is the hook that components will use
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// This is the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login:', { email, password });
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      const { token, id, name } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify({ id, name, email }));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser({ id, name, email });
      
      // Redirect to tasks page
      window.location.href = '/tasks';
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Login failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = 'Cannot connect to backend. Make sure backend is running on port 5000';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('Attempting registration:', { name, email, password });
      
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      
      console.log('Registration response:', response.data);
      
      const { token, id } = response.data;
      
      // Store token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify({ id, name, email }));
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Update state
      setUser({ id, name, email });
      
      // Redirect to tasks page
      window.location.href = '/tasks';
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Registration failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.request) {
        errorMessage = 'Cannot connect to backend. Make sure backend is running on port 5000';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    window.location.href = '/';
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};