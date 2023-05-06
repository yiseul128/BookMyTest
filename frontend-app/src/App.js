/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 6
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
import RescheduleTest from './components/test/RescheduleTest';
import TestResult from './components/test/TestResult';
import TestHistory from './components/test/TestHistory';
import NavBar from './components/NavBar';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <Router>
        
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        
        <Routes>
          <Route path='/' element={<Navigate to="/history" />}/>
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/logout" element={<Logout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/signup" element={<Register />} />

          <Route path='/book-test' element={<ProtectedComponent comp={BookTest}/>}/>
          <Route path="/history" element={< ProtectedComponent comp={TestHistory} />}/>
          <Route path="/reschedule-test/:id" element={< ProtectedComponent comp={RescheduleTest} />} />
          <Route path="/test-result/:id" element={< ProtectedComponent comp={TestResult} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
