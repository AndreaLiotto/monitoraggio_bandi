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
          ente_erogatore:enti_erogatori(nome),
          tipo_contributo:tipi_contributo(nome),
          cliente:clienti(id, ragione_sociale)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBandi(data || []);
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
        .select(`
          *,
          ente_erogatore:enti_erogatori(nome),
          tipo_contributo:tipi_contributo(nome),
          cliente:clienti(id, ragione_sociale)
        `)
        .single();

      if (error) throw error;
      if (data) {
        setBandi([data, ...bandi]);
      }
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
        .select(`
          *,
          ente_erogatore:enti_erogatori(nome),
          tipo_contributo:tipi_contributo(nome),
          cliente:clienti(id, ragione_sociale)
        `)
        .single();

      if (error) throw error;
      if (data) {
        setBandi(bandi.map(b => b.id === id ? data : b));
      }
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
          ente_erogatore:enti_erogatori(*),
          tipo_contributo:tipi_contributo(*),
          cliente:clienti(id, ragione_sociale)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
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
