'use client';
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { DashboardInspection } from '@/services/api/dashboard-service';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const LineGraph = ({ inspections }: { inspections: DashboardInspection[] }) => {
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index), 1);
    return date;
  });
  const labels = months.map((date) => date.toLocaleString('en-US', { month: 'long' }));
  const sampleData = months.map((month) => inspections.filter((item) => {
    const date = new Date(item.inspection_date ?? '');
    return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
  }).length);

  const canvasData = {
    labels,
    datasets: [
      {
        label: 'Month wise Statistics',
        borderColor: '#880E4F',
        pointRadius: 0,
        fill: true,
        backgroundColor: 'rgba(187, 37, 62, 0.1)',
        lineTension: 0.4,
        data: sampleData,
        borderWidth: 3,
      },
    ],
  };

  const options:any = {
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#000000',
          font: {
            family: 'Arial, sans-serif',
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        min: 0,
        suggestedMax: Math.max(...sampleData, 1),
        ticks: {
          precision: 0,
          color: '#000000',
          font: {
            family: 'Arial, sans-serif',
            size: 12,
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Month-wise Statistics',  // Set the title text
        align: 'center', // Align title to the start, center or end
        font: {
          family: 'Nunito',
          size: 21,  // Adjust the font size of the title
          weight: 'bold',  // Make the title bold
        },
        padding: {
          top: 10,
          bottom: 30,  // Add some padding to move the chart down
        
        },
        
      },
    },
  };

  const graphStyle = {
    minHeight: '10rem',
    maxWidth: '100%',
    width: '100%',
    borderRadius: '0.375rem',
  };
  

  return (
    <div className=" bg-white p-4" style={graphStyle}>
       
      <Line id="home" options={options} data={canvasData} />
    </div>
  );
};

export default LineGraph;
