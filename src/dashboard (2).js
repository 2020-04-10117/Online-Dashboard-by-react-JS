import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/getSensorData'); // Update with your server URL
        setSensorData(response.data);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Arduino Sensor Data Dashboard</h1>
      <div>
        {sensorData.map((data, index) => (
          <div key={index}>
            <p>TDS: {data.tds}</p>
            <p>Temperature: {data.temperature}</p>
            <p>Light: {data.light}</p>
            <p>pH: {data.ph}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
