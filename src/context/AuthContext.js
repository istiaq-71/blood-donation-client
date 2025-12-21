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
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;
      
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          const storedUser = localStorage.getItem('user');
          const storedToken = localStorage.getItem('token');
          
          if (storedUser && storedToken) {
            if (isMounted) {
              setUser(JSON.parse(storedUser));
              setLoading(false);
            }
          } else {
            // Try to get user from backend
            try {
              const token = localStorage.getItem('token');
              if (token) {
                const response = await api.get('/auth/me');
                if (response.data.success && isMounted) {
                  setUser(response.data.data.user);
                  localStorage.setItem('user', JSON.stringify(response.data.data.user));
                  setLoading(false);
                } else if (isMounted) {
                  setLoading(false);
                }
              } else {
                // No token, set loading to false
                if (isMounted) {
                  setLoading(false);
                }
              }
            } catch (apiError) {
              // If API call fails (401, network error, etc.), clear auth and set loading to false
              if (isMounted) {
                console.error('Error fetching user:', apiError);
                // Only clear if it's an auth error, not network error
                if (apiError.response?.status === 401) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                }
                setLoading(false);
              }
            }
          }
        } catch (error) {
          console.error('Error in auth state change:', error);
          if (isMounted) {
            setLoading(false);
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
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
      let errorMessage = 'Registration failed';
      
      // Handle Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check your email.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Registration error:', {
        code: error.code,
        message: error.message,
        response: error.response?.data
      });
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Sign in with Firebase first
      const firebaseCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Login to backend
      try {
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
      } catch (apiError) {
        // If backend login fails, sign out from Firebase to prevent inconsistent state
        await firebaseSignOut(auth);
        
        let errorMessage = 'Backend login failed.';
        
        // Check for network errors
        if (!apiError.response) {
          errorMessage = 'Cannot connect to server. Please check your internet connection and try again.';
        } else if (apiError.response.status === 404) {
          errorMessage = 'User not found in database. Please register first.';
        } else if (apiError.response.status === 403) {
          errorMessage = 'Your account has been blocked. Please contact admin.';
        } else if (apiError.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }
        
        console.error('Backend login error:', {
          status: apiError.response?.status,
          message: apiError.response?.data?.message,
          error: apiError.message,
          url: apiError.config?.url
        });
        
        toast.error(errorMessage);
        throw apiError;
      }
    } catch (error) {
      // Handle Firebase errors
      let errorMessage = 'Login failed';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please register first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address. Please check your email.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('Login error:', {
        code: error.code,
        message: error.message,
        response: error.response?.data
      });
      
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

