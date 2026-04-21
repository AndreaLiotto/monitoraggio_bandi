import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useSpese(bandoId = null) {
  const [spese, setSpese] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSpese();
  }, [bandoId]);

  async function fetchSpese() {
    try {
      setLoading(true);
      let query = supabase
        .from('spese')
        .select(`
          *,
          cliente:clienti(ragione_sociale)
        `)
        .order('created_at', { ascending: false });

      if (bandoId) {
        query = query.eq('bando_id', bandoId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSpese(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createSpesa(newSpesa) {
    try {
      const { data, error } = await supabase
        .from('spese')
        .insert([newSpesa])
        .select(`
          *,
          cliente:clienti(ragione_sociale)
        `)
        .single();

      if (error) throw error;
      if (data) {
        setSpese([data, ...spese]);
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function updateSpesa(id, updates) {
    try {
      const { data, error } = await supabase
        .from('spese')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          cliente:clienti(ragione_sociale)
        `)
        .single();

      if (error) throw error;
      if (data) {
        setSpese(spese.map(s => s.id === id ? data : s));
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function deleteSpesa(id) {
    try {
      const { error } = await supabase
        .from('spese')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSpese(spese.filter(s => s.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  return { 
    spese, 
    loading, 
    error,
    fetchSpese, 
    createSpesa, 
    updateSpesa, 
    deleteSpesa 
  };
}
