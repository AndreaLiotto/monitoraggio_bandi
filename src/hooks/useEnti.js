import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useEnti() {
  const [enti, setEnti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEnti();
  }, []);

  async function fetchEnti() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enti_erogatori')
        .select('*')
        .order('nome', { ascending: true });

      if (error) throw error;
      setEnti(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createEnte(newEnte) {
    try {
      const { data, error } = await supabase
        .from('enti_erogatori')
        .insert([newEnte])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setEnti([...enti, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function updateEnte(id, updates) {
    try {
      const { data, error } = await supabase
        .from('enti_erogatori')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setEnti(enti.map(e => e.id === id ? data : e));
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function deleteEnte(id) {
    try {
      const { error } = await supabase
        .from('enti_erogatori')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setEnti(enti.filter(e => e.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  return { 
    enti, 
    loading, 
    error,
    fetchEnti, 
    createEnte, 
    updateEnte, 
    deleteEnte 
  };
}
