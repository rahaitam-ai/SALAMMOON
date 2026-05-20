import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  HiOutlineUserGroup, 
  HiOutlineLibrary, 
  HiOutlineCube, 
  HiOutlineTrendingUp,
  HiOutlineChevronRight,
  HiOutlineSearch,
  HiOutlineOfficeBuilding,
  HiOutlinePlus,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineIdentification,
  HiOutlineLocationMarker,
  HiOutlineClipboardList
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AgenceDashboard() {
  const [data, setData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, profRes] = await Promise.all([
        api.get('/agence/dashboard').catch(() => ({
          data: {
            stats: {
              total_clients: 0,
              active_accounts: 0,
              new_this_month: 0,
              efficiency: '94%'
            },
            recent_clients: []
          }
        })),
        api.get('/profile').catch(() => ({ data: { user: null, agence: null } }))
      ]);
      setData(dashRes.data);
      setProfile(profRes.data);
    } catch (err) {
      toast.error('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(184,150,62,0.2)', borderTopColor: '#b8963e', animation: 'spin 0.8s linear infinite' }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const stats = [
    { label: 'Total Clients', value: data.stats.total_clients, icon: HiOutlineUserGroup,   color: '#2563eb', bg: 'rgba(37,99,235,0.08)',   trend: '+5.2%',  trendUp: true  },
    { label: 'Comptes Actifs', value: data.stats.active_accounts, icon: HiOutlineLibrary,  color: '#b8963e', bg: 'rgba(184,150,62,0.08)',  trend: '+2.1%',  trendUp: true  },
    { label: 'Nouveaux (Mois)', value: data.stats.new_this_month, icon: HiOutlineTrendingUp,color: '#10b981', bg: 'rgba(16,185,129,0.08)',  trend: '+12%',   trendUp: true  },
    { label: 'Efficacité',      value: data.stats.efficiency,     icon: HiOutlineCube,     color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)',  trend: 'Optimal',trendUp: false },
  ];

  const activities = [
    { icon: HiOutlineLibrary,    color: '#b8963e', title: 'Ouverture de Compte',   desc: 'Dossier bancaire créé avec succès',      time: '12 min' },
    { icon: HiOutlineUserGroup,  color: '#2563eb', title: 'Nouveau Client Enreg.', desc: 'Dossier client validé & archivé',         time: '45 min' },
    { icon: HiOutlineCube,       color: '#10b981', title: 'Souscription Pack',     desc: 'Pack associé au compte client',          time: '2h'     },
    { icon: HiOutlineCheckCircle,color: '#8b5cf6', title: 'Mise à jour Dossier',   desc: 'Informations de contact actualisées',    time: '3h'     },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>

      {/* ═══ 1. PREMIUM DARK HEADER BANNER ═══ */}
      <div style={{
        background: 'linear-gradient(135deg, #0f1929 0%, #172a45 100%)',
        borderRadius: '2rem',
        padding: '2.5rem 3rem',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '2rem'
      }}>
        {/* Ambient spheres */}
        <div style={{ position:'absolute', top:'-120px', right:'-120px', width:'350px', height:'350px', background:'radial-gradient(circle, rgba(184,150,62,0.12) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'250px', height:'250px', background:'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />

        <div style={{ zIndex: 2, flex: 1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
            <span style={{ background:'rgba(184,150,62,0.15)', color:'#d4a017', fontSize:'0.72rem', fontWeight:800, padding:'0.3rem 0.75rem', borderRadius:'2rem', textTransform:'uppercase', letterSpacing:'0.08em', display:'inline-flex', alignItems:'center', gap:'0.4rem', border:'1px solid rgba(184,150,62,0.2)' }}>
              <HiOutlineSparkles size={11}/> Portail Agence Al Barid Bank
            </span>
            <span style={{ background:'rgba(16,185,129,0.15)', color:'#4ade80', fontSize:'0.72rem', fontWeight:800, padding:'0.3rem 0.75rem', borderRadius:'2rem', textTransform:'uppercase', letterSpacing:'0.08em', display:'inline-flex', alignItems:'center', gap:'0.4rem', border:'1px solid rgba(16,185,129,0.2)' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', animation:'pulse-dot 1.5s infinite', display:'inline-block' }}></span>
              Système Actif
            </span>
          </div>
          <h1 style={{ fontSize:'2.5rem', fontWeight:900, color:'#ffffff', letterSpacing:'-0.03em', margin:0 }}>
            Tableau de Bord
          </h1>
          <p style={{ color:'rgba(255,255,255,0.65)', marginTop:'0.5rem', fontSize:'0.95rem', maxWidth:520, lineHeight:1.5 }}>
            Bienvenue dans votre centre de pilotage bancaire. Gérez les comptes clients, consultez les dossiers et suivez l'activité de votre agence.
          </p>

          {/* AGENCE INFO BLOCK - INSIDE BANNER */}
          {profile?.agence && (
            <div style={{ 
              marginTop: '1.75rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid rgba(255,255,255,0.1)', 
              display: 'flex', 
              gap: '2.5rem',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(212,160,23,0.15)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(212,160,23,0.2)' }}>
                  <HiOutlineOfficeBuilding />
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.2rem 0' }}>Nom de l'Agence</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>{profile.agence.nom || 'Non assigné'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(212,160,23,0.15)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(212,160,23,0.2)' }}>
                  <HiOutlineIdentification />
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.2rem 0' }}>Code d'Agence</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#d4a017', fontFamily: 'monospace', margin: 0 }}>{profile.agence.code_agence || 'N/A'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(212,160,23,0.15)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(212,160,23,0.2)' }}>
                  <HiOutlineLocationMarker />
                </div>
                <div>
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', margin: '0 0 0.2rem 0' }}>Adresse physique</p>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {profile.agence.ville || profile.agence.adresse 
                      ? `${profile.agence.ville || ''} ${profile.agence.adresse ? `— ${profile.agence.adresse}` : ''}`
                      : 'Non renseignée'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CTA buttons */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', zIndex:2, minWidth:200 }}>
          <Link to="/agence/dashboard/ouvrir-compte" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.85rem 1.5rem', background:'linear-gradient(135deg, #b8963e, #8a6e2a)', color:'#fff', borderRadius:'1rem', fontWeight:800, fontSize:'0.9rem', textDecoration:'none', boxShadow:'0 8px 20px rgba(184,150,62,0.3)', transition:'all 0.2s' }} className="pro-header-btn">
            <HiOutlineLibrary size={16}/> Ouvrir un Compte
          </Link>
          <Link to="/agence/dashboard/nouveau-client" style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.85rem 1.5rem', background:'rgba(255,255,255,0.08)', color:'#fff', borderRadius:'1rem', fontWeight:700, fontSize:'0.9rem', textDecoration:'none', border:'1px solid rgba(255,255,255,0.15)', transition:'all 0.2s' }} className="pro-header-btn-ghost">
            <HiOutlineUserGroup size={16}/> Nouveau Client
          </Link>
        </div>
      </div>

      {/* ═══ 2. STATS GRID ═══ */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:'1.5rem', marginBottom:'2.5rem' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background:'#ffffff', borderRadius:'1.5rem', padding:'1.75rem', border:'1px solid rgba(124,105,97,0.08)', boxShadow:'0 10px 30px rgba(124,105,97,0.03)', display:'flex', gap:'1.25rem', transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)', cursor:'default' }} className="pro-stat-card">
            <div style={{ width:54, height:54, borderRadius:'1rem', background:s.bg, color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>
              <s.icon />
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:'0.72rem', fontWeight:800, color:'#7c6961', textTransform:'uppercase', letterSpacing:'0.07em', margin:'0 0 0.4rem 0' }}>{s.label}</p>
              <p style={{ fontSize:'2.2rem', fontWeight:900, color:'#0f1929', letterSpacing:'-0.02em', margin:0, lineHeight:1 }}>{s.value}</p>
              <span style={{ fontSize:'0.78rem', fontWeight:700, color: s.trendUp ? '#10b981' : '#7c6961', background: s.trendUp ? 'rgba(16,185,129,0.08)' : 'rgba(124,105,97,0.06)', padding:'0.15rem 0.5rem', borderRadius:'0.4rem', display:'inline-block', marginTop:'0.6rem' }}>
                {s.trend} <span style={{ fontWeight:500, color:'#9a847a' }}>vs mois dernier</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ 3. MAIN CONTENT GRID ═══ */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'2rem', alignItems:'start' }}>

        {/* LEFT — Recent Clients + Wave Chart */}
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>

          {/* Mini Sparkline Chart */}
          <div style={{ background:'#ffffff', borderRadius:'1.5rem', padding:'2rem', border:'1px solid rgba(124,105,97,0.08)', boxShadow:'0 10px 30px rgba(124,105,97,0.02)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
              <div>
                <h2 style={{ fontSize:'1.1rem', fontWeight:800, color:'#0f1929', margin:0 }}>Activité & Ouvertures de Comptes</h2>
                <p style={{ fontSize:'0.8rem', color:'#7c6961', margin:'0.2rem 0 0 0' }}>Tendance sur les 7 derniers jours</p>
              </div>
              <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#10b981', padding:'0.25rem 0.6rem', background:'rgba(16,185,129,0.08)', borderRadius:'0.5rem' }}>↑ En hausse</span>
            </div>
            <div style={{ position:'relative', height:100 }}>
              <svg viewBox="0 0 500 90" width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ag-wave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(37,99,235,0.18)" />
                    <stop offset="100%" stopColor="rgba(37,99,235,0)" />
                  </linearGradient>
                </defs>
                <path d="M 0 75 Q 70 45 140 65 T 280 25 T 420 45 T 500 28 L 500 90 L 0 90 Z" fill="url(#ag-wave)" />
                <path d="M 0 75 Q 70 45 140 65 T 280 25 T 420 45 T 500 28" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="280" cy="25" r="5" fill="#2563eb" stroke="#fff" strokeWidth="2"/>
                <circle cx="500" cy="28" r="4" fill="#2563eb" stroke="#fff" strokeWidth="1.5"/>
              </svg>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', color:'#9a847a', fontWeight:600, borderTop:'1px solid #f7f5f2', paddingTop:'0.75rem', marginTop:'0.5rem' }}>
              {['Lun','Mar','Mer','Jeu','Ven','Sam','Auj'].map((d,i) => <span key={i} style={{ color: i===6 ? '#2563eb' : undefined, fontWeight: i===6 ? 800 : 600 }}>{d}</span>)}
            </div>
          </div>

          {/* Recent Clients Table */}
          <div style={{ background:'#ffffff', borderRadius:'1.5rem', padding:'2rem', border:'1px solid rgba(124,105,97,0.08)', boxShadow:'0 10px 30px rgba(124,105,97,0.02)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontSize:'1.1rem', fontWeight:800, color:'#0f1929', margin:0 }}>Nouveaux Clients Récents</h2>
              <span style={{ background:'#f5f3f0', color:'#7c6961', padding:'0.25rem 0.75rem', borderRadius:'2rem', fontSize:'0.75rem', fontWeight:700, border:'1px solid rgba(124,105,97,0.12)' }}>
                {(data.recent_clients||[]).length} enregistrés
              </span>
            </div>

            {data.recent_clients && data.recent_clients.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {data.recent_clients.map((client, i) => (
                  <div key={client.id||i} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'1rem 1.25rem', borderRadius:'1rem', background:'#faf9f6', border:'1px solid transparent', transition:'all 0.2s' }} className="pro-activity-item">
                    <div style={{ width:42, height:42, borderRadius:'50%', background:'rgba(37,99,235,0.1)', color:'#2563eb', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1rem', flexShrink:0 }}>
                      {(client.nom||'?').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex:1 }}>
                      <p style={{ margin:0, fontWeight:700, fontSize:'0.9rem', color:'#0f1929' }}>{client.prenom} {client.nom}</p>
                      <p style={{ margin:0, fontSize:'0.75rem', color:'#7c6961', marginTop:'0.15rem' }}>CIN : {client.cin||'N/A'} · Tél : {client.phone||'N/A'}</p>
                    </div>
                    <span style={{ fontSize:'0.75rem', fontWeight:700, color:'#b8963e', background:'rgba(184,150,62,0.08)', padding:'0.2rem 0.6rem', borderRadius:'0.5rem' }}>
                      {client.accounts_count||0} compte{(client.accounts_count||0)!==1?'s':''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'2.5rem', color:'#9a847a' }}>
                <HiOutlineUserGroup size={36} style={{ opacity:0.3, marginBottom:'0.75rem', display:'block', margin:'0 auto 0.75rem' }}/>
                <p style={{ fontWeight:700, margin:0 }}>Aucun client récent</p>
                <p style={{ fontSize:'0.8rem', margin:'0.25rem 0 0 0' }}>Les nouveaux dossiers apparaîtront ici.</p>
              </div>
            )}
          </div>

          {/* Activity Feed */}
          <div style={{ background:'#ffffff', borderRadius:'1.5rem', padding:'2rem', border:'1px solid rgba(124,105,97,0.08)', boxShadow:'0 10px 30px rgba(124,105,97,0.02)' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:800, color:'#0f1929', margin:'0 0 1.5rem 0', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <HiOutlineClock style={{ color:'#b8963e' }}/> Dernières Activités
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', paddingLeft:'1rem', borderLeft:'2px solid #f7f5f2', position:'relative' }}>
              {activities.map((a, i) => (
                <div key={i} style={{ position:'relative' }}>
                  <div style={{ position:'absolute', left:'-26px', top:'3px', width:10, height:10, borderRadius:'50%', background:a.color, border:'3px solid #fff', boxShadow:`0 0 0 3px ${a.color}22` }}></div>
                  <p style={{ margin:0, fontSize:'0.85rem', fontWeight:800, color:'#0f1929' }}>{a.title}</p>
                  <p style={{ margin:'0.1rem 0 0 0', fontSize:'0.75rem', color:'#7c6961' }}>{a.desc} · <span style={{ fontWeight:600 }}>Il y a {a.time}</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Quick Actions + Status */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

          {/* Quick Actions */}
          <div style={{ background:'#ffffff', borderRadius:'1.5rem', padding:'2rem', border:'1px solid rgba(124,105,97,0.08)', boxShadow:'0 10px 30px rgba(124,105,97,0.02)' }}>
            <h2 style={{ fontSize:'1.1rem', fontWeight:800, color:'#0f1929', margin:'0 0 1.25rem 0' }}>Raccourcis</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {[
                { to:'/agence/dashboard/ouvrir-compte',   icon:HiOutlineLibrary,    label:'Créer un Compte',         color:'#b8963e' },
                { to:'/agence/dashboard/nouveau-client',  icon:HiOutlineUserGroup,  label:'Nouveau Dossier Client',  color:'#2563eb' },
                { to:'/agence/dashboard/consulter-clients',icon:HiOutlineSearch,   label:'Consulter les Clients',   color:'#10b981' },
                { to:'/agence/dashboard/gestion-comptes',  icon:HiOutlineClipboardList,label:'Consulter les Comptes banquier',     color:'#8b5cf6' },
              ].map((item, i) => (
                <Link key={i} to={item.to} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1rem 1.25rem', background:'#faf9f6', border:'1px solid transparent', borderRadius:'1rem', textDecoration:'none', color:'#0f1929', fontWeight:700, fontSize:'0.88rem', transition:'all 0.2s' }} className="pro-qa-btn">
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{ width:36, height:36, borderRadius:'0.6rem', background:`${item.color}14`, color:item.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem' }}>
                      <item.icon />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <HiOutlineChevronRight size={15} style={{ color:'#9a847a' }}/>
                </Link>
              ))}
            </div>
          </div>

          {/* Status Card */}
          <div style={{ background:'linear-gradient(135deg, #0f1929 0%, #172a45 100%)', borderRadius:'1.5rem', padding:'1.75rem', border:'1px solid rgba(255,255,255,0.07)', boxShadow:'0 10px 30px rgba(15,25,41,0.12)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'180px', height:'180px', background:'radial-gradient(circle, rgba(184,150,62,0.1) 0%, transparent 70%)', borderRadius:'50%' }}/>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1rem' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'pulse-dot 1.5s infinite' }}></span>
              <span style={{ fontSize:'0.75rem', fontWeight:800, color:'#4ade80', textTransform:'uppercase', letterSpacing:'0.08em' }}>Système Opérationnel</span>
            </div>
            <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.8rem', margin:0 }}>Connexion sécurisée SSL 256 bits · Accès autorisé</p>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginTop:'1.25rem', paddingTop:'1rem', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
              <HiOutlineShieldCheck size={16} style={{ color:'#b8963e' }}/>
              <span style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)', fontWeight:600 }}>Portail Guichetier · Al Barid Bank</span>
            </div>
          </div>

          {/* Shortcut mini-cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            {[
              { icon:HiOutlineOfficeBuilding, color:'#10b981', label:'Mon Agence',      sub:'Informations' },
              { icon:HiOutlinePlus,           color:'#8b5cf6', label:'Nouveau Dossier', sub:'Création rapide' },
            ].map((c,i) => (
              <div key={i} style={{ background:'#ffffff', borderRadius:'1rem', padding:'1.25rem', border:'1px solid rgba(124,105,97,0.08)', cursor:'pointer', transition:'all 0.2s' }} className="pro-mini-card">
                <div style={{ width:36, height:36, borderRadius:'0.7rem', background:`${c.color}12`, color:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', marginBottom:'0.6rem' }}>
                  <c.icon />
                </div>
                <p style={{ margin:0, fontWeight:800, fontSize:'0.82rem', color:'#0f1929' }}>{c.label}</p>
                <p style={{ margin:'0.1rem 0 0 0', fontSize:'0.7rem', color:'#9a847a' }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%   { transform: scale(0.95); opacity: 0.5; }
          50%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .pro-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(124,105,97,0.08) !important;
          border-color: rgba(184,150,62,0.2) !important;
        }
        .pro-activity-item:hover {
          background: #ffffff !important;
          border-color: rgba(124,105,97,0.12) !important;
          box-shadow: 0 4px 12px rgba(124,105,97,0.05);
          transform: translateX(4px);
        }
        .pro-qa-btn:hover {
          background: #ffffff !important;
          border-color: rgba(124,105,97,0.15) !important;
          box-shadow: 0 6px 18px rgba(124,105,97,0.06);
          transform: translateY(-2px);
        }
        .pro-mini-card:hover {
          box-shadow: 0 8px 20px rgba(124,105,97,0.07);
          border-color: rgba(184,150,62,0.2) !important;
          transform: translateY(-2px);
        }
        .pro-header-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(184,150,62,0.4) !important;
        }
        .pro-header-btn-ghost:hover {
          background: rgba(255,255,255,0.14) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
