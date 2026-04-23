import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useClienti() {
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClienti();
  }, []);

  async function fetchClienti() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clienti')
        .select('*, bandi:bandi!cliente_id(count)')
        .order('ragione_sociale', { ascending: true });

      if (error) throw error;
      setClienti(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createCliente(newCliente) {
    try {
      const { data, error } = await supabase
        .from('clienti')
        .insert([newCliente])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh completo della lista (include count bandi)
      await fetchClienti();
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function updateCliente(id, updates) {
    try {
      const { data, error } = await supabase
        .from('clienti')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh completo della lista (include count bandi)
      await fetchClienti();
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function deleteCliente(id) {
    try {
      const { error } = await supabase
        .from('clienti')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClienti(clienti.filter(c => c.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  return { 
    clienti, 
    loading, 
    error,
    fetchClienti, 
    createCliente, 
    updateCliente, 
    deleteCliente 
  };
}
