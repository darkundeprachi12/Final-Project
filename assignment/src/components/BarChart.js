import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const BarChart = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/price-range?month=${month}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching price ranges', error);
      }
    };

    fetchData();
  }, [month]);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Number of Items',
        data: Object.values(data),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }
    ]
  };

  return (
    <div>
      <h2>Price Range for {month}</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
