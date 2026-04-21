import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useStorico(bandoId) {
  const [storico, setStorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bandoId) {
      fetchStorico();
    }
  }, [bandoId]);

  async function fetchStorico() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('storico')
        .select('*')
        .eq('bando_id', bandoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setStorico(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createAggiornamento(newAggiornamento) {
    try {
      const { data, error } = await supabase
        .from('storico')
        .insert([{ ...newAggiornamento, bando_id: bandoId }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setStorico([data, ...storico]);
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function deleteAggiornamento(id) {
    try {
      const { error } = await supabase
        .from('storico')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setStorico(storico.filter(s => s.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  return { 
    storico, 
    loading, 
    error,
    fetchStorico, 
    createAggiornamento, 
    deleteAggiornamento 
  };
}
