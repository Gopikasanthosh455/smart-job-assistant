import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/resume', label: 'My Resume' },
  { to: '/skill-match', label: 'Skill Match' },
  { to: '/cover-letter', label: 'Cover Letter' },
  { to: '/interview-prep', label: 'Interview Prep' },
  { to: '/kanban', label: 'Job Tracker' },
];

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">AI</span> JobAssist
        </Link>
        <div className="navbar-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="navbar-user">
          <span className="user-name">{user?.username}</span>
          <button className="btn btn-secondary" onClick={logoutUser}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
