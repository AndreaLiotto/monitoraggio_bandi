import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClienti } from '../../hooks/useClienti';
import LoadingSpinner from '../Shared/LoadingSpinner';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function ClienteList() {
  const { clienti, loading, deleteCliente } = useClienti();
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const clientiFiltrati = clienti.filter(c =>
    c.ragione_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.partita_iva?.includes(searchTerm) ||
    c.codice_fiscale?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete() {
    if (deleteId) {
      await deleteCliente(deleteId);
      setDeleteId(null);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestione Clienti</h1>
        <Link
          to="/clienti/nuovo"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          ➕ Nuovo Cliente
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <input
          type="text"
          placeholder="🔍 Cerca cliente per ragione sociale, P.IVA o CF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ragione Sociale
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                P.IVA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Referente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Bandi
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Azioni
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientiFiltrati.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Nessun cliente trovato
                </td>
              </tr>
            ) : (
              clientiFiltrati.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {cliente.ragione_sociale}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {cliente.partita_iva || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {cliente.referente_nome || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {cliente.referente_email || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {cliente.bandi?.[0]?.count || 0} bandi
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Link
                      to={`/clienti/${cliente.id}/modifica`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </Link>
                    <button
                      onClick={() => setDeleteId(cliente.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Elimina Cliente"
        message="Sei sicuro di voler eliminare questo cliente?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
