# Pulse Chat

A real-time chat application built with React, Node.js, Express, and Socket.io. No accounts, no passwords — pick a username and start talking.

![status](https://img.shields.io/badge/status-active-success)

## Overview

Pulse Chat is a single-room, real-time messaging app. It was built as a self-contained full-stack project: a Socket.io backend that tracks connected users and broadcasts events, and a React frontend with a dark, glassmorphic UI inspired by Discord/Slack/Telegram Web.

There's no database — presence and messages live in memory for the duration of the server process, which keeps the project small and easy to run.

## Features

- Join with just a username (no password), persisted in `localStorage` so a refresh keeps you logged in
- Instant message delivery over WebSockets
- System messages when someone joins or leaves
- Live typing indicator ("Alice is typing…")
- Online user list with a live count
- Connection status indicator (connected / reconnecting / offline) with automatic reconnect
- Enter to send, Shift+Enter for a new line
- Auto-scroll to the latest message
- Message bubbles with distinct styling for your own messages vs. others', color-coded per-user avatars, and timestamps
- Toast notifications for errors (e.g. sending a message while offline)
- Empty-state screen for a fresh chat room
- Animated transitions throughout (Framer Motion) — message fade-ins, join card entrance, typing dots, hover/tap feedback
- Fully responsive layout

## Tech Stack

**Backend:** Node.js, Express, Socket.io, CORS, dotenv, nodemon

**Frontend:** React (Vite), Socket.io-client, Framer Motion, React Icons, plain CSS (no UI framework)

## Screenshots

> _Add screenshots here before publishing — e.g._
> `docs/screenshot-join.png`, `docs/screenshot-chat.png`, `docs/screenshot-mobile.png`

## Folder Structure

```
realtime-chat-app/
├── backend/
│   ├── server.js          # Express app + Socket.io bootstrap
│   ├── socket.js          # All socket event handlers
│   ├── utils/
│   │   └── userColor.js   # Deterministic avatar color per username
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── JoinScreen/
    │   │   ├── Sidebar/
    │   │   ├── ChatWindow/
    │   │   ├── MessageBubble/
    │   │   ├── MessageInput/
    │   │   ├── TypingIndicator/
    │   │   └── Toast/
    │   ├── context/
    │   │   └── ChatContext.jsx   # owns the socket connection + chat state
    │   ├── hooks/
    │   │   └── useLocalStorage.js
    │   ├── utils/
    │   │   └── avatar.js
    │   ├── styles/
    │   │   └── global.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── .env.example
```

## Installation & Running

Requires Node.js 18+.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

The server starts on `http://localhost:5000` (configurable via `PORT` in `.env`).

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app opens on `http://localhost:5173`. Make sure `VITE_SERVER_URL` in `frontend/.env` points at the backend URL.

Open the app in two different browser tabs (or one normal + one incognito) with different usernames to see real-time messaging, typing indicators, and join/leave events in action.

## Environment Variables

**backend/.env**
```
PORT=5000
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_SERVER_URL=http://localhost:5000
```

## Socket Events Reference

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| `join` | client → server | `username: string` | Request to join the room |
| `join-success` | server → client | `{ username, color }` | Confirms join, returns assigned avatar color |
| `join-error` | server → client | `string` | Rejected join (empty or duplicate username) |
| `send-message` | client → server | `text: string` | Send a chat message |
| `receive-message` | server → all clients | `{ id, text, username, color, timestamp }` | Broadcast a new message |
| `typing` / `stop-typing` | client ↔ server | `username: string` | Typing indicator state |
| `user-joined` / `user-left` | server → clients | `{ username, timestamp }` | Presence system messages |
| `user-count` | server → all clients | `number` | Live count of connected users |
| `online-users` | server → all clients | `[{ username, color }]` | Full online user list, for the sidebar |
| `disconnect` | client ↔ server | — | Cleans up presence state |

## Manual Testing Checklist

- [ ] Joining with an empty username shows an inline error
- [ ] Joining with a username that's already in use shows an inline error
- [ ] Joining with a valid username enters the chat room
- [ ] Refreshing the page keeps you logged in (localStorage)
- [ ] Logging out returns you to the join screen and clears the session
- [ ] Sending a message appears instantly in your own tab and any other open tab
- [ ] Your own messages are visually distinct from other users' messages
- [ ] Typing in the input triggers a typing indicator in other tabs
- [ ] Typing indicator disappears after you stop typing or send the message
- [ ] Opening a second tab shows a "X joined the chat" system message and updates the online count
- [ ] Closing a tab shows a "X left the chat" message in the remaining tab(s)
- [ ] Enter sends a message; Shift+Enter inserts a newline instead
- [ ] Stopping the backend shows a "Disconnected" / "Reconnecting" status, and restarting it auto-reconnects and rejoins
- [ ] Sending a message while offline shows a toast instead of silently failing
- [ ] The empty chat state appears before any message has been sent
- [ ] Layout holds up on a narrow/mobile viewport

## Future Improvements

- Persistent message history (Postgres/Mongo) instead of in-memory state
- Multiple rooms/channels
- Message reactions and edit/delete
- Rich text and image/file sharing
- Read receipts
- Rate limiting on message sends
- Horizontal scaling via a Redis adapter for Socket.io

## Commit History (suggested)

If you're pushing this to GitHub, a natural commit sequence looks like:

1. `chore: scaffold backend with express and socket.io`
2. `feat: implement join, message, and presence socket events`
3. `chore: scaffold frontend with vite + react`
4. `feat: build join screen and chat context`
5. `feat: add sidebar, message bubbles, and typing indicator`
6. `style: dark theme, glassmorphism, animations`
7. `feat: reconnect handling and offline toast`
8. `docs: add README`

## License

MIT — free to use for learning, portfolio, or internship submissions.
