/**
 * Developer Name: Yiseul Ko
 * Date: 2023 May 12
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
import AdminProtectedComponent from './components/AdminProtectedComponent';
import TestCentres from './components/testCentre/TestCentres';
import AddTestCentre from './components/testCentre/AddTestCentre';
import UpdateTestCentre from './components/testCentre/UpdateTestCentre';
import Certifications from './components/certification/Certifications';
import AddCertification from './components/certification/AddCertification';
import UpdateCertification from './components/certification/UpdateCertification';
import Profile from './components/auth/Profile';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <AuthProvider>
      <Router>
        
        <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        
        <Routes>
          <Route path='/' element={<Navigate to="/certifications" />}/>
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/logout" element={<Logout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path="/signup" element={<Register />} />
          <Route path='/profile' element={<ProtectedComponent comp={Profile} />} />

          <Route path='/book-test' element={<ProtectedComponent comp={BookTest}/>}/>
          <Route path="/history" element={< ProtectedComponent comp={TestHistory} />}/>
          <Route path="/reschedule-test/:id" element={< ProtectedComponent comp={RescheduleTest} />} />
          <Route path="/test-result/:id" element={< ProtectedComponent comp={TestResult} />} />

          <Route path='/test-centres' element={<AdminProtectedComponent comp={TestCentres} />} />
          <Route path='/add-test-centre' element={<AdminProtectedComponent comp={AddTestCentre} />} />
          <Route path="/update-test-centre/:id" element={< AdminProtectedComponent comp={UpdateTestCentre} />} />
          
          <Route path='/certifications' element={<AdminProtectedComponent comp={Certifications} />} />
          <Route path='/add-certification' element={<AdminProtectedComponent comp={AddCertification} />} />
          <Route path='/update-certification/:id' element={<AdminProtectedComponent comp={UpdateCertification} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
