import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTipiContributo } from '../../hooks/useTipiContributo';

export default function TipoContributoForm({ tipo, onSuccess, onCancel }) {
  const { createTipo, updateTipo } = useTipiContributo();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: tipo || {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!tipo;

  async function onSubmit(data) {
    setLoading(true);
    setError(null);

    const result = isEdit 
      ? await updateTipo(tipo.id, data)
      : await createTipo(data);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      if (onSuccess) onSuccess();
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">
        {isEdit ? 'Modifica Tipo Contributo' : 'Nuovo Tipo di Contributo'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Tipologia *
          </label>
          <input
            {...register('nome', { required: 'Il nome è obbligatorio' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="es. Contributo Fondo Perduto 30%"
          />
          {errors.nome && (
            <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentuale Copertura (%)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('percentuale_copertura')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="es. 30.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Percentuale di copertura delle spese ammissibili
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Massimale (€)
            </label>
            <input
              type="number"
              step="0.01"
              {...register('massimale_euro')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="es. 50000.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Importo massimo erogabile (se previsto)
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrizione
          </label>
          <textarea
            {...register('descrizione')}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            placeholder="Descrivi le caratteristiche del contributo, regolamenti applicabili (es. de minimis), condizioni particolari..."
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">
            Es: "Contributo in conto capitale non superiore al 70% delle spese ammissibili. Regolamento de minimis."
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annulla
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Salvataggio...' : (isEdit ? 'Aggiorna' : 'Crea Tipo')}
          </button>
        </div>
      </form>
    </div>
  );
}
