import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResumePage from './pages/ResumePage';
import CoverLetterPage from './pages/CoverLetterPage';
import SkillMatchPage from './pages/SkillMatchPage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import KanbanPage from './pages/KanbanPage';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/resume" element={<PrivateRoute><ResumePage /></PrivateRoute>} />
          <Route path="/cover-letter" element={<PrivateRoute><CoverLetterPage /></PrivateRoute>} />
          <Route path="/skill-match" element={<PrivateRoute><SkillMatchPage /></PrivateRoute>} />
          <Route path="/interview-prep" element={<PrivateRoute><InterviewPrepPage /></PrivateRoute>} />
          <Route path="/kanban" element={<PrivateRoute><KanbanPage /></PrivateRoute>} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
