import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './App.css';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

const MAX_DATA_POINTS = 20;

const App = () => {
  const [sensorData, setSensorData] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'TDS',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'Temperature',
        data: [],
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
      {
        label: 'Light',
        data: [],
        borderColor: 'rgba(54,162,235,1)',
        fill: false,
      },
      {
        label: 'pH',
        data: [],
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
    ],
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:8083', {
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
          setSensorData(data);
          setChartData((prevState) => {
            const newLabels = [...prevState.labels, new Date().toLocaleTimeString()];
            const newTdsData = [...prevState.datasets[0].data, data.tds];
            const newTemperatureData = [...prevState.datasets[1].data, data.temperature];
            const newLightData = [...prevState.datasets[2].data, data.light];
            const newPhData = [...prevState.datasets[3].data, data.ph];

            // Limit the number of data points
            if (newLabels.length > MAX_DATA_POINTS) {
              newLabels.shift();
              newTdsData.shift();
              newTemperatureData.shift();
              newLightData.shift();
              newPhData.shift();
            }

            return {
              ...prevState,
              labels: newLabels,
              datasets: [
                { ...prevState.datasets[0], data: newTdsData },
                { ...prevState.datasets[1], data: newTemperatureData },
                { ...prevState.datasets[2], data: newLightData },
                { ...prevState.datasets[3], data: newPhData },
              ],
            };
          });
        } else {
          console.warn('Received incomplete data:', data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard sensorData={sensorData} chartData={chartData} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
