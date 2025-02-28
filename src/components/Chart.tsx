import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  dataRange: string[];
  labelRange?: string[];
  title: string;
}

const Chart: React.FC<ChartProps> = ({ type, dataRange, labelRange, title }) => {
  const cells = useSelector((state: RootState) => state.spreadsheet.cells);

  const getData = () => {
    const data = dataRange.map(cellId => {
      const value = cells[cellId]?.value || '0';
      return parseFloat(value) || 0;
    });

    const labels = labelRange
      ? labelRange.map(cellId => cells[cellId]?.value || '')
      : dataRange;

    return {
      labels,
      datasets: [
        {
          label: title,
          data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)'
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: title
      }
    }
  };

  const renderChart = () => {
    const chartData = getData();
    switch (type) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: '400px', padding: '20px' }}>
      {renderChart()}
    </div>
  );
};

export default Chart;