/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 5
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import './App.css';
import { AuthProvider } from './AuthContext';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BookTest from './components/test/BookTest';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Register from './components/auth/Register';
import ProtectedComponent from './components/ProtectedComponent';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Navigate to="/book-test" />}/>
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/logout" element={<Logout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/signup" element={<Register />} />

          <Route path='/book-test' element={<ProtectedComponent comp={BookTest}/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
