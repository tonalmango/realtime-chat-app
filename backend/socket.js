const { colorForUsername } = require('./utils/userColor');

// in-memory store, fine for a single-instance app like this one
const onlineUsers = new Map(); // socket.id -> { username, color }
const typingUsers = new Set(); // usernames currently typing

function registerSocketHandlers(io) {
  io.on('connection', (socket) => {
    socket.on('join', (username) => {
      const trimmed = (username || '').trim();

      if (!trimmed) {
        socket.emit('join-error', 'Username cannot be empty');
        return;
      }

      const alreadyTaken = [...onlineUsers.values()].some(
        (u) => u.username.toLowerCase() === trimmed.toLowerCase()
      );

      if (alreadyTaken) {
        socket.emit('join-error', 'That username is already taken');
        return;
      }

      const user = { username: trimmed, color: colorForUsername(trimmed) };
      onlineUsers.set(socket.id, user);
      socket.data.username = trimmed;

      socket.emit('join-success', user);

      socket.broadcast.emit('user-joined', {
        username: trimmed,
        timestamp: Date.now()
      });

      io.emit('user-count', onlineUsers.size);
      io.emit('online-users', [...onlineUsers.values()]);
    });

    socket.on('send-message', (text) => {
      const user = onlineUsers.get(socket.id);
      if (!user) return;

      const trimmed = (text || '').trim();
      if (!trimmed) return;

      const message = {
        id: `${socket.id}-${Date.now()}`,
        text: trimmed,
        username: user.username,
        color: user.color,
        timestamp: Date.now()
      };

      io.emit('receive-message', message);
    });

    socket.on('typing', () => {
      const user = onlineUsers.get(socket.id);
      if (!user) return;
      typingUsers.add(user.username);
      socket.broadcast.emit('typing', user.username);
    });

    socket.on('stop-typing', () => {
      const user = onlineUsers.get(socket.id);
      if (!user) return;
      typingUsers.delete(user.username);
      socket.broadcast.emit('stop-typing', user.username);
    });

    socket.on('disconnect', () => {
      const user = onlineUsers.get(socket.id);
      if (!user) return;

      onlineUsers.delete(socket.id);
      typingUsers.delete(user.username);

      socket.broadcast.emit('user-left', {
        username: user.username,
        timestamp: Date.now()
      });

      io.emit('user-count', onlineUsers.size);
      io.emit('online-users', [...onlineUsers.values()]);
    });
  });
}

module.exports = { registerSocketHandlers };
