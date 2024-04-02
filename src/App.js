import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AddressForm from './pages/AddressForm'; // Ensure the path is correct

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate replace to="/address-entry" />} />
        <Route path="/address-entry" element={<AddressForm />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
}


export default App;

