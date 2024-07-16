const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const port = 5003;

app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Add your MySQL password if required
  database: 'arduino_data'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

const wss = new WebSocket.Server({ port: 8084 }); // Changed port to 8081

wss.on('connection', ws => {
  console.log('New client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

setInterval(() => {
  const query = 'SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 1';
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return;
    }
    if (result.length > 0) {
      const data = result[0];
      console.log('Sending data:', data); // Add this line to log the data being sent
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  });
}, 1000);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
