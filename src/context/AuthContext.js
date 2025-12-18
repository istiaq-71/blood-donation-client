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
    // First, try to restore user from localStorage immediately (for page reload)
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Set user immediately to prevent redirect to login
        setUser(parsedUser);
        // Verify token is still valid in background
        api.get('/auth/me')
          .then((response) => {
            if (response.data.success) {
              setUser(response.data.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
          })
          .catch(() => {
            // Token invalid, but don't clear immediately - let Firebase check first
            console.warn('Token validation failed, checking Firebase auth state...');
          })
          .finally(() => {
            setLoading(false);
          });
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const currentStoredUser = localStorage.getItem('user');
          const currentStoredToken = localStorage.getItem('token');
          
          if (currentStoredUser && currentStoredToken) {
            // User already set from localStorage, just verify
            try {
              const response = await api.get('/auth/me');
              if (response.data.success) {
                setUser(response.data.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
              }
            } catch (error) {
              // If backend token invalid, try to get new token
              if (error.response?.status === 401) {
                // Token expired, but Firebase user still logged in
                // Try to login again with Firebase
                const response = await api.post('/auth/login', {
                  email: firebaseUser.email,
                  firebaseUID: firebaseUser.uid
                });
                if (response.data.success) {
                  setUser(response.data.data.user);
                  localStorage.setItem('user', JSON.stringify(response.data.data.user));
                  localStorage.setItem('token', response.data.data.token);
                }
              }
            }
          } else {
            // No stored user, fetch from backend
            const response = await api.get('/auth/me');
            if (response.data.success) {
              setUser(response.data.data.user);
              localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
          }
        } catch (error) {
          console.error('Error fetching user:', error);
          if (error.response?.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } else {
        // Firebase user logged out
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
      // Validate required fields
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('All required fields must be filled');
      }
      
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

