"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch download link");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <div className="premium-badge">PRO</div>
      <h1 className="title">Seal Tools</h1>
      <p className="subtitle">
        The ultimate, high-fidelity media downloader for YouTube, Twitter, Instagram, and TikTok. No ads. No trackers.
      </p>

      <div className="glass-panel">
        <form className="input-group" onSubmit={handleDownload}>
          <input
            type="url"
            className="url-input"
            placeholder="Paste your link here..."
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit" className="download-btn" disabled={loading}>
            {loading ? (
              <span className="spinner" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            )}
            {loading ? "Processing..." : "Download"}
          </button>
        </form>

        {error && (
          <div style={{ color: '#ff4d4d', marginTop: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px' }}>
            {result.thumbnail && (
              <img src={result.thumbnail} alt="Thumbnail" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px' }} />
            )}
            <div style={{ textAlign: 'center', fontWeight: '500' }}>{result.title}</div>
            <a href={result.downloadUrl} target="_blank" rel="noreferrer" style={{ background: '#28a745', color: 'white', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
              Direct Download Link
            </a>
          </div>
        )}

        <div className="tier-info" style={{ marginTop: '1.5rem' }}>
          Free tier allows 5 downloads/day. <a href="#" className="tier-link">Upgrade to Premium</a>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="features-list">
        <div className="feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6d365" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          Up to 4K Resolution
        </div>
        <div className="feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6d365" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          100% Secure & Private
        </div>
        <div className="feature-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6d365" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          Lightning Fast
        </div>
      </div>
    </main>
  );
}
