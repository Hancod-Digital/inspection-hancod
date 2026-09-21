import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { DashboardEquipment } from '@/services/api/dashboard-service';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string[];
      barThickness?: number;
    }[];
  };
  options?: any;
}

const graphStyle = {
  maxHeight: '30rem',
  maxWidth: '100%',
  width: '100%',
  borderRadius: '0.375rem',
};

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  return <Bar data={data} options={options} className='bg-white p-10' style={graphStyle} />;
};

const BarGraph = ({ equipment }: { equipment: DashboardEquipment[] }) => {
  const counts = equipment.reduce<Record<string, number>>((result, item) => {
    const type = item.item_type ?? item.property_table_type ?? 'Uncategorized';
    result[type] = (result[type] ?? 0) + 1;
    return result;
  }, {});
  const labels = Object.keys(counts).slice(0, 10);
  const data = {
    labels,
    datasets: [
      {
        label: 'Equipment Status',
        data: labels.map((label) => counts[label]),
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)', // Blue
          'rgba(75, 192, 192, 0.5)', // Green
          'rgba(255, 99, 132, 0.5)', // Pink
          'rgba(255, 159, 64, 0.5)', // Orange
          'rgba(153, 102, 255, 0.5)', // Purple
        ],
        barThickness: 80,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Equipment Status per Equipment Type',
        font: {
          size: 18,
          family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove grid lines on the x-axis
        },
      },
      y: {
        min: 0,
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          display: false, // Remove grid lines on the y-axis
        },
      },
    },
  };

  return <BarChart data={data} options={options} />;
};

export default BarGraph;
