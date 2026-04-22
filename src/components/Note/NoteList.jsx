import React, { useState } from 'react';
import { useNote } from '../../hooks/useNote';
import { formatDate } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';

export default function NoteList({ bandoId }) {
  const { note, loading } = useNote(bandoId);
  const [tagFilter, setTagFilter] = useState('');

  const noteFiltrate = tagFilter
    ? note.filter(n => n.tag === tagFilter)
    : note;

  const tagsUniche = [...new Set(note.map(n => n.tag).filter(Boolean))];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Note</h3>
        <button className="text-primary-600 hover:text-primary-800">
          ➕ Aggiungi Nota
        </button>
      </div>

      {tagsUniche.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setTagFilter('')}
            className={`px-3 py-1 rounded-full text-sm ${
              !tagFilter ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Tutti
          </button>
          {tagsUniche.map(tag => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-3 py-1 rounded-full text-sm ${
                tagFilter === tag ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {noteFiltrate.length === 0 ? (
        <p className="text-gray-500">Nessuna nota presente</p>
      ) : (
        <div className="space-y-3">
          {noteFiltrate.map(nota => (
            <div key={nota.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                {nota.tag && (
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                    {nota.tag}
                  </span>
                )}
                <span className="text-xs text-gray-500">{formatDate(nota.created_at)}</span>
              </div>
              <p className="text-sm text-gray-700">{nota.testo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
