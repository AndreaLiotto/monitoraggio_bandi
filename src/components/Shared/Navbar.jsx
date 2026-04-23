import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/bandi', label: 'Bandi' },
    { path: '/bandi-attivi', label: 'Bandi Attivi' },
    { path: '/clienti', label: 'Clienti' },
    { path: '/enti', label: 'Enti Erogatori' },
    { path: '/tipi-contributo', label: 'Tipi Contributo' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              📊 Monitoraggio Bandi
            </Link>
            <div className="hidden md:flex space-x-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Utente + Logout */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 hidden md:block">
              {user?.email}
            </span>
            <button
              onClick={signOut}
              className="text-sm text-gray-600 hover:text-red-600 px-3 py-1.5 rounded-md border border-gray-200 hover:border-red-300 transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
