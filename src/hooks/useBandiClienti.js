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
            stato,
            scadenza_domanda,
            importo_totale_concesso,
            incaricato,
            enti_erogatori!ente_erogatore_id(nome)
          ),
          clienti!cliente_id(
            id,
            ragione_sociale,
            partita_iva,
            referente_nome
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
      const { data, error } = await supabase
        .from('bandi_clienti')
        .insert([newRelation])
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
