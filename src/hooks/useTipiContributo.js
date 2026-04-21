import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useTipiContributo() {
  const [tipi, setTipi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTipi();
  }, []);

  async function fetchTipi() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tipi_contributo')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setTipi(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createTipo(newTipo) {
    try {
      const { data, error } = await supabase
        .from('tipi_contributo')
        .insert([newTipo])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTipi([...tipi, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function updateTipo(id, updates) {
    try {
      const { data, error } = await supabase
        .from('tipi_contributo')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTipi(tipi.map(t => t.id === id ? data : t));
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function deleteTipo(id) {
    try {
      const { error } = await supabase
        .from('tipi_contributo')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTipi(tipi.filter(t => t.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  return { 
    tipi, 
    loading, 
    error,
    fetchTipi, 
    createTipo, 
    updateTipo, 
    deleteTipo 
  };
}
