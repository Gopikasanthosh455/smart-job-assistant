import { useState } from 'react';
import { generateInterviewQuestions } from '../services/api';

export default function InterviewPrepPage() {
  const [form, setForm] = useState({ job_title: '', job_description: '' });
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openTip, setOpenTip] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuestions(null);
    try {
      const res = await generateInterviewQuestions(form);
      setQuestions(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const QList = ({ title, emoji, color, items }) => (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color, marginBottom: '0.75rem' }}>
        {emoji} {title} ({items?.length})
      </h3>
      {items?.map((q, i) => (
        <div key={i} style={{ borderBottom: i < items.length - 1 ? '1px solid #f0f0f0' : 'none', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
          <p style={{ fontSize: '0.9rem', color: '#333', fontWeight: 500, marginBottom: '0.25rem' }}>
            {i + 1}. {q.question}
          </p>
          <button
            onClick={() => setOpenTip(openTip === `${title}-${i}` ? null : `${title}-${i}`)}
            style={{ fontSize: '0.75rem', color: '#6c63ff', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            {openTip === `${title}-${i}` ? '▲ Hide tip' : '▼ Show answer tip'}
          </button>
          {openTip === `${title}-${i}` && (
            <div style={{ marginTop: '0.5rem', background: '#f3f0ff', borderRadius: 6, padding: '0.6rem 0.8rem', fontSize: '0.8rem', color: '#555', lineHeight: 1.6 }}>
              💡 {q.tip}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: 750, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>🧠 Interview Prep</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Get AI-generated interview questions tailored to the role. Click each question to reveal answer tips.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleGenerate}>
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
          <div className="form-group">
            <label>Job Description</label>
            <textarea
              value={form.job_description}
              onChange={(e) => setForm({ ...form, job_description: e.target.value })}
              placeholder="Paste the job description here..."
              rows={5}
              required
              style={{ resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '🤖 Generating questions...' : 'Generate Interview Questions'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
          <p style={{ color: '#888' }}>AI is preparing your interview questions...</p>
        </div>
      )}

      {questions && (
        <div>
          <QList title="Technical Questions" emoji="💻" color="#6c63ff" items={questions.technical} />
          <QList title="Behavioural Questions" emoji="🤝" color="#f7971e" items={questions.behavioural} />
          <QList title="Project Questions" emoji="🏗️" color="#00c9a7" items={questions.project} />
          <div className="card" style={{ background: '#fff8e1', border: '1px solid #ffe082' }}>
            <p style={{ fontSize: '0.875rem', color: '#795548', lineHeight: 1.7 }}>
              <strong>💡 How to use this:</strong> Go through each question out loud. Don't memorise answers — understand the concept behind each one.
              For technical questions, be able to explain with a real example from your projects.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
