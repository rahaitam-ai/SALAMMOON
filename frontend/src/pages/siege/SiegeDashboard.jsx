import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  HiOutlineCollection, 
  HiOutlineCube, 
  HiOutlineOfficeBuilding, 
  HiOutlineLibrary, 
  HiOutlineTrendingUp, 
  HiOutlineArrowRight, 
  HiOutlineSparkles,
  HiOutlineCreditCard,
  HiOutlineBriefcase,
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineAdjustments,
  HiOutlineDatabase,
  HiOutlineShieldCheck,
  HiOutlinePlus
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function SiegeDashboard() {
  const [stats, setStats] = useState(null);
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date().toLocaleTimeString('fr-FR'));

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('fr-FR'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/siege/dashboard');
      setStats(res.data.stats);
      setPacks(res.data.packs || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', background: '#fcfbfa' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid rgba(184, 150, 62, 0.2)', borderTopColor: '#b8963e', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  // Distribution calculations for product categories
  const cardProducts = stats?.card_products || 2;
  const accountProducts = stats?.account_products || 3;
  const serviceProducts = stats?.service_products || 2;
  const totalProducts = stats?.total_products || (cardProducts + accountProducts + serviceProducts);
  
  const cardPercent = Math.round((cardProducts / (totalProducts || 1)) * 100);
  const accountPercent = Math.round((accountProducts / (totalProducts || 1)) * 100);
  const servicePercent = Math.round((serviceProducts / (totalProducts || 1)) * 100);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1.5rem', background: '#fcfbfa', fontFamily: "'Inter', sans-serif" }}>
      
      {/* 1. BRAND PLATFORM HEADER */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0f1929 0%, #172a45 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '2rem',
        boxShadow: '0 20px 40px rgba(15, 25, 41, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        {/* Decorative Golden Ambient Sphere */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(184,150,62,0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(46,125,50,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span style={{ 
              backgroundColor: 'rgba(184, 150, 62, 0.15)', 
              color: '#d4a017', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              padding: '0.35rem 0.8rem', 
              borderRadius: '2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid rgba(184, 150, 62, 0.2)'
            }}>
              <HiOutlineSparkles size={12} /> Administration Centrale
            </span>
            <span style={{ 
              backgroundColor: 'rgba(46, 125, 50, 0.15)', 
              color: '#4caf50', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              padding: '0.35rem 0.8rem', 
              borderRadius: '2rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid rgba(46, 125, 50, 0.2)'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4caf50', display: 'inline-block', animation: 'pulse-dot 1.5s infinite' }}></span>
              Système Actif
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', margin: 0 }}>
            Tableau de Bord Siège
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '0.5rem', fontSize: '1rem', fontWeight: 400, maxWidth: '650px', lineHeight: 1.5 }}>
            Supervisez les performances nationales, administrez les offres groupées de packs, configurez le catalogue de produits et pilotez le réseau des agences d'Al Barid Bank.
          </p>
        </div>


      </div>

      {/* 2. STATS GRID WITH PREMIUM EFFECTS */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        
        {/* STAT 1: Packs Bancaires */}
        <div className="premium-pro-card" style={{
          background: '#ffffff',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          border: '1px solid rgba(124, 105, 97, 0.08)',
          boxShadow: '0 10px 30px rgba(124, 105, 97, 0.02)',
          display: 'flex',
          gap: '1.25rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(46, 125, 50, 0.02) 100%)',
            color: '#2e7d32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0
          }}>
            <HiOutlineCollection />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.5rem 0' }}>
                Packs Bancaires
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f1929' }}>
                  {stats?.total_packs || 0}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#2e7d32', fontWeight: 700, backgroundColor: 'rgba(46, 125, 50, 0.08)', padding: '0.15rem 0.5rem', borderRadius: '0.4rem' }}>
                  {stats?.active_packs || 0} Actifs
                </span>
              </div>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <a href="/siege/packs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#2e7d32', textDecoration: 'none' }} className="pro-card-link">
                Gérer les packs <HiOutlineArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* STAT 2: Produits Totaux */}
        <div className="premium-pro-card" style={{
          background: '#ffffff',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          border: '1px solid rgba(124, 105, 97, 0.08)',
          boxShadow: '0 10px 30px rgba(124, 105, 97, 0.02)',
          display: 'flex',
          gap: '1.25rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(212, 160, 23, 0.1) 0%, rgba(212, 160, 23, 0.02) 100%)',
            color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0
          }}>
            <HiOutlineCube />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.5rem 0' }}>
                Produits Catalogue
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f1929' }}>
                  {stats?.total_products || 0}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Actifs
                </span>
              </div>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <a href="/siege/packs" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#d4a017', textDecoration: 'none' }} className="pro-card-link">
                Créer & Associer <HiOutlineArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* STAT 3: Nombre d'Agences */}
        <div className="premium-pro-card" style={{
          background: '#ffffff',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          border: '1px solid rgba(124, 105, 97, 0.08)',
          boxShadow: '0 10px 30px rgba(124, 105, 97, 0.02)',
          display: 'flex',
          gap: '1.25rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.02) 100%)',
            color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0
          }}>
            <HiOutlineOfficeBuilding />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.5rem 0' }}>
                Nombre d'Agences
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f1929' }}>
                  {stats?.total_agences || 0}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.08)', padding: '0.15rem 0.5rem', borderRadius: '0.4rem' }}>
                  {stats?.active_agences || 0} Connectées
                </span>
              </div>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <a href="/siege/agences" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textDecoration: 'none' }} className="pro-card-link">
                Consulter le réseau <HiOutlineArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* STAT 4: Nombre de Clients */}
        <div className="premium-pro-card" style={{
          background: '#ffffff',
          borderRadius: '1.5rem',
          padding: '1.75rem',
          border: '1px solid rgba(124, 105, 97, 0.08)',
          boxShadow: '0 10px 30px rgba(124, 105, 97, 0.02)',
          display: 'flex',
          gap: '1.25rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative'
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '1rem',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(37, 99, 235, 0.02) 100%)',
            color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0
          }}>
            <HiOutlineUsers />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.5rem 0' }}>
                Clients Nationaux
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900, color: '#0f1929' }}>
                  {stats?.total_clients || 0}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, backgroundColor: 'rgba(37, 99, 235, 0.08)', padding: '0.15rem 0.5rem', borderRadius: '0.4rem' }}>
                  Inscrits
                </span>
              </div>
            </div>
            <div style={{ marginTop: '1.25rem' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#2563eb' }}>
                Système Centralisé
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 3. VISUAL ANALYTICS GRAPH GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '2rem',
        marginBottom: '2.5rem'
      }}>
        
        {/* CHART 1: PRODUCT DISTRIBUTION (Donut/Bar Visual Segment) */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '1.5rem', 
          padding: '2rem', 
          border: '1px solid rgba(124, 105, 97, 0.08)',
          boxShadow: '0 10px 30px rgba(124, 105, 97, 0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f1929', margin: 0 }}>Distribution du Catalogue Produits</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Répartition des produits par type de service</p>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b8963e', padding: '0.25rem 0.6rem', background: 'rgba(184, 150, 62, 0.08)', borderRadius: '0.5rem' }}>
              {totalProducts} Produits Total
            </span>
          </div>

          {/* SVG Native Visualization */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', padding: '1rem 0' }}>
            <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
              <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1effb" strokeWidth="4.5"></circle>
                
                {/* Cards Segment */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#2563eb" strokeWidth="4.5" 
                        strokeDasharray={`${cardPercent} ${100 - cardPercent}`} strokeDashoffset="25"></circle>
                
                {/* Accounts Segment */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#d4a017" strokeWidth="4.5" 
                        strokeDasharray={`${accountPercent} ${100 - accountPercent}`} strokeDashoffset={`${125 - cardPercent}`}></circle>
                
                {/* Services Segment */}
                <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.5" 
                        strokeDasharray={`${servicePercent} ${100 - servicePercent}`} strokeDashoffset={`${125 - cardPercent - accountPercent}`}></circle>
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f1929', display: 'block', lineHeight: 1 }}>{totalProducts}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Types</span>
              </div>
            </div>

            {/* Legends */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #fcfbfa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563eb' }}></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Cartes Bancaires</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>{cardProducts} ({cardPercent}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #fcfbfa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#d4a017' }}></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Avantages Comptes</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>{accountProducts} ({accountPercent}%)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Services Digitaux</span>
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>{serviceProducts} ({servicePercent}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHART 2: ACTIVITY & PERFORMANCE WAVE (Modern Wave Line Chart) */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '1.5rem', 
          padding: '2rem', 
          border: '1px solid rgba(124, 105, 97, 0.08)',
          boxShadow: '0 10px 30px rgba(124, 105, 97, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f1929', margin: 0 }}>Activité Réseau & Transactions</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>Flux d'ouverture de comptes (7 derniers jours)</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', padding: '0.25rem 0.6rem', background: 'rgba(16,185,129,0.08)', borderRadius: '0.5rem' }}>
                +14.2% Hausse
              </span>
            </div>

            {/* Sparkline wave */}
            <div style={{ position: 'relative', width: '100%', height: '110px', marginTop: '1.5rem' }}>
              <svg viewBox="0 0 500 100" width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="gradient-wave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(46, 125, 50, 0.25)" />
                    <stop offset="100%" stopColor="rgba(46, 125, 50, 0.0)" />
                  </linearGradient>
                </defs>
                <path d="M 0 80 Q 75 40 150 70 T 300 20 T 450 50 T 500 30 L 500 100 L 0 100 Z" fill="url(#gradient-wave)" />
                <path d="M 0 80 Q 75 40 150 70 T 300 20 T 450 50 T 500 30" fill="none" stroke="#2e7d32" strokeWidth="3" strokeLinecap="round" />
                
                {/* Animated indicator circles */}
                <circle cx="300" cy="20" r="5" fill="#2e7d32" stroke="#ffffff" strokeWidth="2"></circle>
                <circle cx="500" cy="30" r="4" fill="#2e7d32" stroke="#ffffff" strokeWidth="1.5"></circle>
              </svg>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, borderTop: '1px solid #f7f5f2', paddingTop: '1rem', marginTop: '1rem' }}>
            <span>Mar 13</span>
            <span>Mer 14</span>
            <span>Jeu 15</span>
            <span>Ven 16</span>
            <span>Sam 17</span>
            <span>Dim 18</span>
            <span style={{ color: '#2e7d32', fontWeight: 800 }}>Auj (19)</span>
          </div>
        </div>

      </div>

      {/* 4. PACKS CATALOGUE & DETAILED GRID */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '2rem', 
        padding: '2rem 2.5rem', 
        border: '1px solid rgba(124, 105, 97, 0.08)',
        boxShadow: '0 20px 40px rgba(124, 105, 97, 0.03)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f1929', margin: 0, letterSpacing: '-0.02em' }}>
              Offres de Packs Bancaires Enregistrés
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Catalogue actif des solutions groupées disponibles pour la clientèle du réseau national.
            </p>
          </div>
          <a href="/siege/packs" style={{ 
            backgroundColor: '#0f1929', 
            color: '#ffffff', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '1rem', 
            fontSize: '0.85rem', 
            fontWeight: 700, 
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }} className="btn-primary-pro">
            <HiOutlinePlus size={16} /> Gérer les Packs
          </a>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #f7f5f2' }}>
                <th style={{ padding: '1rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Code & Nom du Pack</th>
                <th style={{ padding: '1rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Frais Mensuel</th>
                <th style={{ padding: '1rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Produits Inclus</th>
                <th style={{ padding: '1rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Statut Commercial</th>
                <th style={{ padding: '1rem 0.75rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Date de Création</th>
              </tr>
            </thead>
            <tbody>
              {packs.map((p, idx) => (
                <tr key={p.id || idx} style={{ borderBottom: '1px solid #f7f5f2', transition: 'background 0.2s' }} className="table-row-pro">
                  <td style={{ padding: '1.2rem 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '38px', height: '38px', borderRadius: '0.75rem', 
                        background: 'linear-gradient(135deg, rgba(184, 150, 62, 0.12) 0%, rgba(184, 150, 62, 0.02) 100%)',
                        color: '#b8963e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem'
                      }}>
                        {p.code?.substring(0,2) || 'PK'}
                      </div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: '#0f1929' }}>{p.name}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Code : {p.code}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 0.75rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#b8963e' }}>
                      {parseFloat(p.monthly_fee).toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700, marginLeft: '0.25rem' }}>MAD/mois</span>
                  </td>
                  <td style={{ padding: '1.2rem 0.75rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {p.products && p.products.length > 0 ? p.products.slice(0, 3).map((prod, idx2) => (
                        <span key={prod.id || idx2} style={{ fontSize: '0.75rem', color: 'var(--text-primary)', background: '#f5f3f0', padding: '0.15rem 0.5rem', borderRadius: '0.4rem', fontWeight: 600 }}>
                          {prod.name}
                        </span>
                      )) : <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Aucun produit lié</span>}
                      {p.products && p.products.length > 3 && (
                        <span style={{ fontSize: '0.75rem', color: '#b8963e', background: 'rgba(184, 150, 62, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '0.4rem', fontWeight: 700 }}>
                          +{p.products.length - 3} Plus
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1.2rem 0.75rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      padding: '0.25rem 0.6rem', 
                      borderRadius: '0.5rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      background: p.is_active !== false ? 'rgba(46, 125, 50, 0.08)' : 'rgba(124, 105, 97, 0.08)',
                      color: p.is_active !== false ? '#2e7d32' : 'var(--text-secondary)'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: p.is_active !== false ? '#2e7d32' : 'var(--text-secondary)' }}></span>
                      {p.is_active !== false ? 'Actif & Distribué' : 'Désactivé'}
                    </span>
                  </td>
                  <td style={{ padding: '1.2rem 0.75rem', textAlign: 'right', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Récemment'}
                  </td>
                </tr>
              ))}
              {packs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--text-muted)' }}>
                      <HiOutlineCollection size={36} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                      <p style={{ margin: 0, fontWeight: 700 }}>Aucun pack enregistré</p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem' }}>Commencez par ajouter un pack bancaire au catalogue.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. TWO COLUMN INFO (Recent Activity + Quick Actions) */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '2rem'
      }}>
        
        {/* COLUMN A: RECENT LOGS TIMELINE */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '1.5rem', 
          padding: '2rem', 
          border: '1px solid rgba(124, 105, 97, 0.08)',
          boxShadow: '0 10px 30px rgba(124, 105, 97, 0.02)'
        }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f1929', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HiOutlineClock style={{ color: '#b8963e' }} /> Activité Récente du Siège
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1.25rem', borderLeft: '2px solid #f7f5f2' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2e7d32', border: '3px solid #ffffff', boxShadow: '0 0 0 3px rgba(46,125,50,0.15)' }}></div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>Mise à jour des formules de pack centralisé</p>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Par l'Administrateur central · Il y a 10 min</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#b8963e', border: '3px solid #ffffff', boxShadow: '0 0 0 3px rgba(184,150,62,0.15)' }}></div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>Synchronisation nationale du réseau d'agences</p>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Automatisation Système · Il y a 1 heure</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2563eb', border: '3px solid #ffffff', boxShadow: '0 0 0 3px rgba(37,99,235,0.15)' }}></div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>Vérification de sécurité et audit de l'infrastructure</p>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Rapport de sécurité généré · Il y a 4 heures</p>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '-26px', top: '2px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', border: '3px solid #ffffff', boxShadow: '0 0 0 3px rgba(16,185,129,0.15)' }}></div>
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>Indexation de la base de données clients complétée</p>
              <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Serveur central · Hier</p>
            </div>
          </div>
        </div>

        {/* COLUMN B: CONFIGURATION SHORTCUTS & ACTIONS */}
        <div style={{ 
          background: '#ffffff', 
          borderRadius: '1.5rem', 
          padding: '2rem', 
          border: '1px solid rgba(124, 105, 97, 0.08)',
          boxShadow: '0 10px 30px rgba(124, 105, 97, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f1929', margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HiOutlineAdjustments style={{ color: '#2e7d32' }} /> Raccourcis de Configuration
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 1.5rem 0' }}>
              Accès directs aux modules administratifs centraux pour modifier les paramètres du système.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <a href="/siege/packs" style={{
              display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', borderRadius: '1rem',
              border: '1px solid #f1effb', background: '#ffffff', textDecoration: 'none', transition: 'all 0.2s'
            }} className="shortcut-card-pro">
              <HiOutlineCollection size={20} style={{ color: '#2e7d32' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>Nouveau Pack</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Créer une offre groupée</span>
            </a>

            <a href="/siege/packs" style={{
              display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', borderRadius: '1rem',
              border: '1px solid #f1effb', background: '#ffffff', textDecoration: 'none', transition: 'all 0.2s'
            }} className="shortcut-card-pro">
              <HiOutlineCube size={20} style={{ color: '#d4a017' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>Nouveau Produit</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Ajouter au catalogue</span>
            </a>

            <a href="/siege/agences" style={{
              display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', borderRadius: '1rem',
              border: '1px solid #f1effb', background: '#ffffff', textDecoration: 'none', transition: 'all 0.2s'
            }} className="shortcut-card-pro">
              <HiOutlineOfficeBuilding size={20} style={{ color: '#10b981' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>Ajouter Agence</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Enregistrer un guichet</span>
            </a>

            <div style={{
              display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', borderRadius: '1rem',
              border: '1px solid #f1effb', background: '#fcfbfa', cursor: 'not-allowed'
            }}>
              <HiOutlineShieldCheck size={20} style={{ color: '#2563eb' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f1929' }}>Sécurité Réseau</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Accès chiffré SSL</span>
            </div>
          </div>
        </div>

      </div>

      {/* Styled Animations for Premium Dashboard */}
      <style>{`
        @keyframes pulse-dot {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        
        .premium-pro-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(124, 105, 97, 0.08) !important;
          border-color: rgba(184, 150, 62, 0.25) !important;
        }

        .pro-card-link:hover {
          gap: 0.6rem !important;
          color: #b8963e !important;
        }

        .btn-primary-pro:hover {
          background-color: #1a2f4c !important;
          box-shadow: 0 4px 15px rgba(15, 25, 41, 0.25);
        }

        .table-row-pro:hover {
          background-color: #fcfbfa;
        }

        .shortcut-card-pro:hover {
          border-color: #b8963e !important;
          box-shadow: 0 6px 15px rgba(184, 150, 62, 0.05);
          transform: scale(1.02);
        }
      `}</style>

    </div>
  );
}
