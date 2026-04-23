import React, { useState } from 'react';
import { useBandiClienti } from '../../hooks/useBandiClienti';
import { formatDate, formatCurrency } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';
import ConfirmDialog from '../Shared/ConfirmDialog';
import BandoClienteForm from './BandoClienteForm';

const STATO_BADGE = {
  bozza:                      'bg-gray-100 text-gray-700',
  presentato:                 'bg-blue-100 text-blue-700',
  concesso:                   'bg-green-100 text-green-700',
  negato:                     'bg-red-100 text-red-700',
  in_attesa_di_documentazione:'bg-yellow-100 text-yellow-700',
  perso:                      'bg-orange-100 text-orange-700',
  non_interessato:            'bg-purple-100 text-purple-700',
};

const STATO_LABEL = {
  bozza:                      'Bozza',
  presentato:                 'Presentato',
  concesso:                   'Concesso',
  negato:                     'Negato',
  in_attesa_di_documentazione:'In attesa doc.',
  perso:                      'Perso',
  non_interessato:            'Non interessato',
};

export default function BandiAttiviList() {
  const { bandiClienti, loading, deleteBandoCliente, fetchBandiClienti } = useBandiClienti();
  const [deleteItem, setDeleteItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Colonne collassabili
  const [bandiExpanded, setBandiExpanded] = useState(true);
  const [clientiExpanded, setClientiExpanded] = useState(true);

  const filtered = bandiClienti.filter(bc =>
    bc.bandi?.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.clienti?.ragione_sociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bc.incaricato?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getScadenzaStyle(data) {
    if (!data) return 'text-gray-900';
    const giorni = Math.ceil((new Date(data) - new Date()) / (1000 * 60 * 60 * 24));
    if (giorni < 7) return 'text-red-600 font-semibold';
    if (giorni < 14) return 'text-yellow-600 font-semibold';
    return 'text-gray-900';
  }

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
    fetchBandiClienti();
    setShowForm(false);
    setEditingItem(null);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bandi Attivi</h1>
          <p className="text-gray-600 mt-1">Bandi associati ai clienti</p>
        </div>
        <button
          onClick={() => { setEditingItem(null); setShowForm(true); }}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          ➕ Nuovo Bando Attivo
        </button>
      </div>

      {/* FORM INLINE */}
      {showForm && (
        <div className="mb-6">
          <BandoClienteForm
            item={editingItem}
            onSuccess={handleFormSuccess}
            onCancel={() => { setShowForm(false); setEditingItem(null); }}
          />
        </div>
      )}

      {/* SEARCH */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Cerca per bando, cliente o incaricato..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* CONTROLLI COLONNE */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setBandiExpanded(!bandiExpanded)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            bandiExpanded
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'bg-gray-50 border-gray-300 text-gray-600'
          }`}
        >
          {bandiExpanded ? '◀ Collassa Bando' : '▶ Espandi Bando'}
        </button>
        <button
          onClick={() => setClientiExpanded(!clientiExpanded)}
          className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
            clientiExpanded
              ? 'bg-primary-50 border-primary-300 text-primary-700'
              : 'bg-gray-50 border-gray-300 text-gray-600'
          }`}
        >
          {clientiExpanded ? '◀ Collassa Cliente' : '▶ Espandi Cliente'}
        </button>
      </div>

      {/* TABELLA */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          <p className="mb-4">Nessun bando attivo trovato</p>
          <button onClick={() => setShowForm(true)} className="text-primary-600 hover:text-primary-800">
            Crea il primo bando attivo →
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {/* GRUPPO BANDO */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-blue-50">
                  Titolo Bando
                </th>
                {bandiExpanded && <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-blue-50">Ente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-blue-50">Scad. Domanda</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-blue-50">Scad. Rendicontazione</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-blue-50">Link</th>
                </>}

                {/* GRUPPO CLIENTE */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-green-50">
                  Ragione Sociale
                </th>
                {clientiExpanded && <>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-green-50">Referente</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-green-50">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase bg-green-50">Telefono</th>
                </>}

                {/* CAMPI BANDO ATTIVO */}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incaricato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Importo Richiesto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stato</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Importo Concesso</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Storico</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note Aggiuntive</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Azioni</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((item) => (
                <tr key={`${item.bando_id}-${item.cliente_id}`} className="hover:bg-gray-50">
                  {/* BANDO */}
                  <td className="px-4 py-3 bg-blue-50/30">
                    <div className="font-medium text-gray-900">{item.bandi?.titolo || '-'}</div>
                    {item.bandi?.codice_bando && (
                      <div className="text-xs text-gray-500">{item.bandi.codice_bando}</div>
                    )}
                  </td>
                  {bandiExpanded && <>
                    <td className="px-4 py-3 bg-blue-50/30 text-gray-700">
                      {item.bandi?.enti_erogatori?.nome || '-'}
                    </td>
                    <td className={`px-4 py-3 bg-blue-50/30 ${getScadenzaStyle(item.bandi?.scadenza_domanda)}`}>
                      {formatDate(item.bandi?.scadenza_domanda)}
                    </td>
                    <td className="px-4 py-3 bg-blue-50/30 text-gray-700">
                      {formatDate(item.bandi?.scadenza_rendicontazione)}
                    </td>
                    <td className="px-4 py-3 bg-blue-50/30">
                      {item.bandi?.link_decreto ? (
                        <a href={item.bandi.link_decreto} target="_blank" rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800">🔗 Apri</a>
                      ) : '-'}
                    </td>
                  </>}

                  {/* CLIENTE */}
                  <td className="px-4 py-3 bg-green-50/30">
                    <div className="font-medium text-gray-900">{item.clienti?.ragione_sociale || '-'}</div>
                  </td>
                  {clientiExpanded && <>
                    <td className="px-4 py-3 bg-green-50/30 text-gray-700">
                      {item.clienti?.referente_nome || '-'}
                    </td>
                    <td className="px-4 py-3 bg-green-50/30 text-gray-700">
                      {item.clienti?.referente_email
                        ? <a href={`mailto:${item.clienti.referente_email}`} className="text-primary-600 hover:underline">{item.clienti.referente_email}</a>
                        : '-'}
                    </td>
                    <td className="px-4 py-3 bg-green-50/30 text-gray-700">
                      {item.clienti?.referente_telefono || '-'}
                    </td>
                  </>}

                  {/* CAMPI BANDO ATTIVO */}
                  <td className="px-4 py-3 text-gray-900">{item.incaricato || '-'}</td>
                  <td className="px-4 py-3 text-gray-900">{formatCurrency(item.importo_richiesto)}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATO_BADGE[item.stato] || 'bg-gray-100 text-gray-700'}`}>
                      {STATO_LABEL[item.stato] || item.stato || 'Bozza'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{formatCurrency(item.importo_concesso)}</td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs">
                    {item.storico ? (
                      <span className="block truncate" title={item.storico}>{item.storico}</span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-gray-700 max-w-xs">
                    {item.note_aggiuntive ? (
                      <span className="block truncate" title={item.note_aggiuntive}>{item.note_aggiuntive}</span>
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">✏️</button>
                    <button onClick={() => setDeleteItem(item)} className="text-red-600 hover:text-red-800">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteItem}
        title="Rimuovi Bando Attivo"
        message={`Sei sicuro di voler eliminare l'associazione tra "${deleteItem?.bandi?.titolo}" e "${deleteItem?.clienti?.ragione_sociale}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteItem(null)}
      />
    </div>
  );
}
