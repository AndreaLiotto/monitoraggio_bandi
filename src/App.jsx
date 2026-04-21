import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Shared/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <route path="/" element={<Dashboard />} />
          {/* Altre route verranno aggiunte man mano */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
