import { motion } from 'framer-motion';
import { getInitials, formatTime } from '../../utils/avatar';
import './MessageBubble.css';

export default function MessageBubble({ message, isOwn, showAuthor }) {
  if (message.type === 'system') {
    return (
      <div className="system-message">
        <span>{message.text}</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`bubble-row ${isOwn ? 'own' : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {!isOwn && (
        <div
          className="bubble-avatar"
          style={{ background: message.color, visibility: showAuthor ? 'visible' : 'hidden' }}
        >
          {getInitials(message.username)}
        </div>
      )}

      <div className="bubble-content">
        {showAuthor && !isOwn && <span className="bubble-author">{message.username}</span>}
        <div className={`bubble ${isOwn ? 'bubble-own' : 'bubble-other'}`}>
          <p>{message.text}</p>
        </div>
        <span className="bubble-time">{formatTime(message.timestamp)}</span>
      </div>
    </motion.div>
  );
}
