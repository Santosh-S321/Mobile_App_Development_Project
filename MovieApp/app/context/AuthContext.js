import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) setUser(JSON.parse(userData));
    } catch (e) {
      console.error('Failed to load user', e);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    // Validate inputs
    if (!username || username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters.');
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    // Check if user already exists
    const existing = await AsyncStorage.getItem(`user_${email}`);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = { username, email, createdAt: new Date().toISOString() };
    await AsyncStorage.setItem(`user_${email}`, JSON.stringify({ ...newUser, password }));
    await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const login = async (email, password) => {
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }
    if (!password || password.length < 1) {
      throw new Error('Please enter your password.');
    }

    const stored = await AsyncStorage.getItem(`user_${email}`);
    if (!stored) {
      throw new Error('No account found with this email. Please sign up first.');
    }

    const userData = JSON.parse(stored);
    if (userData.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    const currentUser = { username: userData.username, email: userData.email, createdAt: userData.createdAt };
    await AsyncStorage.setItem('currentUser', JSON.stringify(currentUser));
    setUser(currentUser);
    return currentUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
