import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  HiOutlineLibrary, 
  HiOutlineCube, 
  HiOutlineX,
  HiOutlineIdentification,
  HiOutlinePhone,
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineChevronRight,
  HiOutlineDocumentText,
  HiOutlineDownload,
  HiOutlineEye,
  HiOutlineEyeOff
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AccountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInitialBalance, setShowInitialBalance] = useState(false);

  const formatCurrency = (value) => {
    const amount = Number(value ?? 0);
    return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    fetchAccountDetails();
  }, [id]);

  const fetchAccountDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/accounts/${id}`);
      setAccount(res.data.account);
    } catch (err) {
      console.error(err);
      toast.error("Impossible de charger les détails du compte");
      navigate('/agence/dashboard/consulter-clients');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintRIB = async (accountId, clientCin) => {
    const toastId = toast.loading("Génération du document PDF...");
    try {
      const response = await api.get(`/accounts/${accountId}/pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Recu_Ouverture_${clientCin || 'compte'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Document PDF téléchargé !", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération du PDF", { id: toastId });
    }
  };

  const handlePrintRIB_PDF = async (accountId, clientCin) => {
    const toastId = toast.loading("Génération du document RIB PDF...");
    try {
      const response = await api.get(`/accounts/${accountId}/rib-pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `RIB_${clientCin || 'compte'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Document RIB PDF téléchargé !", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération du RIB PDF", { id: toastId });
    }
  };

  const handlePrintAttestationSolde = async (accountId, clientCin, clientNom, clientPrenom) => {
    const toastId = toast.loading("Génération de l'attestation de solde...");
    try {
      const response = await api.get(`/accounts/${accountId}/attestation-solde-pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = `${clientNom || 'client'}_${clientPrenom || ''}`.replace(/\s+/g, '_');
      link.setAttribute('download', `Attestation_Solde_${safeName}_${account.numero_compte || accountId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Attestation de solde téléchargée !", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération de l'attestation", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', border: '4px solid rgba(212, 160, 23, 0.1)', borderTopColor: '#d4a017', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Chargement des informations du compte...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className="account-detail-root" style={{ padding: '24px 32px', maxWidth: 900, margin: '0 auto' }}>
      {/* Breadcrumb / Top Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
        <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onClick={() => navigate('/agence/dashboard/consulter-clients')} className="hover-gold">Clients & Comptes</span>
        <HiOutlineChevronRight size={12} />
        <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Détails Compte N° {account.numero_compte}</span>
      </div>

      {/* Main card */}
      <div className="modal-box" style={{ width: '100%', maxWidth: 'none', boxShadow: '0 20px 40px rgba(15, 25, 41, 0.08)', borderRadius: 24, overflow: 'hidden', background: '#fff' }}>
        <div className="modal-header" style={{ padding: '32px 32px 24px', borderBottom: '1px solid #f3eff0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="client-avatar" style={{ width: 64, height: 64, fontSize: 24, borderRadius: 16, background: 'linear-gradient(135deg, #d4a017 0%, #fae650 100%)', color: '#0f1929', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, boxShadow: '0 8px 16px rgba(212, 160, 23, 0.15)' }}>
              <HiOutlineLibrary size={28} />
            </div>
            <div>
              <p className="modal-eyebrow" style={{ color: '#d4a017', fontWeight: 800, letterSpacing: '0.1em', marginBottom: 4, textTransform: 'uppercase', fontSize: 11 }}>Détails du Compte Bancaire</p>
              <h2 className="modal-title syne" style={{ margin: 0, fontSize: '1.6rem', color: '#0f1929', fontWeight: 800 }}>N° {account.numero_compte}</h2>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10, marginBottom: 8 }}>
                <button
                  onClick={() => handlePrintRIB(account.id, account.client?.cin)}
                  style={{
                    background: '#fad31f',
                    color: '#0f1929',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(250, 211, 31, 0.25)',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(250, 211, 31, 0.35)';
                    e.currentTarget.style.background = '#fae650';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(250, 211, 31, 0.25)';
                    e.currentTarget.style.background = '#fad31f';
                  }}
                >
                  Télécharger reçu d'ouverture de compte
                </button>
                <button
                  onClick={() => handlePrintAttestationSolde(account.id, account.client?.cin, account.client?.nom, account.client?.prenom)}
                  style={{
                    background: '#0f1929',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(15, 25, 41, 0.18)',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(15, 25, 41, 0.25)';
                    e.currentTarget.style.background = '#15233d';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(15, 25, 41, 0.18)';
                    e.currentTarget.style.background = '#0f1929';
                  }}
                >
                  <HiOutlineDocumentText size={16} />
                  Télécharger Attestation de Solde
                </button>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap: 10, marginTop: 12, padding: '14px 16px', background: '#f8fafc', borderRadius: 16, border: '1px solid rgba(212, 160, 23, 0.15)', maxWidth: 380, transition: 'background 0.25s ease' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Solde Initial</span>
                    <button
                      type="button"
                      onClick={() => setShowInitialBalance(prev => !prev)}
                      aria-label={showInitialBalance ? 'Masquer le solde initial' : 'Afficher le solde initial'}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        padding: 6,
                        borderRadius: 10,
                        color: showInitialBalance ? '#0f1929' : '#6b7280',
                        transition: 'color 0.15s ease, transform 0.15s ease'
                      }}
                    >
                      {showInitialBalance ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                    </button>
                  </div>
                  <p style={{ margin: '6px 0 0 0', fontSize: 16, fontWeight: 700, color: '#0f1929', letterSpacing: '0.02em', minHeight: 26, transition: 'opacity 0.25s ease, transform 0.25s ease', opacity: 1, transform: showInitialBalance ? 'translateY(0)' : 'translateY(0)' }}>
                    {showInitialBalance ? `${formatCurrency(account.balance)} MAD` : '********'}
                  </p>
                </div>
              </div>

              <p className="modal-subtitle" style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>Type: {account.type?.name} · Créé le {new Date(account.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/agence/dashboard/consulter-clients')} 
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 12, color: '#475569', fontWeight: 600, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s' }}
            className="hover-bg-navy"
          >
            <HiOutlineArrowLeft size={16} /> Retour
          </button>
        </div>

        <div className="modal-body" style={{ padding: '32px' }}>
          {/* RIB Card */}
          <div style={{ marginBottom: 32, padding: '1.5rem', background: '#fdfbf7', border: '1px solid rgba(212, 160, 23, 0.3)', borderRadius: 20 }}>
            <p style={{ margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 700 }}>
              Relevé d'Identité Bancaire (RIB)
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap', gap: 12 }}>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', fontFamily: 'monospace', letterSpacing: '1px' }}>
                {account.rib || 'Non renseigné'}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(account.rib);
                    toast.success('RIB copié dans le presse-papiers');
                  }}
                  style={{
                    background: 'var(--navy)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'background 0.15s'
                  }}
                  className="btn-navy-hover"
                >
                  Copier
                </button>
                <button 
                  onClick={() => handlePrintRIB_PDF(account.id, account.client?.cin)}
                  style={{
                    background: '#fad31f',
                    color: '#0f1929',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 10px rgba(250, 211, 31, 0.2)',
                    transition: 'all 0.2s',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 6px 14px rgba(250, 211, 31, 0.3)';
                    e.currentTarget.style.background = '#fae650';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 10px rgba(250, 211, 31, 0.2)';
                    e.currentTarget.style.background = '#fad31f';
                  }}
                >
                  <HiOutlineDownload size={14} />
                  Télécharger le RIB
                </button>
              </div>
            </div>
          </div>

          {/* Informative Grid */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>Titulaire du Compte</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
            <div className="info-card" style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlineUserGroup size={16}/> Nom du Client</label>
              <p className="client-name" style={{ fontSize: 15, fontWeight: 700, color: 'var(--navy)', margin: 0 }}>{account.client?.nom} {account.client?.prenom}</p>
            </div>
            <div className="info-card" style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlineIdentification size={16}/> CIN / Passport</label>
              <p className="client-name" style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{account.client?.cin || '—'}</p>
            </div>
            <div className="info-card" style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlinePhone size={16}/> Téléphone</label>
              <p className="client-name" style={{ fontSize: 15, color: 'var(--navy)', margin: 0 }}>{account.client?.phone || '—'}</p>
            </div>
            <div className="info-card" style={{ background: '#f8fafc', padding: 16, borderRadius: 12 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlineIdentification size={16}/> Numéro de Client</label>
              <p className="client-name" style={{ fontSize: 15, fontWeight: 700, color: '#d4a017', margin: 0 }}>{account.client?.client_number || '—'}</p>
            </div>
          </div>

          {/* Pack & Services */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>Pack & Services Associés</h3>
          <div style={{ marginBottom: 24 }}>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Offre Groupée (Pack)</label>
            {account.pack ? (
              <div style={{ padding: '1.25rem', background: '#fdfbf7', border: '1px solid rgba(212, 160, 23, 0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ padding: 10, background: 'rgba(212, 160, 23, 0.1)', color: '#d4a017', borderRadius: 10 }}>
                  <HiOutlineCube size={24} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: '#0f1929' }}>{account.pack.name}</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>Offre groupée et services associés</p>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: 13 }}>
                Aucun pack associé à ce compte.
              </div>
            )}
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Services & Produits inclus</label>
            {account.products && account.products.length > 0 ? (
              <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginTop: '0.5rem' }}>
                {account.products.map(p => (
                  <div key={p.id} className="product-card selected" style={{ cursor: 'default', background: '#fff', border: '1px solid #d4a017', padding: '12px 16px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#d4a017' }} />
                    <span className="product-name" style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)' }}>{p.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', color: 'var(--text-secondary)', fontSize: 13 }}>
                Aucun service ou produit individuel associé à ce compte.
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer" style={{ background: '#fafaf9', padding: '24px 32px', borderTop: '1px solid #f1ece6', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button 
            className="btn-submit" 
            onClick={() => navigate('/agence/dashboard/consulter-clients')}
            style={{ 
              background: '#e2e8f0', 
              color: '#475569', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: 12, 
              fontWeight: 700, 
              fontSize: 13, 
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            Fermer
          </button>
        </div>
      </div>
      <style>{`
        .hover-gold:hover {
          color: #d4a017 !important;
        }
        .hover-bg-navy:hover {
          background: #0f1929 !important;
          color: #fff !important;
        }
        .btn-navy-hover:hover {
          background: #d4a017 !important;
        }
        .btn-navy-hover-effect:hover {
          background: #d4a017 !important;
          box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3) !important;
        }
      `}</style>
    </div>
  );
}
