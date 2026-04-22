import React from 'react';
import { useTipiContributo } from '../../hooks/useTipiContributo';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';

export default function TipoContributoList() {
  const { tipi, loading } = useTipiContributo();

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tipi di Contributo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tipi.map(tipo => (
          <div key={tipo.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-2">{tipo.nome}</h3>
            {tipo.percentuale_copertura && (
              <p className="text-sm text-gray-600">Copertura: {formatPercentage(tipo.percentuale_copertura)}</p>
            )}
            {tipo.massimale_euro && (
              <p className="text-sm text-gray-600">Massimale: {formatCurrency(tipo.massimale_euro)}</p>
            )}
            {tipo.descrizione && (
              <p className="text-sm text-gray-600 mt-2">{tipo.descrizione}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
