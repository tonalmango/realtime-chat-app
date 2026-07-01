import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [storedUsername, setStoredUsername] = useLocalStorage('chat-username', null);
  const [username, setUsername] = useState(storedUsername);
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting | online | offline | reconnecting
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [typingUsernames, setTypingUsernames] = useState([]);
  const [joinError, setJoinError] = useState(null);
  const [toast, setToast] = useState(null);

  const socketRef = useRef(null);
  const usernameRef = useRef(username);
  usernameRef.current = username;

  const showToast = useCallback((message, tone = 'error') => {
    setToast({ message, tone, id: Date.now() });
  }, []);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      autoConnect: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('online');
      // rejoin automatically if we already had a username (e.g. after a drop)
      if (usernameRef.current) {
        socket.emit('join', usernameRef.current);
      }
    });

    socket.on('disconnect', () => {
      setConnectionStatus('offline');
    });

    socket.io.on('reconnect_attempt', () => {
      setConnectionStatus('reconnecting');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('offline');
    });

    socket.on('join-success', (user) => {
      setUsername(user.username);
      setStoredUsername(user.username);
      setJoinError(null);
    });

    socket.on('join-error', (message) => {
      setJoinError(message);
    });

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, { type: 'message', ...message }]);
    });

    socket.on('user-joined', ({ username: who, timestamp }) => {
      setMessages((prev) => [...prev, { type: 'system', id: `join-${timestamp}`, text: `${who} joined the chat`, timestamp }]);
    });

    socket.on('user-left', ({ username: who, timestamp }) => {
      setMessages((prev) => [...prev, { type: 'system', id: `left-${timestamp}`, text: `${who} left the chat`, timestamp }]);
      setTypingUsernames((prev) => prev.filter((name) => name !== who));
    });

    socket.on('user-count', (count) => setOnlineCount(count));
    socket.on('online-users', (users) => setOnlineUsers(users));

    socket.on('typing', (who) => {
      setTypingUsernames((prev) => (prev.includes(who) ? prev : [...prev, who]));
    });

    socket.on('stop-typing', (who) => {
      setTypingUsernames((prev) => prev.filter((name) => name !== who));
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const joinChat = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setJoinError('Please enter a username');
      return;
    }
    setJoinError(null);
    socketRef.current?.emit('join', trimmed);
  }, []);

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (connectionStatus !== 'online') {
      showToast('You are offline. Message not sent.');
      return;
    }
    socketRef.current?.emit('send-message', trimmed);
  }, [connectionStatus, showToast]);

  const notifyTyping = useCallback(() => {
    socketRef.current?.emit('typing');
  }, []);

  const notifyStopTyping = useCallback(() => {
    socketRef.current?.emit('stop-typing');
  }, []);

  const logout = useCallback(() => {
    setUsername(null);
    setStoredUsername(null);
    setMessages([]);
    socketRef.current?.disconnect();
    socketRef.current?.connect();
  }, [setStoredUsername]);

  const value = {
    username,
    connectionStatus,
    messages,
    onlineUsers,
    onlineCount,
    typingUsernames,
    joinError,
    toast,
    joinChat,
    sendMessage,
    notifyTyping,
    notifyStopTyping,
    logout,
    dismissToast: () => setToast(null)
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used inside a ChatProvider');
  }
  return context;
}
