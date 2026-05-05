import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('hub_users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { id: '1', email: 'admin@hub.com', password: 'admin', name: 'Admin User', role: 'Admin' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hub_users', JSON.stringify(users));
  }, [users]);

  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('current_user', JSON.stringify(foundUser));
          resolve(foundUser);
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 800);
    });
  };

  const signup = (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (users.find(u => u.email === userData.email)) {
          reject(new Error('User already exists'));
          return;
        }
        const newUser = {
          ...userData,
          id: Math.random().toString(36).substring(2, 9),
          role: userData.role || 'Employee' // Default role
        };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
        localStorage.setItem('current_user', JSON.stringify(newUser));
        resolve(newUser);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('current_user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const value = {
    user,
    users,
    login,
    signup,
    logout,
    loading,
    isAdmin: user?.role === 'Admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
