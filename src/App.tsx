import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoadingScreen from './components/LoadingScreen';
import LoginScreen from './components/LoginScreen';
import TabBar from './components/TabBar';
import InterviewPage from './pages/InterviewPage';
import StudyPage from './pages/StudyPage';
import StockPage from './pages/StocksPage';
import DocsPage from './pages/DocsPage';
import AboutPage from './pages/AboutPage';
import ScenariosPage from './pages/ScenariosPage';

import { useAuth } from './hooks/useAuth';

export default function App() {
  const { authStatus, logout, user } = useAuth();

  // Only the loading state blocks the whole app (avoids a flash of content
  // before the session check resolves). Auth is otherwise enforced per-route
  // below, so "/" and "/docs" stay public and everything else requires login.
  if (authStatus === 'loading') return <LoadingScreen />;

  const isAuthed = authStatus !== 'anon';

  const handleLogout = async () => {
    await logout();
  };

  // Wraps a gated page: renders it if authed, otherwise bounces to login.
  const requireAuth = (element: React.ReactNode) => (isAuthed ? element : <LoginScreen />);

  return (
    <>
      <TabBar onLogout={handleLogout} userEmail={user?.email} isAuthed={isAuthed} />
      <Routes>
        {/* public */}
        <Route path="/" element={<AboutPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* gated */}
        <Route path="/interview" element={requireAuth(<InterviewPage onLogout={handleLogout} />)} />
        <Route path="/study" element={requireAuth(<StudyPage />)} />
        <Route path="/stocks" element={requireAuth(<StockPage />)} />
        <Route path="/scenarios/*" element={requireAuth(<ScenariosPage />)} />


        {/* anything unrecognized falls back to the public default tab */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
