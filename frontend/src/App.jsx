import { AnimatePresence } from 'framer-motion';
import { ChatProvider, useChat } from './context/ChatContext';
import JoinScreen from './components/JoinScreen/JoinScreen';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/ChatWindow/ChatWindow';
import Toast from './components/Toast/Toast';
import './App.css';

function ChatLayout() {
  const { username, toast, dismissToast } = useChat();

  return (
    <div className="app-shell">
      <AnimatePresence>
        {toast && <Toast toast={toast} onDismiss={dismissToast} />}
      </AnimatePresence>

      {username ? (
        <div className="chat-layout">
          <Sidebar />
          <ChatWindow />
        </div>
      ) : (
        <JoinScreen />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ChatProvider>
      <ChatLayout />
    </ChatProvider>
  );
}
