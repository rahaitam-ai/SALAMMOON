import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  HiOutlineUser, 
  HiOutlineOfficeBuilding, 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker, 
  HiOutlineIdentification, 
  HiOutlinePhotograph, 
  HiOutlineKey,
  HiOutlineShieldCheck,
  HiOutlineLockClosed
} from 'react-icons/hi';

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  :root {
    --gold: #d4a017;
    --gold-light: #f3c64f;
    --gold-dim: rgba(212, 160, 23, 0.08);
    --navy: #1e1e1e;
    --navy-mid: #2c2522;
    --navy-soft: #7c6961;
    --cream: #f5f1ec;
    --cream-dark: #e8e2da;
    --white: #ffffff;
    --success: #1a7a4a;
    --error: #b83232;
    --text-primary: #1e1e1e;
    --text-secondary: #5d4e48;
    --text-muted: #9a847a;
    --border: rgba(124, 105, 97, 0.15);
  }

  .profile-root {
    font-family: 'Plus Jakarta Sans', 'Outfit', sans-serif;
    background: var(--cream);
    min-height: 100vh;
    color: var(--text-primary);
    padding: 10px 0 40px;
  }

  /* Hero Section */
  .profile-hero {
    background: linear-gradient(135deg, var(--navy-mid) 0%, var(--navy) 100%);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 32px;
    padding: 40px;
    color: white;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(30, 30, 30, 0.15);
    margin-bottom: 32px;
  }

  .profile-hero::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(212, 160, 23, 0.15) 0%, transparent 60%);
    pointer-events: none;
  }

  .profile-hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    position: relative;
    z-index: 1;
  }

  @media (min-width: 768px) {
    .profile-hero-content {
      flex-direction: row;
      text-align: left;
    }
  }

  .avatar-wrapper {
    position: relative;
    flex-shrink: 0;
  }

  .avatar-container {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 38px;
    font-weight: 800;
    font-family: 'Outfit', sans-serif;
    color: var(--navy);
    border: 4px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .avatar-wrapper:hover .avatar-container {
    transform: scale(1.05) rotate(3deg);
    border-color: var(--gold-light);
    box-shadow: 0 15px 35px rgba(212, 160, 23, 0.35);
  }

  .avatar-upload-overlay {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: var(--navy);
    color: var(--gold);
    border: 2.5px solid var(--gold);
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  }

  .avatar-upload-overlay:hover {
    background: var(--gold);
    color: var(--navy);
    transform: scale(1.1);
  }

  .profile-hero-details {
    flex-grow: 1;
    text-align: center;
  }

  @media (min-width: 768px) {
    .profile-hero-details {
      text-align: left;
    }
  }

  .profile-eyebrow {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  @media (min-width: 768px) {
    .profile-eyebrow {
      justify-content: flex-start;
    }
  }

  .profile-dot {
    width: 6px;
    height: 6px;
    background: var(--gold);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--gold-light);
  }

  .profile-eyebrow-text {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.15em;
    color: var(--gold-light);
    text-transform: uppercase;
  }

  .profile-name {
    font-family: 'Outfit', sans-serif;
    font-size: 32px;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
    margin-bottom: 12px;
    line-height: 1.2;
  }

  .profile-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .profile-meta {
      justify-content: flex-start;
    }
  }

  .role-badge {
    background: rgba(212, 160, 23, 0.15);
    color: var(--gold-light);
    border: 1px solid rgba(212, 160, 23, 0.3);
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .email-badge {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }

  /* Layout grid & cards */
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
  }

  @media (min-width: 1024px) {
    .profile-grid {
      grid-template-columns: 1fr 1fr;
    }
    .profile-grid.single-card {
      grid-template-columns: 1fr;
      max-width: 650px;
      margin: 0 auto;
    }
  }

  .profile-card {
    background: var(--white);
    border: 1px solid rgba(124, 105, 97, 0.08);
    border-radius: 28px;
    padding: 36px;
    box-shadow: 0 10px 35px rgba(124, 105, 97, 0.03);
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
  }

  .profile-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--gold) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .profile-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(124, 105, 97, 0.07);
    border-color: rgba(212, 160, 23, 0.2);
  }

  .profile-card:hover::before {
    opacity: 1;
  }

  .profile-card-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }

  .card-header-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: var(--gold-dim);
    color: var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }

  .card-header-text h2 {
    font-family: 'Outfit', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: var(--navy);
  }

  .card-header-text p {
    font-size: 13px;
    color: var(--text-secondary);
    font-weight: 500;
    margin-top: 2px;
  }

  /* Info rows spacing */
  .info-rows-container {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .info-row {
    display: flex;
    align-items: center;
    gap: 18px;
    padding: 16px 20px;
    border-radius: 20px;
    background: #faf9f6;
    border: 1px solid transparent;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .info-row:hover {
    background: var(--white);
    border-color: var(--border);
    transform: translateX(4px);
    box-shadow: 0 6px 20px rgba(124, 105, 97, 0.04);
  }

  .info-row-icon {
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: var(--white);
    color: var(--navy-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    font-size: 18px;
    transition: all 0.2s;
  }

  .info-row:hover .info-row-icon {
    background: var(--navy-soft);
    color: var(--white);
    border-color: var(--navy-soft);
  }

  .info-row-content {
    flex-grow: 1;
  }

  .info-row-label {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .info-row-value {
    font-size: 15px;
    font-weight: 700;
    color: var(--navy);
  }

  /* Custom Buttons */
  .btn-premium {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 28px;
    border-radius: 16px;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    border: 1px solid transparent;
    text-decoration: none;
  }

  .btn-premium--gold {
    background: linear-gradient(135deg, var(--gold) 0%, #b38600 100%);
    color: var(--white);
    box-shadow: 0 4px 15px rgba(212, 160, 23, 0.25);
  }

  .btn-premium--gold:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(212, 160, 23, 0.4);
  }

  .btn-premium--navy-outline {
    background: transparent;
    border: 1.5px solid var(--navy-soft);
    color: var(--navy-soft);
  }

  .btn-premium--navy-outline:hover {
    background: rgba(124, 105, 97, 0.05);
    border-color: var(--navy-mid);
    color: var(--navy-mid);
  }

  /* Status Pill & Operational metrics */
  .status-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(26, 122, 74, 0.08);
    color: var(--success);
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 800;
    border: 1px solid rgba(26, 122, 74, 0.15);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .status-indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 8px rgba(26, 122, 74, 0.5);
    animation: statusPulse 2s infinite;
  }

  @keyframes statusPulse {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(26, 122, 74, 0.5); }
    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(26, 122, 74, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(26, 122, 74, 0); }
  }

  .stat-item-small {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(124, 105, 97, 0.08);
    font-size: 13.5px;
  }

  .stat-item-small:last-child {
    border-bottom: none;
  }

  .stat-item-label {
    color: var(--text-secondary);
    font-weight: 500;
  }

  .stat-item-val {
    color: var(--navy);
    font-weight: 700;
  }
`;

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ user: null, agence: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="profile-root animate-fadeIn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <style>{style}</style>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #E8E2DA', borderTopColor: '#d4a017', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', color: 'var(--text-secondary)', fontSize: 15, fontWeight: 600 }}>Chargement de votre espace sécurisé...</p>
      </div>
    </div>
  );

  const { user, agence } = profile;

  // Extract initials for beautiful avatar fallback
  const initials = user?.nom && user?.prenom 
    ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase() 
    : user?.email ? user.email.charAt(0).toUpperCase() : 'U';

  const formatRole = (role) => {
    if (!role) return 'Utilisateur';
    switch (role.toLowerCase()) {
      case 'admin': return 'Administrateur Système';
      case 'siege': return 'Membre du Siège';
      case 'guichetier': return 'Guichetier';
      default: return role;
    }
  };

  return (
    <div className="profile-root animate-fadeIn">
      <style>{style}</style>
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        
        {/* Header Hero Card */}
        <div className="profile-hero">
          <div className="profile-hero-content">
            <div className="avatar-wrapper">
              <div className="avatar-container">
                {initials}
              </div>
              <div 
                className="avatar-upload-overlay"
                onClick={() => toast('L\'upload de photo sera disponible prochainement', { icon: 'ℹ️' })}
                title="Changer la photo"
              >
                <HiOutlinePhotograph size={20} />
              </div>
            </div>
            
            <div className="profile-hero-details">
              <div className="profile-eyebrow">
                <div className="profile-dot" />
                <span className="profile-eyebrow-text">Portail de Sécurité Al Barid Bank</span>
              </div>
              <h1 className="profile-name">{user?.nom ? `${user.prenom} ${user.nom}` : 'Profil Utilisateur'}</h1>
              <div className="profile-meta">
                <span className="role-badge">{formatRole(user?.role)}</span>
                <span className="email-badge">{user?.email}</span>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button 
                className="btn-premium btn-premium--gold"
                onClick={() => navigate('/change-password')}
              >
                <HiOutlineKey size={18} /> Changer de Mot de Passe
              </button>
            </div>
          </div>
        </div>

        {/* Content Columns */}
        <div className={`profile-grid ${['admin', 'siege'].includes(user?.role) ? 'single-card' : ''}`}>
          
          {/* Card 1: Personal Info */}
          <div className="profile-card">
            <div className="profile-card-header">
              <div className="card-header-icon">
                <HiOutlineUser />
              </div>
              <div className="card-header-text">
                <h2>Informations Personnelles</h2>
                <p>Identité et données de contact</p>
              </div>
            </div>

            <div className="info-rows-container">
              <div className="info-row">
                <div className="info-row-icon">
                  <HiOutlineIdentification />
                </div>
                <div className="info-row-content">
                  <div className="info-row-label">Nom et Prénom</div>
                  <div className="info-row-value">{user?.nom ? `${user.prenom} ${user.nom}` : 'Non renseigné'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-row-icon">
                  <HiOutlineMail />
                </div>
                <div className="info-row-content">
                  <div className="info-row-label">Email professionnel</div>
                  <div className="info-row-value">{user?.email || 'Non renseigné'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-row-icon">
                  <HiOutlinePhone />
                </div>
                <div className="info-row-content">
                  <div className="info-row-label">Numéro de Téléphone</div>
                  <div className="info-row-value">{user?.phone || 'Non renseigné'}</div>
                </div>
              </div>

              <div className="info-row">
                <div className="info-row-icon">
                  <HiOutlineShieldCheck />
                </div>
                <div className="info-row-content">
                  <div className="info-row-label">Habilitation Système</div>
                  <div className="info-row-value">
                    <span style={{ fontSize: '11px', fontWeight: '800', padding: '4px 10px', background: 'rgba(0, 80, 150, 0.08)', color: '#005096', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {user?.role || 'Aucun'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Professional context (conditional based on role) */}
          {!['admin', 'siege'].includes(user?.role) && (
            /* Agency attachment details for branch personnel */
            <div className="profile-card">
              <div className="profile-card-header">
                <div className="card-header-icon" style={{ background: 'rgba(26, 122, 74, 0.08)', color: '#1a7a4a' }}>
                  <HiOutlineOfficeBuilding />
                </div>
                <div className="card-header-text">
                  <h2>Votre Agence Attribuée</h2>
                  <p>Lieu d'exercice et rattachement</p>
                </div>
              </div>

              <div className="info-rows-container">
                <div className="info-row">
                  <div className="info-row-icon">
                    <HiOutlineOfficeBuilding />
                  </div>
                  <div className="info-row-content">
                    <div className="info-row-label">Nom de l'Agence</div>
                    <div className="info-row-value">{agence?.nom || 'Non assigné'}</div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-row-icon">
                    <HiOutlineIdentification />
                  </div>
                  <div className="info-row-content">
                    <div className="info-row-label">Code d'Agence</div>
                    <div className="info-row-value font-mono text-[var(--gold)]">{agence?.code_agence || 'N/A'}</div>
                  </div>
                </div>

                <div className="info-row">
                  <div className="info-row-icon">
                    <HiOutlineLocationMarker />
                  </div>
                  <div className="info-row-content">
                    <div className="info-row-label">Adresse physique</div>
                    <div className="info-row-value">
                      {agence?.ville || agence?.adresse 
                        ? `${agence?.ville} ${agence?.adresse ? `— ${agence?.adresse}` : ''}`
                        : 'Non renseignée'}
                    </div>
                  </div>
                </div>

                <div className="mt-2 p-6 rounded-2xl bg-[#faf9f6] border border-[var(--border)] space-y-4">
                  <p className="text-[10px] font-extrabold text-[var(--text-muted)] uppercase tracking-widest">Métriques Opérationnelles</p>
                  
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-[var(--border)]">
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">Statut Agence</span>
                    <span className="status-pill">
                      <span className="status-indicator-dot" /> Opérationnelle
                    </span>
                  </div>

                  <div className="stat-item-small">
                    <span className="stat-item-label">Réseau Interbancaire</span>
                    <span className="stat-item-val text-emerald-600">Connecté</span>
                  </div>
                  <div className="stat-item-small">
                    <span className="stat-item-label">Guichets Actifs</span>
                    <span className="stat-item-val">02 Guichets</span>
                  </div>
                  <div className="stat-item-small">
                    <span className="stat-item-label">Sécurité Coffre</span>
                    <span className="stat-item-val text-emerald-600">Sécurisé</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

