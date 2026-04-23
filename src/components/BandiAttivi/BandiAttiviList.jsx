import React, { useState } from 'react';
import { useBandiClienti } from '../../hooks/useBandiClienti';
import { formatDate, formatCurrency, getScadenzaStatus } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';
import ConfirmDialog from '../Shared/ConfirmDialog';
import BandoClienteForm from './BandoClienteForm';

export default function BandiAttiviList() {
  const { bandiClienti, loading, deleteBandoCliente } = useBandiClienti();
  const [deleteItem, setDeleteItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBandiClienti = bandiClienti.filter(bc =>
    bc.bandi?.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.clienti?.ragione_sociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.ruolo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  async function handleDelete() {
    if (deleteItem) {
      await deleteBandoCliente(deleteItem.bando_id, deleteItem.cliente_id);
      setDeleteItem(null);
    }
  }

  function handleEdit(item) {
    setEditingItem(item);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingItem(null);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bandi Attivi</h1>
          <p className="text-gray-600 mt-1">Relazione tra bandi e clienti</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          ➕ Associa Cliente a Bando
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <BandoClienteForm
            item={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <input
          type="text"
          placeholder="🔍 Cerca per bando, cliente o ruolo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {filteredBandiClienti.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Nessun bando attivo associato a clienti</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary-600 hover:text-primary-800"
          >
            Associa il primo cliente a un bando →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bando
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ruolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incaricato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scadenza
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importo
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
              {filteredBandiClienti.map((item) => {
                const scadenzaStatus = getScadenzaStatus(item.bandi?.scadenza_domanda);
                return (
                  <tr key={`${item.bando_id}-${item.cliente_id}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {item.bandi?.titolo || '-'}
                      </div>
                      {item.bandi?.codice_bando && (
                        <div className="text-sm text-gray-500">
                          {item.bandi.codice_bando}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {item.clienti?.ragione_sociale || '-'}
                      </div>
                      {item.clienti?.partita_iva && (
                        <div className="text-sm text-gray-500">
                          P.IVA {item.clienti.partita_iva}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.ruolo || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.bandi?.incaricato || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`${
                        scadenzaStatus === 'urgent' ? 'text-red-600 font-semibold' :
                        scadenzaStatus === 'warning' ? 'text-yellow-600 font-semibold' :
                        'text-gray-900'
                      }`}>
                        {formatDate(item.bandi?.scadenza_domanda)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatCurrency(item.bandi?.importo_totale_concesso)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.bandi?.stato === 'approvato' ? 'bg-green-100 text-green-800' :
                        item.bandi?.stato === 'respinto' ? 'bg-red-100 text-red-800' :
                        item.bandi?.stato === 'in_valutazione' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {item.bandi?.stato || 'n/d'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => setDeleteItem(item)}
                        className="text-red-600 hover:text-red-800"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Rimuovi Associazione"
        message={`Sei sicuro di voler rimuovere l'associazione tra "${deleteItem?.bandi?.titolo}" e "${deleteItem?.clienti?.ragione_sociale}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
