import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ month }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/categories?month=${month}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };

    fetchData();
  }, [month]);

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Categories',
        data: Object.values(data),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
        ]
      }
    ]
  };

  return (
    <div>
      <h2>Categories for {month}</h2>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
