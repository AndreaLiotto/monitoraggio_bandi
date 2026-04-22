import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabase';

export default function ExportExcel() {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const { data: bandi } = await supabase.from('bandi').select('*');
      const { data: clienti } = await supabase.from('clienti').select('*');
      const { data: spese } = await supabase.from('spese').select('*');
      const { data: enti } = await supabase.from('enti_erogatori').select('*');
      const { data: tipi } = await supabase.from('tipi_contributo').select('*');

      const wb = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bandi || []), 'Bandi');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(clienti || []), 'Clienti');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(spese || []), 'Spese');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(enti || []), 'Enti');
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(tipi || []), 'Tipi Contributo');

      XLSX.writeFile(wb, `bandi_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Errore export:', error);
      alert('Errore durante l export');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? 'Esportazione...' : '📥 Export Excel'}
    </button>
  );
}
