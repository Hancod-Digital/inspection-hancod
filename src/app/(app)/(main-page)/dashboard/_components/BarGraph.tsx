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

const BarGraph = () => {
  const data = {
    labels: ['DSL Plate Lifter', 'Container', 'Lifting Equipment', 'Lifting Gear', 'Calibration'],
    datasets: [
      {
        label: 'Equipment Status',
        data: [6000, 8000, 7000, 5000, 4000],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)', // Blue
          'rgba(75, 192, 192, 0.5)', // Green
          'rgba(255, 99, 132, 0.5)', // Pink
          'rgba(255, 159, 64, 0.5)', // Orange
          'rgba(153, 102, 255, 0.5)', // Purple
        ],
        barThickness: 180, // Adjust this value to match the thickness in your image
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
        max: 10000,
        beginAtZero: true,
        ticks: {
          stepSize: 2000, // Set the step size to control the interval of ticks
          callback: function (value: any) {
            return value / 1000 + 'K'; // Display y-axis labels as 'K'
          },
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
