import React from 'react';

export default function BandoFilters({ onFilterChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="font-medium mb-4">Filtri</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-700 mb-2">Stato</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Tutti</option>
            <option value="bozza">Bozza</option>
            <option value="presentato">Presentato</option>
            <option value="in_valutazione">In Valutazione</option>
            <option value="approvato">Approvato</option>
            <option value="respinto">Respinto</option>
            <option value="erogato">Erogato</option>
            <option value="chiuso">Chiuso</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Ente</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Tutti</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-2">Tipo</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Tutti</option>
          </select>
        </div>
      </div>
    </div>
  );
}
