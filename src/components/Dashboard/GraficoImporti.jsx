import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoImporti() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    loadChartData();
  }, []);

  async function loadChartData() {
    try {
      const { data: bandi } = await supabase
        .from('bandi')
        .select('importo_totale_concesso, created_at')
        .not('importo_totale_concesso', 'is', null);

      if (bandi && bandi.length > 0) {
        const importiPerMese = {};
        
        bandi.forEach(bando => {
          const mese = format(parseISO(bando.created_at), 'MMM yyyy', { locale: it });
          if (!importiPerMese[mese]) {
            importiPerMese[mese] = 0;
          }
          importiPerMese[mese] += bando.importo_totale_concesso;
        });

        const labels = Object.keys(importiPerMese).slice(-6);
        const data = labels.map(label => importiPerMese[label]);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Importo Concesso (€)',
              data,
              backgroundColor: 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1,
            },
          ],
        });
      }
    } catch (error) {
      console.error('Errore caricamento grafico:', error);
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Importi Concessi per Mese',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '€ ' + value.toLocaleString('it-IT');
          }
        }
      }
    }
  };

  if (!chartData) return <div>Caricamento grafico...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <Bar data={chartData} options={options} />
    </div>
  );
}
