import { useState } from 'react';
import { analyseSkillMatch } from '../services/api';

export default function SkillMatchPage() {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await analyseSkillMatch({ job_description: jobDescription });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Analysis failed. Make sure you have uploaded your resume first.');
    } finally {
      setLoading(false);
    }
  };

  const matchColor = (pct) => {
    if (pct >= 70) return '#00c9a7';
    if (pct >= 45) return '#f7971e';
    return '#ef5350';
  };

  return (
    <div style={{ maxWidth: 750, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>🎯 Skill Match Analyser</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Paste a job description and see how well your resume matches it.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <form onSubmit={handleAnalyse}>
          <div className="form-group">
            <label>Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
              rows={7}
              required
              style={{ resize: 'vertical' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading || !jobDescription.trim()}>
            {loading ? '🔍 Analysing...' : 'Analyse Match'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
          <p style={{ color: '#888' }}>AI is comparing your resume with the job description...</p>
        </div>
      )}

      {result && (
        <div>
          {/* Match Score */}
          <div className="card" style={{ textAlign: 'center', marginBottom: '1rem', padding: '1.5rem' }}>
            <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Overall Match Score</p>
            <div style={{ fontSize: '3.5rem', fontWeight: 700, color: matchColor(result.match_percentage) }}>
              {result.match_percentage}%
            </div>
            <div style={{ background: '#f0f0f0', borderRadius: 20, height: 10, margin: '0.75rem auto', maxWidth: 300 }}>
              <div style={{
                width: `${result.match_percentage}%`,
                height: 10, borderRadius: 20,
                background: matchColor(result.match_percentage),
                transition: 'width 1s ease'
              }} />
            </div>
            <p style={{ fontSize: '0.875rem', color: '#888' }}>
              {result.match_percentage >= 70 ? '✅ Strong match — apply with confidence!'
                : result.match_percentage >= 45 ? '⚠️ Decent match — a few gaps to address'
                : '❌ Weak match — build missing skills first'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Matched Skills */}
            <div className="card">
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#00c9a7', marginBottom: '0.75rem' }}>
                ✅ Skills You Have ({result.matched_skills?.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {result.matched_skills?.map((s, i) => (
                  <span key={i} style={{ background: '#e8f5e9', color: '#2e7d32', padding: '3px 10px', borderRadius: 20, fontSize: '0.8rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="card">
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef5350', marginBottom: '0.75rem' }}>
                ❌ Missing Skills ({result.missing_skills?.length})
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {result.missing_skills?.map((s, i) => (
                  <span key={i} style={{ background: '#ffebee', color: '#c62828', padding: '3px 10px', borderRadius: 20, fontSize: '0.8rem' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="card" style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>💪 Your Strengths</h3>
            <ul style={{ paddingLeft: '1.2rem', color: '#555', fontSize: '0.875rem', lineHeight: 2 }}>
              {result.strengths?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          {/* Suggestions */}
          <div className="card">
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.75rem' }}>💡 AI Suggestions to Improve</h3>
            <ul style={{ paddingLeft: '1.2rem', color: '#555', fontSize: '0.875rem', lineHeight: 2 }}>
              {result.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
