import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../lib/utils';
import { differenceInDays, parseISO } from 'date-fns';

export default function KPICards() {
  const [kpis, setKpis] = useState({
    totaleBandi: 0,
    bandiAttivi: 0,
    importoConcesso: 0,
    scadenzeImminenti: 0,
  });

  useEffect(() => {
    loadKPIs();
  }, []);

  async function loadKPIs() {
    try {
      const { data: bandi } = await supabase
        .from('bandi')
        .select('stato, importo_totale_concesso, scadenza_domanda');

      if (bandi) {
        const totaleBandi = bandi.length;
        const bandiAttivi = bandi.filter(b => 
          ['presentato', 'in_valutazione', 'approvato'].includes(b.stato)
        ).length;
        const importoConcesso = bandi.reduce((sum, b) => sum + (b.importo_totale_concesso || 0), 0);
        
        const oggi = new Date();
        const scadenzeImminenti = bandi.filter(b => {
          if (!b.scadenza_domanda) return false;
          const giorni = differenceInDays(parseISO(b.scadenza_domanda), oggi);
          return giorni >= 0 && giorni <= 14;
        }).length;

        setKpis({ totaleBandi, bandiAttivi, importoConcesso, scadenzeImminenti });
      }
    } catch (error) {
      console.error('Errore caricamento KPI:', error);
    }
  }

  const cards = [
    { label: 'Bandi Totali', value: kpis.totaleBandi, icon: '📋', color: 'bg-blue-500' },
    { label: 'Bandi Attivi', value: kpis.bandiAttivi, icon: '✅', color: 'bg-green-500' },
    { label: 'Importo Concesso', value: formatCurrency(kpis.importoConcesso), icon: '💰', color: 'bg-yellow-500' },
    { label: 'Scadenze Imminenti', value: kpis.scadenzeImminenti, icon: '⏰', color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
