import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBandi } from '../../hooks/useBandi';
import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function BandoList() {
  const { bandi, loading, error, deleteBando } = useBandi();
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const bandiFiltrati = bandi.filter(b =>
    b.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.codice_bando?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.ente_erogatore?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete() {
    if (deleteId) {
      await deleteBando(deleteId);
      setDeleteId(null);
    }
  }

  function getScadenzaStyle(data) {
    if (!data) return 'text-gray-900';
    const giorni = Math.ceil((new Date(data) - new Date()) / (1000 * 60 * 60 * 24));
    if (giorni < 7) return 'text-red-600 font-semibold';
    if (giorni < 14) return 'text-yellow-600 font-semibold';
    return 'text-gray-900';
  }

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <p className="text-red-700">{error}</p>
    </div>
  );

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

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Cerca per titolo, codice o ente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {bandiFiltrati.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          Nessun bando trovato
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titolo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scadenza Domanda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scadenza Rendicontazione</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bandiFiltrati.map((bando) => (
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
                    {bando.ente_erogatore?.nome || '-'}
                  </td>
                  <td className={`px-6 py-4 text-sm ${getScadenzaStyle(bando.scadenza_domanda)}`}>
                    {formatDate(bando.scadenza_domanda)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatDate(bando.scadenza_rendicontazione)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {bando.link_decreto ? (
                      <a
                        href={bando.link_decreto}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800"
                      >
                        🔗 Apri
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link to={`/bandi/${bando.id}/modifica`} className="text-blue-600 hover:text-blue-800">✏️</Link>
                    <button onClick={() => setDeleteId(bando.id)} className="text-red-600 hover:text-red-800">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Elimina Bando"
        message="Sei sicuro di voler eliminare questo bando?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
