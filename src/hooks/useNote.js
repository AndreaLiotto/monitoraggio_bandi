import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useNote(bandoId) {
  const [note, setNote] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bandoId) {
      fetchNote();
    }
  }, [bandoId]);

  async function fetchNote() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('note')
        .select('*')
        .eq('bando_id', bandoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNote(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function createNota(newNota) {
    try {
      const { data, error } = await supabase
        .from('note')
        .insert([{ ...newNota, bando_id: bandoId }])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setNote([data, ...note]);
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function updateNota(id, updates) {
    try {
      const { data, error } = await supabase
        .from('note')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setNote(note.map(n => n.id === id ? data : n));
      }
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  }

  async function deleteNota(id) {
    try {
      const { error } = await supabase
        .from('note')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setNote(note.filter(n => n.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  return { 
    note, 
    loading, 
    error,
    fetchNote, 
    createNota, 
    updateNota, 
    deleteNota 
  };
}
