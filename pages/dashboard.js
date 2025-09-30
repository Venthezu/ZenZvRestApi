// pages/dashboard.js
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Router from 'next/router';

export default function Dashboard(){
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) { Router.push('/login'); return; }
    (async () => {
      const r = await fetch('/api/me', { headers: { Authorization: 'Bearer ' + t }});
      const j = await r.json();
      if (!j.ok) { localStorage.removeItem('token'); Router.push('/login'); return; }
      setUser(j.user);
    })();
  }, []);

  async function upload(e){
    e.preventDefault();
    setErr(''); setResult(null);
    if (!file) { setErr('Choose file'); return; }
    const fd = new FormData();
    fd.append('file', file);
    const t = localStorage.getItem('token');
    const r = await fetch('/api/upload', { method: 'POST', body: fd, headers: { Authorization: 'Bearer ' + t }});
    const j = await r.json();
    if (j.ok) setResult(j);
    else setErr(j.error || 'Upload failed');
  }

  function logout(){ localStorage.removeItem('token'); Router.push('/login'); }

  return (
    <>
      <Header />
      <main style={{minHeight:'75vh',background:'linear-gradient(180deg,#4f46e5,#7c3aed)',color:'#fff',padding:30}}>
        <div style={{maxWidth:980, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 360px', gap:20}}>
          <section style={{background:'rgba(255,255,255,0.06)',padding:20,borderRadius:12}}>
            <h2 style={{fontSize:18,fontWeight:700}}>Welcome, {user?.username}</h2>
            <p style={{opacity:0.9}}>Here you can upload images & videos and get direct URLs.</p>

            <form onSubmit={upload} style={{marginTop:12}}>
              <input type="file" accept="image/*,video/*" onChange={e=>setFile(e.target.files[0])} />
              <div style={{marginTop:10}}>
                <button style={{padding:'8px 12px',background:'#6d28d9',color:'#fff',borderRadius:8}}>Upload</button>
              </div>
            </form>

            {err && <div style={{color:'#ffb4b4',marginTop:8}}>{err}</div>}
            {result && (
              <div style={{marginTop:12,background:'rgba(255,255,255,0.03)',padding:12,borderRadius:8}}>
                <div><strong>URL:</strong> <a href={result.url} target="_blank" rel="noreferrer" style={{color:'#c7b2ff'}}>{result.url}</a></div>
                <div style={{fontSize:13,opacity:0.85}}>Filename: {result.filename} — {result.mime} — {result.size} bytes</div>
              </div>
            )}

            <div style={{marginTop:18}}>
              <button onClick={logout} style={{padding:'8px 10px',background:'transparent',border:'1px solid rgba(255,255,255,0.06)',color:'#fff',borderRadius:8}}>Logout</button>
            </div>
          </section>

          <aside style={{background:'rgba(255,255,255,0.04)',padding:18,borderRadius:12}}>
  <h3 style={{fontWeight:700}}>API Docs (quick)</h3>
  <div style={{marginTop:8,fontSize:13}}>
    <div>
      <strong>POST /api/upload</strong> (auth) — form-data field <code>file</code> — returns JSON <code>{`{ ok, url, filename, size, mime }`}</code>
    </div>
    <div style={{marginTop:8}}>
      <strong>POST /api/auth/login</strong> — body JSON <code>{`{ username, password }`}</code> — returns <code>{`{ ok, token }`}</code>
    </div>
    <div style={{marginTop:8}}>
      <strong>POST /api/auth/register</strong> — body JSON <code>{`{ username, password }`}</code>
    </div>
  </div>
</aside>
        </div>
      </main>
    </>
  );
}
