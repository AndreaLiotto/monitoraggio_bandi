import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useEnti } from '../../hooks/useEnti';

export default function EnteForm({ ente, onSuccess, onCancel }) {
  const { createEnte, updateEnte } = useEnti();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: ente || {}
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!ente;

  async function onSubmit(data) {
    setLoading(true);
    setError(null);

    const result = isEdit 
      ? await updateEnte(ente.id, data)
      : await createEnte(data);

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
        {isEdit ? 'Modifica Ente' : 'Nuovo Ente Erogatore'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome Ente *
          </label>
          <input
            {...register('nome', { required: 'Il nome è obbligatorio' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="es. Regione Veneto"
          />
          {errors.nome && (
            <p className="text-red-500 text-sm mt-1">{errors.nome.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sito Web *
          </label>
          <input
            type="url"
            {...register('sito_web', {
              required: 'Il sito web è obbligatorio',
              pattern: {
                value: /^https?:\/\/.+/,
                message: 'Inserisci un URL valido (http:// o https://)'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            placeholder="https://www.esempio.it"
          />
          {errors.sito_web && (
            <p className="text-red-500 text-sm mt-1">{errors.sito_web.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Contatto *
            </label>
            <input
              type="email"
              {...register('email_contatto', {
                required: "L'email di contatto è obbligatoria",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email non valida'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="info@esempio.it"
            />
            {errors.email_contatto && (
              <p className="text-red-500 text-sm mt-1">{errors.email_contatto.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefono *
            </label>
            <input
              type="tel"
              {...register('telefono', { required: 'Il telefono è obbligatorio' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              placeholder="041 123 4567"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            {...register('note')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            placeholder="Note aggiuntive sull'ente..."
          ></textarea>
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
            {loading ? 'Salvataggio...' : (isEdit ? 'Aggiorna' : 'Crea Ente')}
          </button>
        </div>
      </form>
    </div>
  );
}
