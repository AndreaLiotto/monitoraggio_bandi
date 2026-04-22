import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useClienti } from '../../hooks/useClienti';
import { validatePartitaIva, validateCodiceFiscale } from '../../lib/utils';

export default function ClienteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const { createCliente, updateCliente, clienti } = useClienti();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit && clienti.length > 0) {
      const cliente = clienti.find(c => c.id === id);
      if (cliente) {
        reset(cliente);
      }
    }
  }, [id, clienti]);

  async function onSubmit(data) {
    setLoading(true);
    setError(null);

    const result = isEdit 
      ? await updateCliente(id, data)
      : await createCliente(data);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      navigate('/clienti');
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {isEdit ? 'Modifica Cliente' : 'Nuovo Cliente'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ragione Sociale *
          </label>
          <input
            {...register('ragione_sociale', { required: 'La ragione sociale è obbligatoria' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          />
          {errors.ragione_sociale && (
            <p className="text-red-500 text-sm mt-1">{errors.ragione_sociale.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partita IVA
            </label>
            <input
              {...register('partita_iva', {
                validate: value => !value || validatePartitaIva(value) || 'P.IVA non valida (11 cifre)'
              })}
              maxLength="11"
              placeholder="12345678901"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            />
            {errors.partita_iva && (
              <p className="text-red-500 text-sm mt-1">{errors.partita_iva.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Codice Fiscale
            </label>
            <input
              {...register('codice_fiscale', {
                validate: value => !value || validateCodiceFiscale(value) || 'CF non valido (16 caratteri)'
              })}
              maxLength="16"
              placeholder="RSSMRA80A01H501U"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 uppercase"
            />
            {errors.codice_fiscale && (
              <p className="text-red-500 text-sm mt-1">{errors.codice_fiscale.message}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Referente</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Referente
              </label>
              <input
                {...register('referente_nome')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Referente
                </label>
                <input
                  type="email"
                  {...register('referente_email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefono Referente
                </label>
                <input
                  type="tel"
                  {...register('referente_telefono')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indirizzo
          </label>
          <textarea
            {...register('indirizzo')}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note
          </label>
          <textarea
            {...register('note')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/clienti')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Salvataggio...' : (isEdit ? 'Aggiorna' : 'Crea Cliente')}
          </button>
        </div>
      </form>
    </div>
  );
}
