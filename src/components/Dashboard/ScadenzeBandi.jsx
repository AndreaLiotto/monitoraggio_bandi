import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { formatDate, getScadenzaStatus } from '../../lib/utils';
import { differenceInDays, parseISO, addDays } from 'date-fns';

export default function ScadenzeBandi() {
  const [scadenze, setScadenze] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScadenze();
  }, []);

  async function loadScadenze() {
    try {
      const oggi = new Date();
      const tra30giorni = addDays(oggi, 30);

      const { data } = await supabase
        .from('bandi')
        .select('id, titolo, scadenza_domanda, stato')
        .gte('scadenza_domanda', oggi.toISOString().split('T')[0])
        .lte('scadenza_domanda', tra30giorni.toISOString().split('T')[0])
        .order('scadenza_domanda', { ascending: true })
        .limit(10);

      setScadenze(data || []);
    } catch (error) {
      console.error('Errore caricamento scadenze:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Caricamento scadenze...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">📅 Prossime Scadenze (30 giorni)</h2>
      
      {scadenze.length === 0 ? (
        <p className="text-gray-500">Nessuna scadenza imminente</p>
      ) : (
        <div className="space-y-3">
          {scadenze.map(bando => {
            const status = getScadenzaStatus(bando.scadenza_domanda);
            const giorni = differenceInDays(parseISO(bando.scadenza_domanda), new Date());
            
            return (
              <Link
                key={bando.id}
                to={`/bandi/${bando.id}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{bando.titolo}</h3>
                    <p className="text-sm text-gray-600">
                      Scadenza: {formatDate(bando.scadenza_domanda)}
                      <span className="ml-2">
                        ({giorni} {giorni === 1 ? 'giorno' : 'giorni'})
                      </span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === 'urgent' ? 'bg-red-100 text-red-700' :
                    status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {bando.stato}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
