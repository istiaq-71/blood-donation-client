import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase.config';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const storedUser = localStorage.getItem('user');
          const storedToken = localStorage.getItem('token');
          
          if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setLoading(false);
          } else {
            // Try to get user from backend
            const response = await api.get('/auth/me');
            if (response.data.success) {
              setUser(response.data.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      } else {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (userData) => {
    try {
      // Create Firebase user
      const { email, password } = userData;
      const firebaseCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Register in backend
      const response = await api.post('/auth/register', {
        ...userData,
        firebaseUID: firebaseCredential.user.uid
      });

      if (response.data.success) {
        const { user: newUser, token } = response.data.data;
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', token);
        toast.success('Registration successful!');
        return { success: true, user: newUser };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Sign in with Firebase
      const firebaseCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Login to backend
      const response = await api.post('/auth/login', {
        email,
        firebaseUID: firebaseCredential.user.uid
      });

      if (response.data.success) {
        const { user: loggedInUser, token } = response.data.data;
        setUser(loggedInUser);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        localStorage.setItem('token', token);
        toast.success('Login successful!');
        return { success: true, user: loggedInUser };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
      throw error;
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    firebaseUser,
    loading,
    register,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

