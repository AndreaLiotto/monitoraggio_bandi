import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useBandi() {
  const [bandi, setBandi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBandi();
  }, []);

  async function fetchBandi() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bandi')
        .select(`
          *,
          enti_erogatori!ente_erogatore_id(nome),
          tipi_contributo!tipo_contributo_id(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Rinomina per retrocompatibilità
      const bandiConAlias = (data || []).map(bando => ({
        ...bando,
        ente_erogatore: bando.enti_erogatori,
        tipo_contributo: bando.tipi_contributo
      }));
      
      setBandi(bandiConAlias);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createBando(newBando) {
    try {
      const { data, error } = await supabase
        .from('bandi')
        .insert([newBando])
        .select()
        .single();

      if (error) throw error;
      await fetchBandi();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function updateBando(id, updates) {
    try {
      const { data, error } = await supabase
        .from('bandi')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchBandi();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function deleteBando(id) {
    try {
      const { error } = await supabase
        .from('bandi')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBandi(bandi.filter(b => b.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  async function getBandoById(id) {
    try {
      const { data, error } = await supabase
        .from('bandi')
        .select(`
          *,
          enti_erogatori!ente_erogatore_id(*),
          tipi_contributo!tipo_contributo_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      const bandoConAlias = {
        ...data,
        ente_erogatore: data.enti_erogatori,
        tipo_contributo: data.tipi_contributo
      };
      
      return { data: bandoConAlias, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  return { 
    bandi, 
    loading, 
    error,
    fetchBandi, 
    createBando, 
    updateBando, 
    deleteBando,
    getBandoById
  };
}
