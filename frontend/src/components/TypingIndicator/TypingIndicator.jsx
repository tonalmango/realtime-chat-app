import { motion } from 'framer-motion';
import './TypingIndicator.css';

function describeTypists(names) {
  if (names.length === 1) return `${names[0]} is typing`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing`;
  return `${names.length} people are typing`;
}

export default function TypingIndicator({ names }) {
  if (!names.length) return null;

  return (
    <motion.div
      className="typing-indicator"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
    >
      <div className="typing-dots">
        <span />
        <span />
        <span />
      </div>
      {describeTypists(names)}
    </motion.div>
  );
}
