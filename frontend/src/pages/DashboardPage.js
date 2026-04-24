import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { to: '/resume', icon: '📄', title: 'Upload Resume', desc: 'Upload your PDF resume — AI extracts and stores your skills automatically.', badge: 'Start here' },
  { to: '/skill-match', icon: '🎯', title: 'Skill Match Analyser', desc: 'Paste a job description and see how well your resume matches it with a % score.', badge: 'AI powered' },
  { to: '/cover-letter', icon: '✍️', title: 'Cover Letter Generator', desc: 'Get a tailored cover letter generated in seconds based on the JD and your resume.', badge: 'AI powered' },
  { to: '/interview-prep', icon: '🤖', title: 'Interview Prep', desc: 'Generate role-specific interview questions with tips for any job description.', badge: 'AI powered' },
  { to: '/kanban', icon: '📊', title: 'Job Tracker', desc: 'Track all your applications in a Kanban board — Applied, Interview, Offer, Rejected.', badge: 'Organise' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">Welcome back, {user?.username} 👋</h1>
        <p className="page-sub">Your AI-powered job application assistant. Start by uploading your resume.</p>
      </div>

      <div className="grid-2">
        {features.map((f) => (
          <Link key={f.to} to={f.to} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'border-color 0.2s', borderColor: '#e8e8f0' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#6c63ff'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e8e8f0'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>{f.icon}</span>
                <span className="badge badge-purple">{f.badge}</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem', color: '#1a1a2e' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#777', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: '1rem', background: '#f0f0ff', border: '1px solid #d0caff' }}>
        <p style={{ fontSize: '0.875rem', color: '#534AB7', lineHeight: 1.6 }}>
          <strong>Quick tip:</strong> Upload your resume first (step 1), then use Skill Match or Cover Letter — the AI uses your resume text to personalise all results.
        </p>
      </div>
    </div>
  );
}
