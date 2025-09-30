// components/Header.jsx
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header(){
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <>
      <style jsx>{`
        .zvz-header{
          display:flex;align-items:center;justify-content:space-between;padding:12px 16px;
          background: linear-gradient(90deg,#4f46e5 0%, #7c3aed 50%, #4f46e5 100%);
          color:#fff; position:relative;
        }
        .brand{display:flex;gap:12px;align-items:center}
        .logo{width:44px;height:44px;border-radius:10px;background:linear-gradient(135deg,#60a5fa,#a78bfa);display:flex;align-items:center;justify-content:center;font-weight:800;box-shadow:0 8px 22px rgba(79,70,229,0.25)}
        .menu-btn{background:transparent;border:0;color:white;font-size:22px;padding:8px;border-radius:8px}
        .slide{position:fixed;top:0;right:0;height:100vh;width:320px;background:linear-gradient(180deg,#4f46e5,#7c3aed);transform:translateX(110%);transition:transform .28s ease;padding:28px;z-index:1000;color:white}
        .slide.open{transform:translateX(0)}
        .menu-link{display:block;padding:12px 14px;border-radius:10px;margin-bottom:10px;text-decoration:none;color:white;background:rgba(255,255,255,0.04)}
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.28);z-index:900}
        @media(min-width:768px){
          .menu-btn{display:none}
          .slide{position:static;transform:none;background:transparent;height:auto;width:auto;padding:0;display:flex;gap:8px}
        }
      `}</style>

      <header className="zvz-header">
        <div className="brand">
          <div className="logo">ZV</div>
          <div>
            <div style={{fontWeight:700}}>ZenZv</div>
            <div style={{fontSize:12,opacity:0.9}}>Image • Video • Share</div>
          </div>
        </div>

        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <nav className="desktop-menu" aria-hidden="true" style={{display:'none'}} />
          <button className="menu-btn" onClick={() => setOpen(true)} aria-label="open menu">☰</button>
        </div>
      </header>

      <div className={`slide ${open ? 'open' : ''}`} role="dialog" aria-hidden={!open}>
        <button onClick={() => setOpen(false)} style={{background:'transparent',border:0,color:'white',fontSize:20,marginBottom:12}}>✕</button>
        <a className="menu-link" href="/swagger" >Docs</a>
        <a className="menu-link" href="/dashboard" >Dashboard</a>
        <a className="menu-link" href="https://saweria.co/yourusername" target="_blank" rel="noreferrer">Donate — Saweria</a>
        <a className="menu-link" href="https://wa.me/6283840095883" target="_blank" rel="noreferrer">Contact — WhatsApp</a>
        <a className="menu-link" href="https://t.me/ZenmaOme" target="_blank" rel="noreferrer">Join — Telegram</a>

        <hr style={{borderColor:'rgba(255,255,255,0.06)',margin:'12px 0'}} />

        <div style={{fontSize:13,opacity:0.95}}>Support ZenZv — small donation keeps server online 💜</div>
      </div>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}
    </>
  );
}