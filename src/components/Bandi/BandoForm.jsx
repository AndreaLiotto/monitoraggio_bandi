import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useBandi } from '../../hooks/useBandi';
import { useEnti } from '../../hooks/useEnti';
import { useTipiContributo } from '../../hooks/useTipiContributo';

export default function BandoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  
  const { createBando, updateBando, getBandoById } = useBandi();
  const { enti } = useEnti();
  const { tipi } = useTipiContributo();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEdit) {
      loadBando();
    }
  }, [id]);

  async function loadBando() {
    const { data } = await getBandoById(id);
    if (data) {
      reset(data);
    }
  }

  async function onSubmit(data) {
    setLoading(true);
    setError(null);

    const result = isEdit 
      ? await updateBando(id, data)
      : await createBando(data);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      navigate('/bandi');
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {isEdit ? 'Modifica Bando' : 'Nuovo Bando'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titolo *
          </label>
          <input
            {...register('titolo', { required: 'Il titolo è obbligatorio' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          />
          {errors.titolo && (
            <p className="text-red-500 text-sm mt-1">{errors.titolo.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ente Erogatore *
            </label>
            <select
              {...register('ente_erogatore_id', { required: 'Seleziona un ente' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleziona...</option>
              {enti.map(ente => (
                <option key={ente.id} value={ente.id}>{ente.nome}</option>
              ))}
            </select>
            {errors.ente_erogatore_id && (
              <p className="text-red-500 text-sm mt-1">{errors.ente_erogatore_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo Contributo *
            </label>
            <select
              {...register('tipo_contributo_id', { required: 'Seleziona un tipo' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Seleziona...</option>
              {tipi.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
              ))}
            </select>
            {errors.tipo_contributo_id && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo_contributo_id.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scadenza Domanda
            </label>
            <input
              type="date"
              {...register('scadenza_domanda')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scadenza Rendicontazione
            </label>
            <input
              type="date"
              {...register('scadenza_rendicontazione')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Codice Bando
            </label>
            <input
              {...register('codice_bando')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stato
            </label>
            <select
              {...register('stato')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            >
              <option value="bozza">Bozza</option>
              <option value="presentato">Presentato</option>
              <option value="in_valutazione">In Valutazione</option>
              <option value="approvato">Approvato</option>
              <option value="respinto">Respinto</option>
              <option value="erogato">Erogato</option>
              <option value="chiuso">Chiuso</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Link Decreto/Bando
          </label>
          <input
            type="url"
            {...register('link_decreto')}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tempistica Erogazione (giorni)
          </label>
          <input
            type="number"
            {...register('tempistica_erogazione_giorni')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Generali
          </label>
          <textarea
            {...register('note_generali')}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/bandi')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Salvataggio...' : (isEdit ? 'Aggiorna' : 'Crea Bando')}
          </button>
        </div>
      </form>
    </div>
  );
}
