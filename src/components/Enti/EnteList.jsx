import React, { useState } from 'react';
import { useEnti } from '../../hooks/useEnti';
import LoadingSpinner from '../Shared/LoadingSpinner';
import ConfirmDialog from '../Shared/ConfirmDialog';

export default function EnteList() {
  const { enti, loading, deleteEnte } = useEnti();
  const [deleteId, setDeleteId] = useState(null);

  async function handleDelete() {
    if (deleteId) {
      await deleteEnte(deleteId);
      setDeleteId(null);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Enti Erogatori</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enti.map(ente => (
          <div key={ente.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-lg mb-2">{ente.nome}</h3>
            {ente.sito_web && (
              <a href={ente.sito_web} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline block mb-2">
                🔗 Sito web
              </a>
            )}
            {ente.email_contatto && (
              <p className="text-sm text-gray-600">📧 {ente.email_contatto}</p>
            )}
            {ente.telefono && (
              <p className="text-sm text-gray-600">📞 {ente.telefono}</p>
            )}
            <div className="mt-4 flex space-x-2">
              <button className="text-blue-600 hover:text-blue-800">✏️</button>
              <button onClick={() => setDeleteId(ente.id)} className="text-red-600 hover:text-red-800">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Elimina Ente"
        message="Sei sicuro di voler eliminare questo ente?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
