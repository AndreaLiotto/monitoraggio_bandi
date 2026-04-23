import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { supabase } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GraficoImporti() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => { loadChartData(); }, []);

  async function loadChartData() {
    try {
      // Legge importo_concesso da bandi_clienti (non più da bandi)
      const { data } = await supabase
        .from('bandi_clienti')
        .select('importo_concesso, created_at')
        .gt('importo_concesso', 0);

      if (data && data.length > 0) {
        const importiPerMese = {};

        data.forEach(bc => {
          const mese = format(parseISO(bc.created_at), 'MMM yyyy', { locale: it });
          importiPerMese[mese] = (importiPerMese[mese] || 0) + bc.importo_concesso;
        });

        const labels = Object.keys(importiPerMese).slice(-6);
        const values = labels.map(l => importiPerMese[l]);

        setChartData({
          labels,
          datasets: [{
            label: 'Importo Concesso (€)',
            data: values,
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgb(59, 130, 246)',
            borderWidth: 1,
          }],
        });
      }
    } catch (error) {
      console.error('Errore caricamento grafico:', error);
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Importi Concessi per Mese' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '€ ' + value.toLocaleString('it-IT')
        }
      }
    }
  };

  if (!chartData) return (
    <div className="bg-white rounded-lg shadow p-6 mt-8 text-center text-gray-500">
      Nessun importo concesso da visualizzare
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <Bar data={chartData} options={options} />
    </div>
  );
}
