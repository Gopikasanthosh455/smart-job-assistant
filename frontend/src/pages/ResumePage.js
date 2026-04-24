import { useState, useEffect } from 'react';
import { uploadResume, getResume } from '../services/api';

export default function ResumePage() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getResume()
      .then((res) => setResume(res.data))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    setSuccess('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadResume(formData);
      setResume(res.data);
      setSuccess('Resume uploaded and text extracted successfully!');
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>📄 My Resume</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Upload your PDF resume. The AI will extract your text and use it for all features.
      </p>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Upload New Resume</h2>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <label>Select PDF file</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ padding: '0.5rem', border: '1px dashed #ccc', borderRadius: 8, width: '100%', cursor: 'pointer' }}
            />
          </div>
          {file && (
            <p style={{ fontSize: '0.875rem', color: '#6c63ff', marginBottom: '0.75rem' }}>
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
          <button type="submit" className="btn btn-primary" disabled={!file || loading}>
            {loading ? 'Uploading & extracting...' : 'Upload Resume'}
          </button>
        </form>
      </div>

      {fetching ? (
        <p style={{ color: '#888' }}>Loading your resume...</p>
      ) : resume ? (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 600 }}>Current Resume</h2>
            <span style={{ fontSize: '0.8rem', color: '#888' }}>
              Uploaded: {new Date(resume.uploaded_at).toLocaleDateString()}
            </span>
          </div>
          <div style={{ background: '#f8f9fa', borderRadius: 8, padding: '1rem', maxHeight: 300, overflow: 'auto' }}>
            <pre style={{ fontSize: '0.8rem', color: '#444', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.7 }}>
              {resume.extracted_text || 'No text extracted.'}
            </pre>
          </div>
          <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#888' }}>
            ✅ This text is what the AI uses to generate your cover letters and skill match results.
          </p>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #eee' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📂</p>
          <p style={{ color: '#888' }}>No resume uploaded yet. Upload your PDF above to get started.</p>
        </div>
      )}
    </div>
  );
}
