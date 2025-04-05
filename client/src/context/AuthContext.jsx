import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          localStorage.removeItem('token');
          showToast('Session expired. Please login again.', 'error');
          setError('Session expired. Please login again.');
        }
      } catch (err) {
        console.error('Auth error:', err);
        // Only remove token if it's an authentication error
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          showToast('Session expired. Please login again.', 'error');
          setError('Session expired. Please login again.');
        } else {
          // For other errors (like network issues), keep the token and just show an error
          setError('Error connecting to server. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [showToast]); // Add showToast to dependency array

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/auth/register',
        userData
      );
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Registration failed',
      };
    }
  };

  // Login user
  const login = async (email, password, rememberMe) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      if (rememberMe) {
        localStorage.setItem('email', email);
      }
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed',
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;