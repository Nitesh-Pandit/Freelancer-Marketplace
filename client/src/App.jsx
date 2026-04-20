import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
import Login from './Login';
import Signup from './Signup';
import HomePage from './HomePage';
import CompleteProfile from './CompleteProfile';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'login', 'signup', 'home', 'complete-profile'
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Check if user is already logged in on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        
        // If freelancer and profile not complete, go to complete-profile page
        if (parsedUser.role === 'freelancer' && !parsedUser.profileComplete) {
          setCurrentPage('complete-profile');
        } else {
          setCurrentPage('home');
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginClick = () => setCurrentPage('login');
  const handleSignupClick = () => setCurrentPage('signup');
  const handleClose = () => setCurrentPage('landing');

  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    
    // Save to localStorage
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // If freelancer and profile not complete, go to complete-profile page
    if (userData.role === 'freelancer' && !userData.profileComplete) {
      setCurrentPage('complete-profile');
    } else {
      setCurrentPage('home');
    }
  };

  const handleProfileComplete = (updatedUser) => {
    setUser(updatedUser);
    // Update localStorage with updated user data
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    setCurrentPage('landing');
  };

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <LandingPage 
          onLoginClick={handleLoginClick} 
          onSignupClick={handleSignupClick}
        />
      )}
      
      {currentPage === 'login' && (
        <Login 
          onClose={handleClose}
          onSignupClick={handleSignupClick}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {currentPage === 'signup' && (
        <Signup 
          onClose={handleClose}
          onLoginClick={handleLoginClick}
        />
      )}

      {currentPage === 'complete-profile' && user && token && (
        <CompleteProfile 
          user={user}
          token={token}
          onProfileComplete={handleProfileComplete}
        />
      )}

      {currentPage === 'home' && user && (
        <HomePage 
          user={user}
          token={token}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
