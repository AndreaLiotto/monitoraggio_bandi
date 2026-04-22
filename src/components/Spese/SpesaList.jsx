import React from 'react';
import { useSpese } from '../../hooks/useSpese';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';

export default function SpesaList({ bandoId }) {
  const { spese, loading } = useSpese(bandoId);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Spese del Bando</h3>
        <button className="text-primary-600 hover:text-primary-800">
          ➕ Aggiungi Spesa
        </button>
      </div>

      {spese.length === 0 ? (
        <p className="text-gray-500">Nessuna spesa registrata</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrizione</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Richiesto</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Concesso</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">%</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {spese.map(spesa => (
              <tr key={spesa.id}>
                <td className="px-4 py-2 text-sm">{spesa.descrizione}</td>
                <td className="px-4 py-2 text-sm">{spesa.cliente?.ragione_sociale}</td>
                <td className="px-4 py-2 text-sm">{formatCurrency(spesa.importo_richiesto)}</td>
                <td className="px-4 py-2 text-sm">{formatCurrency(spesa.importo_concesso)}</td>
                <td className="px-4 py-2 text-sm">{formatPercentage(spesa.percentuale_agevolazione)}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    spesa.stato === 'approvata' ? 'bg-green-100 text-green-800' :
                    spesa.stato === 'respinta' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {spesa.stato}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
