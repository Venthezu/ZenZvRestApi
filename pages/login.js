// pages/login.js
import { useState } from 'react';
import Header from '../components/Header';
import Router from 'next/router';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e){
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const j = await res.json();
    if (j.ok) {
      localStorage.setItem('token', j.token);
      Router.push('/dashboard');
    } else setErr(j.error || 'Login failed');
  }

  return (
    <>
      <Header />
      <main style={{minHeight:'75vh',background:'linear-gradient(180deg,#4f46e5,#7c3aed)',color:'#fff',padding:'40px'}}>
        <div style={{maxWidth:520,margin:'0 auto',background:'rgba(255,255,255,0.06)',padding:24,borderRadius:12,backdropFilter:'blur(6px)'}}>
          <h2 style={{fontSize:22,fontWeight:700,marginBottom:12}}>Login to ZenZv</h2>
          <form onSubmit={submit}>
            <input required value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" style={{width:'100%',padding:10,borderRadius:8,marginBottom:8,border:'none'}} />
            <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" style={{width:'100%',padding:10,borderRadius:8,marginBottom:10,border:'none'}} />
            <button style={{padding:'10px 14px',background:'#6d28d9',color:'#fff',borderRadius:8}}>Login</button>
          </form>
          {err && <div style={{color:'#ffb4b4',marginTop:8}}>{err}</div>}
          <div style={{marginTop:12,fontSize:13}}>No account? <a href="/register" style={{color:'#c7b2ff'}}>Register</a></div>
        </div>
      </main>
    </>
  );
}