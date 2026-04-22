import React, { useState } from 'react';
import { useEnti } from '../../hooks/useEnti';
import LoadingSpinner from '../Shared/LoadingSpinner';
import ConfirmDialog from '../Shared/ConfirmDialog';
import EnteForm from './EnteForm';

export default function EnteList() {
  const { enti, loading, deleteEnte } = useEnti();
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEnte, setEditingEnte] = useState(null);

  async function handleDelete() {
    if (deleteId) {
      await deleteEnte(deleteId);
      setDeleteId(null);
    }
  }

  function handleEdit(ente) {
    setEditingEnte(ente);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingEnte(null);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingEnte(null);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Enti Erogatori</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          ➕ Nuovo Ente
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <EnteForm 
            ente={editingEnte}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}
      
      {enti.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Nessun ente erogatore presente</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary-600 hover:text-primary-800"
          >
            Crea il primo ente →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enti.map(ente => (
            <div key={ente.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3">{ente.nome}</h3>
              
              {ente.sito_web && (
                <a 
                  href={ente.sito_web} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-primary-600 hover:underline block mb-2"
                >
                  🔗 {ente.sito_web}
                </a>
              )}
              
              {ente.email_contatto && (
                <p className="text-sm text-gray-600 mb-1">
                  📧 {ente.email_contatto}
                </p>
              )}
              
              {ente.telefono && (
                <p className="text-sm text-gray-600 mb-1">
                  📞 {ente.telefono}
                </p>
              )}

              {ente.note && (
                <p className="text-sm text-gray-500 mt-3 italic">
                  {ente.note.substring(0, 100)}{ente.note.length > 100 ? '...' : ''}
                </p>
              )}
              
              <div className="mt-4 pt-4 border-t flex space-x-3">
                <button 
                  onClick={() => handleEdit(ente)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ✏️ Modifica
                </button>
                <button 
                  onClick={() => setDeleteId(ente.id)} 
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑️ Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Elimina Ente"
        message="Sei sicuro di voler eliminare questo ente? Questa azione non può essere annullata."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
