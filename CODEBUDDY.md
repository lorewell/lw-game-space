# CODEBUDDY.md This file provides guidance to CodeBuddy when working with code in this repository.

## Project Overview

This is a real-time game对战平台 (game battle platform) built with Vue 3 + Colyseus for multiplayer game rooms. The platform supports:
- Real-time hall chat with WebSocket
- Multiple game rooms (9 rooms in 3x3 grid)
- Player matchmaking and game state synchronization

## Development Commands

### Client (Vue 3 + Vite)
```bash
cd client
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build
npm run type-check   # TypeScript type checking
```

### Server (Node.js + Colyseus)
```bash
cd server
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Compile TypeScript
npm start            # Run production build
```

## Architecture

### Client Architecture (Vue 3 + Pinia)

**State Management** (`src/stores/`):
- `user.ts` - Current user info (id, name, avatar, level)
- `hall.ts` - Hall room connection via Colyseus WebSocket, manages online users and chat messages
- `system.ts` - System notifications and announcements

**Routing** (`src/router/index.ts`):
- `/` → Room selection (大厅)
- `/game/:roomId` → Game room

**Key Patterns**:
- Pinia stores use singleton Colyseus client instances
- Hall store auto-connects on mount, auto-disconnects on unmount
- API calls use axios instance in `src/api/`

### Server Architecture (Colyseus + Express)

**Room Types** (`server/src/rooms/`):
- `GameRoom` - Game room with player management (max 4 clients)
- `HallRoom` - Lobby for chat and online user tracking

**State Synchronization**:
- Uses Colyseus Schema for automatic state sync between server and clients
- Client state updates via `room.state` listeners

**REST APIs** (`server/src/routes/`):
- `/api/user` - User CRUD operations
- `/api/room` - Room listing

**Database**:
- MongoDB (`server/src/db/mongo.ts`) - User and room persistence
- Redis (`server/src/db/redis.ts`) - Real-time state caching

## Important Conventions

1. **User Identification**: User IDs are generated client-side and stored in localStorage, then persisted to MongoDB on server
2. **Colyseus Connection**: Hall room connects via WebSocket to `ws://localhost:3000`
3. **Type Definitions**: Shared types in `client/src/types/common.ts`
4. **CSS**: Global styles in `style.css` with CSS variables for theming; component styles use SCSS

## Key Files

- `client/src/views/room.vue` - Main room selection UI
- `client/src/components/RoomBox.vue` - Individual room card component
- `client/src/layouts/components/PageSide.vue` - Sidebar with user info, announcements, and chat
- `server/src/rooms/HallRoom.ts` - Lobby WebSocket room logic
- `server/src/rooms/GameRoom.ts` - Game room logic
