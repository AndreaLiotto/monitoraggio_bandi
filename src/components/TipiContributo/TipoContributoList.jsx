import React, { useState } from 'react';
import { useTipiContributo } from '../../hooks/useTipiContributo';
import { formatCurrency, formatPercentage } from '../../lib/utils';
import LoadingSpinner from '../Shared/LoadingSpinner';
import ConfirmDialog from '../Shared/ConfirmDialog';
import TipoContributoForm from './TipoContributoForm';

export default function TipoContributoList() {
  const { tipi, loading, deleteTipo } = useTipiContributo();
  const [deleteId, setDeleteId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTipo, setEditingTipo] = useState(null);

  async function handleDelete() {
    if (deleteId) {
      await deleteTipo(deleteId);
      setDeleteId(null);
    }
  }

  function handleEdit(tipo) {
    setEditingTipo(tipo);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingTipo(null);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingTipo(null);
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tipi di Contributo</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          ➕ Nuovo Tipo
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TipoContributoForm 
            tipo={editingTipo}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}
      
      {tipi.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 mb-4">Nessun tipo di contributo presente</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary-600 hover:text-primary-800"
          >
            Crea il primo tipo →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tipi.map(tipo => (
            <div key={tipo.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3">{tipo.nome}</h3>
              
              <div className="space-y-2 mb-4">
                {tipo.percentuale_copertura && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Copertura:</span>
                    <span className="font-semibold text-primary-600">
                      {formatPercentage(tipo.percentuale_copertura)}
                    </span>
                  </div>
                )}
                
                {tipo.massimale_euro && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Massimale:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(tipo.massimale_euro)}
                    </span>
                  </div>
                )}
              </div>

              {tipo.descrizione && (
                <p className="text-sm text-gray-500 mt-3 italic border-t pt-3">
                  {tipo.descrizione.substring(0, 120)}{tipo.descrizione.length > 120 ? '...' : ''}
                </p>
              )}
              
              <div className="mt-4 pt-4 border-t flex space-x-3">
                <button 
                  onClick={() => handleEdit(tipo)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ✏️ Modifica
                </button>
                <button 
                  onClick={() => setDeleteId(tipo.id)} 
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
        title="Elimina Tipo Contributo"
        message="Sei sicuro di voler eliminare questo tipo di contributo? Questa azione non può essere annullata."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
