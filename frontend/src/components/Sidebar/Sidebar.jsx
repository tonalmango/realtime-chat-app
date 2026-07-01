import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiUsers } from 'react-icons/fi';
import { useChat } from '../../context/ChatContext';
import { getInitials } from '../../utils/avatar';
import './Sidebar.css';

const STATUS_LABEL = {
  online: 'Connected',
  offline: 'Disconnected',
  reconnecting: 'Reconnecting…',
  connecting: 'Connecting…'
};

export default function Sidebar() {
  const { username, onlineUsers, onlineCount, connectionStatus, logout } = useChat();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand">
          <span className="brand-dot" />
          Pulse Chat
        </div>
        <div className={`status-pill status-${connectionStatus}`}>
          <span className="status-dot" />
          {STATUS_LABEL[connectionStatus]}
        </div>
      </div>

      <div className="sidebar-section-title">
        <FiUsers size={14} />
        Online — {onlineCount}
      </div>

      <div className="user-list">
        <AnimatePresence initial={false}>
          {onlineUsers.map((user) => (
            <motion.div
              key={user.username}
              className="user-row"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="user-avatar" style={{ background: user.color }}>
                {getInitials(user.username)}
              </div>
              <span className="user-name">
                {user.username}
                {user.username === username && <span className="you-tag">you</span>}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="sidebar-footer">
        <div className="current-user">
          <div className="user-avatar small" style={{ background: '#5865f2' }}>
            {getInitials(username || '')}
          </div>
          <span>{username}</span>
        </div>
        <button className="logout-btn" onClick={logout} title="Log out">
          <FiLogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
