import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBandiClienti } from '../../hooks/useBandiClienti';
import { useBandi } from '../../hooks/useBandi';
import { useClienti } from '../../hooks/useClienti';

const STATI = [
  'Bozza',
  'Presentato',
  'Concesso',
  'Negato',
  'In attesa di documentazione',
  'Perso',
  'Non interessato',
];

export default function BandoClienteForm({ item, onSuccess, onCancel }) {
  const { createBandoCliente, updateBandoCliente } = useBandiClienti();
  const { bandi } = useBandi();
  const { clienti } = useClienti();
  const isEdit = !!item;
  const listsLoading = bandiLoading || clientiLoading;

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: isEdit ? {
      bando_id: item.bando_id,
      cliente_id: item.cliente_id,
      incaricato: item.incaricato,
      importo_richiesto: item.importo_richiesto,
      stato: item.stato,
      importo_concesso: item.importo_concesso,
      storico: item.storico,
      note_aggiuntive: item.note_aggiuntive,
    } : {}
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(formData) {
    setLoading(true);
    setError(null);

    const result = isEdit
      ? await updateBandoCliente(item.bando_id, item.cliente_id, {
          incaricato: formData.incaricato,
          importo_richiesto: parseFloat(formData.importo_richiesto),
          stato: formData.stato,
          importo_concesso: parseFloat(formData.importo_concesso),
          storico: formData.storico || null,
          note_aggiuntive: formData.note_aggiuntive || null,
        })
      : await createBandoCliente({
          bando_id: formData.bando_id,
          cliente_id: formData.cliente_id,
          incaricato: formData.incaricato,
          importo_richiesto: parseFloat(formData.importo_richiesto),
          storico: formData.storico || null,
          note_aggiuntive: formData.note_aggiuntive || null,
        });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      if (onSuccess) onSuccess();
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-6">
        {isEdit ? 'Modifica Bando Attivo' : 'Nuovo Bando Attivo'}
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* BANDO + CLIENTE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bando *</label>
            {isEdit ? (
              <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                {item.bandi?.titolo || item.bando_id}
                {item.bandi?.codice_bando && <span className="text-gray-400 ml-1">({item.bandi.codice_bando})</span>}
              </div>
            ) : (
              <>
                <select
                  {...register('bando_id', { required: 'Seleziona un bando' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Seleziona bando...</option>
                  {bandi.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.titolo}{b.codice_bando ? ` (${b.codice_bando})` : ''}
                    </option>
                  ))}
                </select>
                {errors.bando_id && <p className="text-red-500 text-sm mt-1">{errors.bando_id.message}</p>}
              </>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
            {isEdit ? (
              <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-700">
                {item.clienti?.ragione_sociale || item.cliente_id}
              </div>
            ) : (
              <>
                <select
                  {...register('cliente_id', { required: 'Seleziona un cliente' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Seleziona cliente...</option>
                  {clienti.map(c => (
                    <option key={c.id} value={c.id}>{c.ragione_sociale}</option>
                  ))}
                </select>
                {errors.cliente_id && <p className="text-red-500 text-sm mt-1">{errors.cliente_id.message}</p>}
              </>
            )}
          </div>
        </div>

        {/* INCARICATO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Incaricato *</label>
          <input
            {...register('incaricato', { required: "L'incaricato è obbligatorio" })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            placeholder="es. Mario Rossi"
          />
          {errors.incaricato && <p className="text-red-500 text-sm mt-1">{errors.incaricato.message}</p>}
        </div>

        {/* IMPORTO RICHIESTO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Importo Richiesto (€) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            {...register('importo_richiesto', {
              required: "L'importo richiesto è obbligatorio",
              min: { value: 0, message: 'Deve essere ≥ 0' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            placeholder="es. 50000"
          />
          {errors.importo_richiesto && <p className="text-red-500 text-sm mt-1">{errors.importo_richiesto.message}</p>}
        </div>

        {/* STATO (solo in edit) + IMPORTO CONCESSO (solo in edit) */}
        {isEdit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stato *</label>
              <select
                {...register('stato', { required: 'Obbligatorio' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                {STATI.map(s => <option key={s} value={s.toLowerCase().replace(/ /g, '_')}>{s}</option>)}
              </select>
              {errors.stato && <p className="text-red-500 text-sm mt-1">{errors.stato.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Importo Concesso (€) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('importo_concesso', {
                  required: "Obbligatorio",
                  min: { value: 0, message: 'Deve essere ≥ 0' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="0"
              />
              {errors.importo_concesso && <p className="text-red-500 text-sm mt-1">{errors.importo_concesso.message}</p>}
            </div>
          </div>
        )}

        {!isEdit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
              <span className="font-medium">Stato:</span> Bozza (impostato automaticamente)
            </div>
            <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600">
              <span className="font-medium">Importo Concesso:</span> € 0,00 (modificabile dopo la creazione)
            </div>
          </div>
        )}

        {/* STORICO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Storico</label>
          <textarea
            {...register('storico')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            placeholder="Aggiornamenti e cronologia del bando per questo cliente..."
          />
        </div>

        {/* NOTE AGGIUNTIVE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Note Aggiuntive</label>
          <textarea
            {...register('note_aggiuntive')}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
            placeholder="Note libere su questo bando/cliente..."
          />
        </div>

        {/* BOTTONI */}
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
            {loading ? 'Salvataggio...' : (isEdit ? 'Aggiorna' : 'Crea Bando Attivo')}
          </button>
        </div>
      </form>
    </div>
  );
}
