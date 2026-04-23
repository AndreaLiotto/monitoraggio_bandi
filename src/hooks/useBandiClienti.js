import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useBandiClienti() {
  const [bandiClienti, setBandiClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBandiClienti();
  }, []);

  async function fetchBandiClienti() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bandi_clienti')
        .select(`
          *,
          bandi!bando_id(
            id,
            titolo,
            codice_bando,
            scadenza_domanda,
            scadenza_rendicontazione,
            link_decreto,
            enti_erogatori!ente_erogatore_id(nome)
          ),
          clienti!cliente_id(
            id,
            ragione_sociale,
            referente_nome,
            referente_email,
            referente_telefono
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBandiClienti(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createBandoCliente(newRelation) {
    try {
      const payload = {
        bando_id: newRelation.bando_id,
        cliente_id: newRelation.cliente_id,
        incaricato: newRelation.incaricato,
        importo_richiesto: newRelation.importo_richiesto,
        stato: 'bozza',
        importo_concesso: 0,
        storico: newRelation.storico || null,
        note_aggiuntive: newRelation.note_aggiuntive || null,
      };
      const { data, error } = await supabase
        .from('bandi_clienti')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      await fetchBandiClienti();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function updateBandoCliente(bandoId, clienteId, updates) {
    try {
      const { data, error } = await supabase
        .from('bandi_clienti')
        .update(updates)
        .eq('bando_id', bandoId)
        .eq('cliente_id', clienteId)
        .select()
        .single();

      if (error) throw error;
      await fetchBandiClienti();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function deleteBandoCliente(bandoId, clienteId) {
    try {
      const { error } = await supabase
        .from('bandi_clienti')
        .delete()
        .eq('bando_id', bandoId)
        .eq('cliente_id', clienteId);

      if (error) throw error;
      setBandiClienti(bandiClienti.filter(
        bc => !(bc.bando_id === bandoId && bc.cliente_id === clienteId)
      ));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  return {
    bandiClienti,
    loading,
    error,
    fetchBandiClienti,
    createBandoCliente,
    updateBandoCliente,
    deleteBandoCliente
  };
}
