import React from 'react';
import KPICards from '../components/Dashboard/KPICards';
import ScadenzeBandi from '../components/Dashboard/ScadenzeBandi';
import GraficoImporti from '../components/Dashboard/GraficoImporti';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <KPICards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScadenzeBandi />
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Azioni Rapide</h2>
          <div className="space-y-3">
            <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50">
              ➕ Nuovo Bando
            </button>
            <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50">
              👥 Nuovo Cliente
            </button>
            <button className="w-full text-left p-4 border rounded-lg hover:bg-gray-50">
              📥 Export Excel
            </button>
          </div>
        </div>
      </div>
      
      <GraficoImporti />
    </div>
  );
}
