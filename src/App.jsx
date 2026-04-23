import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import Layout from './components/Shared/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BandoList from './components/Bandi/BandoList';
import BandoForm from './components/Bandi/BandoForm';
import BandoDetail from './components/Bandi/BandoDetail';
import ClienteList from './components/Clienti/ClienteList';
import ClienteForm from './components/Clienti/ClienteForm';
import EnteList from './components/Enti/EnteList';
import TipoContributoList from './components/TipiContributo/TipoContributoList';
import BandiAttiviList from './components/BandiAttivi/BandiAttiviList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rotta pubblica */}
          <Route path="/login" element={<Login />} />

          {/* Rotte protette */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/"                        element={<Dashboard />} />
                  <Route path="/bandi"                   element={<BandoList />} />
                  <Route path="/bandi/nuovo"             element={<BandoForm />} />
                  <Route path="/bandi/:id"               element={<BandoDetail />} />
                  <Route path="/bandi/:id/modifica"      element={<BandoForm />} />
                  <Route path="/bandi-attivi"            element={<BandiAttiviList />} />
                  <Route path="/clienti"                 element={<ClienteList />} />
                  <Route path="/clienti/nuovo"           element={<ClienteForm />} />
                  <Route path="/clienti/:id/modifica"    element={<ClienteForm />} />
                  <Route path="/enti"                    element={<EnteList />} />
                  <Route path="/tipi-contributo"         element={<TipoContributoList />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
