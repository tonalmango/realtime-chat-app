import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import { useChat } from '../../context/ChatContext';
import './JoinScreen.css';

export default function JoinScreen() {
  const { joinChat, joinError, connectionStatus } = useChat();
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    joinChat(name);
  };

  return (
    <div className="join-screen">
      <motion.div
        className="join-card glass"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="join-icon">
          <FiMessageCircle size={28} />
        </div>
        <h1>Pulse Chat</h1>
        <p className="join-subtitle">Real-time conversations, no sign-up required.</p>

        <form onSubmit={handleSubmit} className="join-form">
          <input
            autoFocus
            type="text"
            placeholder="Pick a username"
            value={name}
            maxLength={20}
            onChange={(e) => setName(e.target.value)}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            disabled={connectionStatus === 'offline'}
          >
            Join chat <FiArrowRight />
          </motion.button>
        </form>

        {joinError && (
          <motion.p
            className="join-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {joinError}
          </motion.p>
        )}

        {connectionStatus === 'offline' && (
          <p className="join-error">Can't reach the server right now. Retrying...</p>
        )}
      </motion.div>
    </div>
  );
}
