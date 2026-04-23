import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { supabase } from '../lib/supabase';
import KPICards from '../components/Dashboard/KPICards';
import ScadenzeBandi from '../components/Dashboard/ScadenzeBandi';
import GraficoImporti from '../components/Dashboard/GraficoImporti';

export default function Dashboard() {
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  async function handleExportExcel() {
    setExporting(true);
    try {
      // Carica bandi_clienti con tutti i join
      const { data, error } = await supabase
        .from('bandi_clienti')
        .select(`
          *,
          bandi!bando_id(
            titolo,
            codice_bando,
            scadenza_domanda,
            scadenza_rendicontazione,
            link_decreto,
            enti_erogatori!ente_erogatore_id(nome),
            tipi_contributo!tipo_contributo_id(nome)
          ),
          clienti!cliente_id(
            ragione_sociale,
            partita_iva,
            referente_nome,
            referente_email,
            referente_telefono
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Trasforma i dati in righe piatte per Excel
      const righe = (data || []).map(bc => ({
        'Titolo Bando':             bc.bandi?.titolo || '',
        'Codice Bando':             bc.bandi?.codice_bando || '',
        'Ente Erogatore':           bc.bandi?.enti_erogatori?.nome || '',
        'Tipo Contributo':          bc.bandi?.tipi_contributo?.nome || '',
        'Scadenza Domanda':         bc.bandi?.scadenza_domanda || '',
        'Scadenza Rendicontazione': bc.bandi?.scadenza_rendicontazione || '',
        'Link Decreto':             bc.bandi?.link_decreto || '',
        'Ragione Sociale':          bc.clienti?.ragione_sociale || '',
        'P.IVA':                    bc.clienti?.partita_iva || '',
        'Referente':                bc.clienti?.referente_nome || '',
        'Email Referente':          bc.clienti?.referente_email || '',
        'Telefono Referente':       bc.clienti?.referente_telefono || '',
        'Incaricato':               bc.incaricato || '',
        'Importo Richiesto (€)':    bc.importo_richiesto || 0,
        'Stato':                    bc.stato || '',
        'Importo Concesso (€)':     bc.importo_concesso || 0,
        'Storico':                  bc.storico || '',
        'Note Aggiuntive':          bc.note_aggiuntive || '',
        'Data Inserimento':         bc.created_at ? new Date(bc.created_at).toLocaleDateString('it-IT') : '',
      }));

      // Crea workbook Excel
      const ws = XLSX.utils.json_to_sheet(righe);

      // Larghezze colonne automatiche
      const colWidths = Object.keys(righe[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Bandi Attivi');

      // Scarica il file
      const oggi = new Date().toLocaleDateString('it-IT').replace(/\//g, '-');
      XLSX.writeFile(wb, `monitoraggio-bandi-${oggi}.xlsx`);

    } catch (err) {
      console.error('Errore export:', err);
      alert('Errore durante l\'export: ' + err.message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <KPICards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ScadenzeBandi />

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Azioni Rapide</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/bandi/nuovo')}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-gray-900">Nuovo Bando</p>
                <p className="text-sm text-gray-500">Aggiungi un bando al catalogo</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/clienti/nuovo')}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-medium text-gray-900">Nuovo Cliente</p>
                <p className="text-sm text-gray-500">Registra un nuovo cliente</p>
              </div>
            </button>

            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-colors flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-2xl">📥</span>
              <div>
                <p className="font-medium text-gray-900">
                  {exporting ? 'Esportazione in corso...' : 'Export Excel'}
                </p>
                <p className="text-sm text-gray-500">Scarica tutti i bandi attivi in .xlsx</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <GraficoImporti />
    </div>
  );
}
