import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import logo from '../assets/al-barid-bank.jpg';
import loginBg from '../assets/LOGIN.jpeg';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Veuillez remplir tous les champs'); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      const routes = { admin: '/admin', siege: '/siege', agence: '/agence', guichetier: '/agence' };
      navigate(user.must_change_password ? '/change-password' : (routes[user.role] || '/'));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'row',
      fontFamily: '"DM Sans", "Inter", sans-serif',
      background: '#f8f9fa',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        
        .input-field {
          width: 100%;
          padding: 16px 20px 16px 52px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          font-size: 1.1rem;
          outline: none;
          color: #111827;
          transition: all 0.2s ease-in-out;
        }
        .input-field:focus {
          border-color: #fad31f;
          box-shadow: 0 0 0 3px rgba(250, 211, 31, 0.15);
        }
        .input-field::placeholder { color: #9ca3af; }

        .btn-connect {
          width: 100%;
          padding: 16px;
          background: #fad31f;
          color: #111827;
          border: none;
          border-radius: 10px;
          font-weight: 800;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .btn-connect:hover:not(:disabled) {
          background: #fae650;
          box-shadow: 0 8px 20px rgba(250, 211, 31, 0.3);
          transform: translateY(-2px);
        }
        .btn-connect:disabled {
          cursor: not-allowed;
          opacity: 0.8;
        }

        .forgot-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: #d4a017;
          cursor: pointer;
          transition: color 0.15s;
          text-decoration: none;
        }
        .forgot-link:hover { text-decoration: underline; }

        .card-enter {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .card-enter.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          .left-panel { display: none !important; }
          .right-panel { padding: 20px !important; }
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div
        className="left-panel"
        style={{
          flex: 1,
          position: 'relative',
          backgroundImage: `url(${loginBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 20%',
          backgroundSize: 'cover',
          overflow: 'hidden'
        }}
      >
        {/* Dark Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(15,25,41,0.6) 0%, rgba(15,25,41,0.2) 100%)',
          zIndex: 1
        }} />

        {/* Decorative Gold Arc - Top Left */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          left: '-20%',
          width: '80%',
          height: '140%',
          borderRight: '12px solid rgba(250, 211, 31, 0.9)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2,
          boxShadow: '20px 0 50px rgba(0,0,0,0.3)'
        }} />

        {/* Decorative Gold Arc - Bottom Left */}
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: '60%',
          height: '60%',
          borderTop: '6px solid rgba(250, 211, 31, 0.6)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="right-panel"
        style={{
          flex: 1.1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8f9fa',
          position: 'relative',
          padding: '40px'
        }}
      >
        {/* Subtle Dotted Pattern in Background */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundImage: 'radial-gradient(#d1d5db 2px, transparent 2px)',
          backgroundSize: '20px 20px',
          opacity: 0.3,
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Golden swoosh bottom right */}
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '40%',
          height: '40%',
          borderTop: '8px solid rgba(250, 211, 31, 0.7)',
          borderLeft: '8px solid rgba(250, 211, 31, 0.7)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Login Card */}
        <div
          className={`card-enter ${mounted ? 'mounted' : ''}`}
          style={{
            width: '100%',
            maxWidth: '540px',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '48px 56px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0,0,0,0.05)',
            position: 'relative',
            zIndex: 5
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <img src={logo} alt="Al Barid Bank" style={{ height: 60, objectFit: 'contain', marginBottom: 12 }} />
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f1929', margin: '0 0 8px 0', letterSpacing: '-0.03em', fontFamily: "'Inter', sans-serif" }}>Bienvenue</h2>
            <p style={{ fontSize: '1.05rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
              Connectez-vous à votre espace sécurisé<br />de gestion bancaire
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Email Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1f2937' }}>Adresse Email</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <HiOutlineMail size={22} style={{ position: 'absolute', left: 16, color: emailFocused ? '#fad31f' : '#9ca3af', transition: 'color 0.2s' }} />
                <input
                  type="email"
                  placeholder="Entrez votre adresse email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Password Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1f2937' }}>Mot de Passe</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <HiOutlineLockClosed size={22} style={{ position: 'absolute', left: 16, color: passFocused ? '#fad31f' : '#9ca3af', transition: 'color 0.2s' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPassFocused(true)}
                  onBlur={() => setPassFocused(false)}
                  className="input-field"
                  style={{ paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 4
                  }}
                  onMouseOver={e => e.currentTarget.style.color = '#fad31f'}
                  onMouseOut={e => e.currentTarget.style.color = '#9ca3af'}
                >
                  {showPw ? <HiOutlineEyeOff size={22} /> : <HiOutlineEye size={22} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-connect" style={{ marginTop: 8 }}>
              {loading
                ? <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #111827', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
                : 'Se connecter'
              }
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}