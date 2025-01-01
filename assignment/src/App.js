import React, { useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import './App.css';

const App = () => {
  const [month, setMonth] = useState('March');

  return (
    <div className="App">
      <h1>Assignment: Transaction Table</h1>
      <label htmlFor="month">Select Month: </label>
      <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <TransactionsTable month={month} />
      <div className="chart-row">
        <div className="chart-container">
          <Statistics month={month} />
        </div>
        <div className="chart-container">
          <BarChart month={month} />
        </div>
        <div className="chart-container">
          <PieChart month={month} />
        </div>
      </div>
    </div>
  );
};

export default App;
