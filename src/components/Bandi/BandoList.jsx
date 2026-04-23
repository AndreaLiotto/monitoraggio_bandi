import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBandi } from '../../hooks/useBandi';
import { formatDate, formatCurrency, getScadenzaStatus } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function BandoList() {
  const { bandi, loading, error } = useBandi();
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const bandiFiltrati = bandi.filter(b => 
    b.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.codice_bando?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete() {
    if (deleteId) {
      await deleteBando(deleteId);
      setDeleteId(null);
    }
  }

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            ⚠️ Errore nel caricamento dei bandi
          </h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Ricarica Pagina
          </button>
        </div>
      </div>
    );
  }

  console.log('🔍 BandoList render:', {
    totalBandi: bandi.length,
    bandiFiltrati: bandiFiltrati.length,
    searchTerm
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestione Bandi</h1>
        <Link
          to="/bandi/nuovo"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          ➕ Nuovo Bando
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <input
          type="text"
          placeholder="🔍 Cerca bando per titolo o codice..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Titolo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Incaricato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scadenza
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Importo Concesso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stato
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bandiFiltrati.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Nessun bando trovato
                </td>
              </tr>
            ) : (
              bandiFiltrati.map((bando) => {
                const scadenzaStatus = getScadenzaStatus(bando.scadenza_domanda);
                return (
                  <tr key={bando.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link to={`/bandi/${bando.id}`} className="text-primary-600 hover:text-primary-800 font-medium">
                        {bando.titolo}
                      </Link>
                      {bando.codice_bando && (
                        <p className="text-sm text-gray-500">{bando.codice_bando}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {bando.incaricato || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {bando.ente_erogatore?.nome || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`${
                        scadenzaStatus === 'urgent' ? 'text-red-600 font-semibold' :
                        scadenzaStatus === 'warning' ? 'text-yellow-600 font-semibold' :
                        'text-gray-900'
                      }`}>
                        {formatDate(bando.scadenza_domanda)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(bando.importo_totale_concesso)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        bando.stato === 'approvato' ? 'bg-green-100 text-green-800' :
                        bando.stato === 'respinto' ? 'bg-red-100 text-red-800' :
                        bando.stato === 'in_valutazione' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {bando.stato}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        to={`/bandi/${bando.id}/modifica`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </Link>
                      <button
                        onClick={() => setDeleteId(bando.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Elimina Bando"
        message="Sei sicuro di voler eliminare questo bando? Questa azione non può essere annullata."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
