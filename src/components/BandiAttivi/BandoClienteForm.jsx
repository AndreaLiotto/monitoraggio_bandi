import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBandiClienti } from '../../hooks/useBandiClienti';
import { useBandi } from '../../hooks/useBandi';
import { useClienti } from '../../hooks/useClienti';

export default function BandoClienteForm({ item, onSuccess, onCancel }) {
  const { createBandoCliente, updateBandoCliente } = useBandiClienti();
  const { bandi } = useBandi();
  const { clienti } = useClienti();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: item ? {
      bando_id: item.bando_id,
      cliente_id: item.cliente_id,
      ruolo: item.ruolo
    } : {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!item;

  async function onSubmit(data) {
    setLoading(true);
    setError(null);

    const result = isEdit
      ? await updateBandoCliente(item.bando_id, item.cliente_id, { ruolo: data.ruolo })
      : await createBandoCliente(data);

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
        {isEdit ? 'Modifica Associazione' : 'Associa Cliente a Bando'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bando *
            </label>
            <select
              {...register('bando_id', { required: 'Seleziona un bando' })}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
            >
              <option value="">Seleziona bando...</option>
              {bandi.map(bando => (
                <option key={bando.id} value={bando.id}>
                  {bando.titolo} {bando.codice_bando ? `(${bando.codice_bando})` : ''}
                </option>
              ))}
            </select>
            {errors.bando_id && (
              <p className="text-red-500 text-sm mt-1">{errors.bando_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cliente *
            </label>
            <select
              {...register('cliente_id', { required: 'Seleziona un cliente' })}
              disabled={isEdit}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100"
            >
              <option value="">Seleziona cliente...</option>
              {clienti.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.ragione_sociale}
                </option>
              ))}
            </select>
            {errors.cliente_id && (
              <p className="text-red-500 text-sm mt-1">{errors.cliente_id.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ruolo
          </label>
          <input
            {...register('ruolo')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            placeholder="es. Capofila, Partner, Beneficiario..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Specifica il ruolo del cliente in questo bando (opzionale)
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
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
            {loading ? 'Salvataggio...' : (isEdit ? 'Aggiorna' : 'Associa')}
          </button>
        </div>
      </form>
    </div>
  );
}
