import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import './Dashboard.css'; // Import custom CSS for styling

const MAX_DATA_POINTS = 20; // Limit the number of data points

const Dashboard = ({ username }) => {
  const [sensorData, setSensorData] = useState({
    tds: [],
    temperature: [],
    light: [],
    ph: [],
    timestamps: [],
  });

  const { lastMessage } = useWebSocket('ws://localhost:8083', {
    onOpen: () => console.log('WebSocket connection established.'),
    onClose: () => console.log('WebSocket connection closed.'),
    onError: (error) => console.error('WebSocket error:', error),
    shouldReconnect: (closeEvent) => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        console.log('Received data:', data);
        if (data.tds && data.temperature && data.light && data.ph) {
          setSensorData((prevData) => {
            const newTimestamps = [...prevData.timestamps, new Date().toLocaleTimeString()];
            return {
              tds: [...prevData.tds, data.tds].slice(-MAX_DATA_POINTS),
              temperature: [...prevData.temperature, data.temperature].slice(-MAX_DATA_POINTS),
              light: [...prevData.light, data.light].slice(-MAX_DATA_POINTS),
              ph: [...prevData.ph, data.ph].slice(-MAX_DATA_POINTS),
              timestamps: newTimestamps.slice(-MAX_DATA_POINTS),
            };
          });
        } else {
          console.error('Invalid sensor data:', data);
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, [lastMessage]);

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'second',
        },
      },
    },
  };

  const handleLightSwitch = () => {
    // Placeholder logic for toggling light bulb state
    console.log('Toggle Light');
    // Example: send command to server or update local state
  };

  const handlePumpSwitch = () => {
    // Placeholder logic for toggling water pump state
    console.log('Toggle Water Pump');
    // Example: send command to server or update local state
  };

  // Determine status based on sensor data
  const lightStatus = sensorData.light[sensorData.light.length - 1] < 60 ? 'ON' : 'OFF';
  const pumpStatus = sensorData.ph[sensorData.ph.length - 1] > 6 ? 'ACTIVATED' : 'DEACTIVATED';

  const renderCharts = () => {
    if (sensorData.timestamps.length === 0) {
      return <p>Loading data...</p>;
    }

    return (
      <div className="charts-container">
        <div className="chart">
          <h3>TDS</h3>
          <Line 
            data={{
              labels: sensorData.timestamps,
              datasets: [{ 
                data: sensorData.tds, 
                borderColor: 'rgba(255, 255, 0, 1)', 
                fill: false 
              }]
            }} 
            options={chartOptions} 
          />
        </div>
        <div className="chart">
          <h3>Temperature</h3>
          <Line 
            data={{
              labels: sensorData.timestamps,
              datasets: [{ 
                data: sensorData.temperature, 
                borderColor: 'rgba(255, 255, 0, 1)', 
                fill: false 
              }]
            }} 
            options={chartOptions} 
          />
        </div>
        <div className="chart">
          <h3>Light</h3>
          <Line 
            data={{
              labels: sensorData.timestamps,
              datasets: [{ 
                data: sensorData.light, 
                borderColor: 'rgba(255, 255, 0, 1)', 
                fill: false 
              }]
            }} 
            options={chartOptions} 
          />
          <p>Light Bulb Status: {lightStatus}</p>
          <button onClick={handleLightSwitch} className="control-button">
            Toggle Light Bulb
          </button>
        </div>
        <div className="chart">
          <h3>pH</h3>
          <Line 
            data={{
              labels: sensorData.timestamps,
              datasets: [{ 
                data: sensorData.ph, 
                borderColor: 'rgba(255, 255, 0, 1)', 
                fill: false 
              }]
            }} 
            options={chartOptions} 
          />
          <p>Water Pump Status: {pumpStatus}</p>
          <button onClick={handlePumpSwitch} className="control-button">
            Toggle Water Pump
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard blue-background">
      <div className="header-background">
        <div className="centered-header">
          <h1>ODAKO HYDROPONICS ADMINISTRATION MONITOR</h1>
          <h2>NYACHUMA COMPANY GROUPS</h2>
          <h2>DASHBOARD</h2>
        </div>
        <div className="user-profile">
          <p>Welcome, {username}</p>
        </div>
      </div>
      {renderCharts()}
      <div className="portfolio">
        <h3>Portfolio</h3>
        <div className="portfolio-buttons">
          <a href="/path/to/cv.pdf" target="_blank" rel="noopener noreferrer" className="portfolio-button">CV</a>
          <a href="/path/to/skills.pdf" target="_blank" rel="noopener noreferrer" className="portfolio-button">Skills</a>
          <a href="/path/to/bibliography.pdf" target="_blank" rel="noopener noreferrer" className="portfolio-button">Bibliography</a>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-content">
          <h3>About the Creator</h3>
          <p>This dashboard was created by Kelvin Nyachuma Odako as a project for monitoring hydroponics systems.</p>
          <h3>Contact</h3>
          <p>Email: kelvinenyachuma387@gmail.com</p>
          <p>Phone: +255710537256</p>
          <h3>Social Media</h3>
          <p>Twitter: <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer">@example</a></p>
          <p>LinkedIn: <a href="https://linkedin.com/in/example" target="_blank" rel="noopener noreferrer">Kelvin Nyachuma Odako</a></p>
          <h3>CV</h3>
          <p>Download CV: <a href="/path/to/cv.pdf" target="_blank" rel="noopener noreferrer">CV PDF</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
