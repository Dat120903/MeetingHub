import { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/Dashboard';
import UserDashboard from './components/user/Dashboard';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import { users } from './data/mockData';

function App() {
  const [user, setUser] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  // Check if user is already logged in from localStorage
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLogin = (username, password) => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const handleRegister = (userData) => {
    // In a real app, this would send data to a server
    console.log('Registering user:', userData);
    // For now, just simulate successful registration
    setIsLoginView(true);
    return true;
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {!user ? (
          isLoginView ? (
            <Login onLogin={handleLogin} onToggleView={toggleView} />
          ) : (
            <Register onRegister={handleRegister} onToggleView={toggleView} />
          )
        ) : user.role === 'admin' ? (
          <AdminDashboard user={user} />
        ) : (
          <UserDashboard user={user} />
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default App; 