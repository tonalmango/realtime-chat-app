import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';
import { useChat } from '../../context/ChatContext';
import './MessageInput.css';

const TYPING_TIMEOUT = 1500;

export default function MessageInput() {
  const { sendMessage, notifyTyping, notifyStopTyping, connectionStatus } = useChat();
  const [text, setText] = useState('');
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  useEffect(resizeTextarea, [text]);

  const handleChange = (e) => {
    setText(e.target.value);
    notifyTyping();

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      notifyStopTyping();
    }, TYPING_TIMEOUT);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText('');
    clearTimeout(typingTimeoutRef.current);
    notifyStopTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => () => clearTimeout(typingTimeoutRef.current), []);

  const disabled = connectionStatus !== 'online';

  return (
    <div className="message-input">
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder={disabled ? 'Waiting for connection…' : 'Type a message…'}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send message"
      >
        <FiSend size={18} />
      </motion.button>
    </div>
  );
}
