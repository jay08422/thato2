import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import UserManagement from './UserManagement';
import ProductManagement from './ProductManagement';
import PurchasesManagement from './PurchasesManagement';



const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/* Login/Registration route */}
          <Route path="/" element={<Login />} />

          {/* Dashboard route */}
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/UserManagement" element={<UserManagement />} />
          <Route path="/ProductManagement" element={<ProductManagement />} />
          <Route path="/PurchasesManagement" element={<PurchasesManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
