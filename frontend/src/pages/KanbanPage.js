import { useState, useEffect } from 'react';
import { getKanban, createApplication, updateApplication, deleteApplication } from '../services/api';

const COLUMNS = [
  { key: 'applied', label: 'Applied', color: '#29b6f6', bg: '#e1f5fe' },
  { key: 'interview', label: 'Interview', color: '#f7971e', bg: '#fff8e1' },
  { key: 'offer', label: 'Offer', color: '#00c9a7', bg: '#e0f7fa' },
  { key: 'rejected', label: 'Rejected', color: '#ef5350', bg: '#ffebee' },
];

export default function KanbanPage() {
  const [board, setBoard] = useState({ applied: [], interview: [], offer: [], rejected: [] });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company_name: '', job_title: '', job_url: '', job_description: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchBoard = () => {
    getKanban()
      .then((res) => setBoard(res.data))
      .catch(() => setError('Failed to load board.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBoard(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createApplication({ ...form, status: 'applied' });
      setShowForm(false);
      setForm({ company_name: '', job_title: '', job_url: '', job_description: '', notes: '' });
      fetchBoard();
    } catch {
      setError('Failed to add application.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplication(id, { status: newStatus });
      fetchBoard();
    } catch {
      setError('Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await deleteApplication(id);
      fetchBoard();
    } catch {
      setError('Failed to delete.');
    }
  };

  const totalCount = Object.values(board).reduce((a, c) => a + c.length, 0);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.2rem' }}>📋 Job Tracker</h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>{totalCount} application{totalCount !== 1 ? 's' : ''} tracked</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="card" style={{ marginBottom: '1.5rem', border: '2px solid #6c63ff30' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem', color: '#6c63ff' }}>Add New Application</h2>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Company Name *</label>
                <input value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="Dvilite Technology" required />
              </div>
              <div className="form-group">
                <label>Job Title *</label>
                <input value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} placeholder="Python Full Stack Developer" required />
              </div>
            </div>
            <div className="form-group">
              <label>Job URL</label>
              <input type="url" value={form.job_url} onChange={(e) => setForm({ ...form, job_url: e.target.value })} placeholder="https://linkedin.com/jobs/..." />
            </div>
            <div className="form-group">
              <label>Job Description</label>
              <textarea value={form.job_description} onChange={(e) => setForm({ ...form, job_description: e.target.value })} rows={3} placeholder="Paste JD here (used for AI features)..." style={{ resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label>Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any personal notes..." />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Adding...' : 'Add Application'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Loading your board...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem' }}>
          {COLUMNS.map((col) => (
            <div key={col.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: col.color, display: 'inline-block' }} />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{col.label}</span>
                <span style={{ marginLeft: 'auto', background: col.bg, color: col.color, fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: 20 }}>
                  {board[col.key]?.length || 0}
                </span>
              </div>

              <div style={{ minHeight: 200 }}>
                {board[col.key]?.length === 0 ? (
                  <div style={{ border: '2px dashed #eee', borderRadius: 10, padding: '1rem', textAlign: 'center', color: '#ccc', fontSize: '0.8rem' }}>
                    No applications
                  </div>
                ) : (
                  board[col.key]?.map((app) => (
                    <div key={app.id} className="card" style={{ marginBottom: '0.75rem', padding: '0.875rem' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.2rem' }}>{app.job_title}</p>
                      <p style={{ color: '#888', fontSize: '0.8rem', marginBottom: '0.6rem' }}>{app.company_name}</p>
                      <p style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
                        Applied: {new Date(app.applied_date).toLocaleDateString()}
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        {COLUMNS.filter((c) => c.key !== col.key).map((c) => (
                          <button
                            key={c.key}
                            onClick={() => handleStatusChange(app.id, c.key)}
                            style={{ fontSize: '0.7rem', padding: '2px 8px', background: c.bg, color: c.color, border: `1px solid ${c.color}40`, borderRadius: 20, cursor: 'pointer' }}
                          >
                            → {c.label}
                          </button>
                        ))}
                        <button
                          onClick={() => handleDelete(app.id)}
                          style={{ fontSize: '0.7rem', padding: '2px 8px', background: '#ffebee', color: '#ef5350', border: '1px solid #ef535040', borderRadius: 20, cursor: 'pointer', marginLeft: 'auto' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
