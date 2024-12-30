// Simple auth state management
let isAuthenticated = false;
let currentUser = null;

export const login = (email, password) => {
  // Simulate authentication
  isAuthenticated = true;
  currentUser = { email };
  localStorage.setItem('user', JSON.stringify({ email }));
};

export const logout = () => {
  isAuthenticated = false;
  currentUser = null;
  localStorage.removeItem('user');
};

export const checkAuth = () => {
  const user = localStorage.getItem('user');
  if (user) {
    currentUser = JSON.parse(user);
    isAuthenticated = true;
  }
  return isAuthenticated;
};

export const getUser = () => currentUser;