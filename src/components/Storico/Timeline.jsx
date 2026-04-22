import React from 'react';
import { useStorico } from '../../hooks/useStorico';
import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';

export default function Timeline({ bandoId }) {
  const { storico, loading } = useStorico(bandoId);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Storico Aggiornamenti</h3>
        <button className="text-primary-600 hover:text-primary-800">
          ➕ Aggiungi Aggiornamento
        </button>
      </div>

      {storico.length === 0 ? (
        <p className="text-gray-500">Nessun aggiornamento registrato</p>
      ) : (
        <div className="space-y-4">
          {storico.map(item => (
            <div key={item.id} className="flex">
              <div className="flex-shrink-0 w-2 bg-primary-600 rounded-full mr-4"></div>
              <div className="flex-1 pb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{item.titolo}</h4>
                    <span className="text-xs text-gray-500">{formatDate(item.created_at)}</span>
                  </div>
                  {item.descrizione && (
                    <p className="text-sm text-gray-600">{item.descrizione}</p>
                  )}
                  {item.autore && (
                    <p className="text-xs text-gray-500 mt-2">👤 {item.autore}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
