import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBandi } from '../../hooks/useBandi';
import { formatDate, formatCurrency } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';
import SpesaList from '../Spese/SpesaList';
import Timeline from '../Storico/Timeline';
import NoteList from '../Note/NoteList';

export default function BandoDetail() {
  const { id } = useParams();
  const { getBandoById } = useBandi();
  const [bando, setBando] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('spese');

  useEffect(() => {
    loadBando();
  }, [id]);

  async function loadBando() {
    const { data } = await getBandoById(id);
    if (data) {
      setBando(data);
    }
    setLoading(false);
  }

  if (loading) return <LoadingSpinner />;
  if (!bando) return <div>Bando non trovato</div>;

  const tabs = [
    { id: 'spese', label: '💰 Spese', component: <SpesaList bandoId={id} /> },
    { id: 'storico', label: '📋 Storico', component: <Timeline bandoId={id} /> },
    { id: 'note', label: '📝 Note', component: <NoteList bandoId={id} /> },
  ];

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link to="/bandi" className="text-primary-600 hover:text-primary-800 mb-2 inline-block">
            ← Torna ai bandi
          </Link>
          <h1 className="text-3xl font-bold">{bando.titolo}</h1>
          {bando.codice_bando && (
            <p className="text-gray-600">Codice: {bando.codice_bando}</p>
          )}
        </div>
        <Link
          to={`/bandi/${id}/modifica`}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          ✏️ Modifica
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Ente Erogatore</p>
            <p className="font-medium">{bando.ente_erogatore?.nome || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tipo Contributo</p>
            <p className="font-medium">{bando.tipo_contributo?.nome || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Scadenza Domanda</p>
            <p className="font-medium">{formatDate(bando.scadenza_domanda)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Stato</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              bando.stato === 'approvato' ? 'bg-green-100 text-green-800' :
              bando.stato === 'respinto' ? 'bg-red-100 text-red-800' :
              bando.stato === 'in_valutazione' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {bando.stato}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-gray-600">Importo Totale Richiesto</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(bando.importo_totale_richiesto)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Importo Totale Concesso</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(bando.importo_totale_concesso)}
            </p>
          </div>
        </div>

        {bando.note_generali && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-600 mb-2">Note Generali</p>
            <p className="text-gray-900">{bando.note_generali}</p>
          </div>
        )}

        {bando.link_decreto && (
          <div className="mt-4">
            <a
              href={bando.link_decreto}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-800"
            >
              🔗 Visualizza Decreto/Bando
            </a>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}
