import { Routes, Route, Navigate } from 'react-router-dom';

import AuthPage from './pages/AuthPage';

import ChatPage from './pages/ChatPage';


export default function AppRouter() {
  return (
    <Routes>
      
      <Route path="/auth/*" element={<AuthPage />} />
      
      <Route path="/chats/*" element={<ChatPage />} />
      
      
      <Route path="/" element={<Navigate to="/auth" replace />} />
      
    </Routes>
  );
}