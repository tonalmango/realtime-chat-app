require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const { registerSocketHandlers } = require('./socket');

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Chat server is running');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Chat server listening on port ${PORT}`);
});
