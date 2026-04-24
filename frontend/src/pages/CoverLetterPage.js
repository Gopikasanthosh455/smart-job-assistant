import { useState } from 'react';
import { generateCoverLetter } from '../services/api';

export default function CoverLetterPage() {
  const [form, setForm] = useState({ company_name: '', job_title: '', job_description: '' });
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLetter('');
    try {
      const res = await generateCoverLetter(form);
      setLetter(res.data.cover_letter);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Make sure you have uploaded your resume first.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 750, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>✉️ Cover Letter Generator</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Fill in the job details and get a tailored cover letter in seconds.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleGenerate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Company Name</label>
              <input
                type="text"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                placeholder="e.g. Dvilite Technology"
                required
              />
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                placeholder="e.g. Python Full Stack Developer"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Job Description</label>
            <textarea
              value={form.job_description}
              onChange={(e) => setForm({ ...form, job_description: e.target.value })}
              placeholder="Paste the full job description here..."
              rows={6}
              required
              style={{ resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '✍️ Generating cover letter...' : 'Generate Cover Letter'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
          <p style={{ color: '#888' }}>AI is writing your personalised cover letter...</p>
        </div>
      )}

      {letter && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Your Cover Letter</h2>
            <button
              onClick={handleCopy}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem' }}
            >
              {copied ? '✅ Copied!' : '📋 Copy'}
            </button>
          </div>
          <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '1.25rem', lineHeight: 1.9, fontSize: '0.9rem', color: '#333', whiteSpace: 'pre-wrap' }}>
            {letter}
          </div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            💡 Tip: Read through the letter and personalise any specific details before sending.
          </p>
        </div>
      )}
    </div>
  );
}
