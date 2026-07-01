import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMessageSquare } from 'react-icons/fi';
import { useChat } from '../../context/ChatContext';
import MessageBubble from '../MessageBubble/MessageBubble';
import MessageInput from '../MessageInput/MessageInput';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import './ChatWindow.css';

export default function ChatWindow() {
  const { messages, username, typingUsernames, onlineCount } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUsernames]);

  const visibleTypists = typingUsernames.filter((name) => name !== username);

  return (
    <main className="chat-window">
      <header className="chat-header">
        <div>
          <h2># general</h2>
          <p>{onlineCount} {onlineCount === 1 ? 'person' : 'people'} online</p>
        </div>
      </header>

      <div className="message-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <FiMessageSquare size={36} />
            <p>No messages yet</p>
            <span>Say hello to get the conversation started</span>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const previous = messages[index - 1];
              const showAuthor =
                message.type === 'message' &&
                (!previous || previous.type !== 'message' || previous.username !== message.username);

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.type === 'message' && message.username === username}
                  showAuthor={showAuthor}
                />
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="typing-slot">
        <AnimatePresence>
          {visibleTypists.length > 0 && (
            <motion.div key="typing" exit={{ opacity: 0 }}>
              <TypingIndicator names={visibleTypists} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MessageInput />
    </main>
  );
}
