import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineDownload,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineIdentification,
  HiOutlineBuildingOffice,
  HiOutlineUserCircle,
  HiOutlineCurrencyDollar
} from 'react-icons/hi';

export default function AccountHistoryDetail() {
  const { type, id } = useParams(); // type is 'retrait' or 'depot'
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (value) => {
    const amount = Number(value ?? 0);
    return amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let response;
      if (type === 'retrait') {
        response = await api.get(`/retraits/${id}`);
      } else {
        response = await api.get(`/depots/${id}`);
      }
      setItem(response.data.depot || response.data.retrait);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement des détails");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, type]);

  const handleDownloadReceipt = async () => {
    const toastId = toast.loading("Génération du reçu...");
    try {
      let response;
      if (type === 'retrait') {
        response = await api.get(`/retraits/${id}/pdf`, {
          responseType: 'blob'
        });
      } else {
        response = await api.get(`/depots/${id}/recu`, {
          responseType: 'blob'
        });
      }
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Reçu_${type === 'retrait' ? 'Retrait' : 'Depot'}_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Reçu téléchargé !", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération du reçu", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', border: '4px solid rgba(212,160,23,0.1)', borderTopColor: '#d4a017', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Chargement des détails...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const isRetrait = type === 'retrait';
  const typeLabel = isRetrait ? 'Retrait' : 'Dépôt';
  const reference = item?.reference_operation || item?.id || 'N/A';
  const client = item?.account?.client || item?.client;
  const soldeAvant = isRetrait ? item?.solde_avant : item?.ancien_solde;
  const soldeApres = isRetrait ? item?.solde_apres : item?.nouveau_solde;
  const guichetier = item?.guichetier || item?.creator;

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
        <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onClick={() => navigate(-1)} className="hover-gold">
          <HiOutlineArrowLeft size={16} style={{ display: 'inline-block', marginRight: 4 }} /> Retour
        </span>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: '1.8rem', fontWeight: 800, color: '#0f1929' }}>
            Détails {typeLabel}
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Référence: {reference}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadReceipt}
          style={{
            background: '#d4a017',
            color: '#0f1929',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(212,160,23,0.25)',
            transition: 'all 0.2s',
            fontFamily: 'Inter, sans-serif',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(212,160,23,0.35)';
            e.currentTarget.style.background = '#fae650';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212,160,23,0.25)';
            e.currentTarget.style.background = '#d4a017';
          }}
        >
          <HiOutlineDownload size={16} />
          Télécharger reçu
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(15,25,41,0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '32px' }}>
          {/* Informations Générales */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
            Informations Générales
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Référence</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{reference}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Date et Heure</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{formatDate(item?.created_at || item?.date_operation || item?.date_depot)}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Type</label>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: isRetrait ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                  color: isRetrait ? '#dc2626' : '#16a34a'
                }}
              >
                {typeLabel}
                {isRetrait && item?.type_retrait ? ` (${item.type_retrait})` : ''}
              </span>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Statut</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#16a34a', margin: 0 }}>Validé</p>
            </div>
          </div>

          {/* Informations Client */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
            Informations Client
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlineUser size={16} /> Nom et Prénom</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{client?.nom || 'N/A'} {client?.prenom || ''}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlineIdentification size={16} /> CIN</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{client?.cin || 'N/A'}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlinePhone size={16} /> Téléphone</label>
              <p style={{ fontSize: 15, color: 'var(--navy)', margin: 0 }}>{client?.phone || 'N/A'}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
              <p style={{ fontSize: 15, color: 'var(--navy)', margin: 0 }}>{client?.email || 'N/A'}</p>
            </div>
          </div>

          {/* Informations Compte */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
            Informations Compte
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Numéro de Compte</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{item?.account?.numero_compte || 'N/A'}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Type de Compte</label>
              <p style={{ fontSize: 15, color: 'var(--navy)', margin: 0 }}>{item?.account?.type?.name || 'N/A'}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Solde Avant</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{formatCurrency(soldeAvant)} MAD</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Solde Après</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#16a34a', margin: 0 }}>{formatCurrency(soldeApres)} MAD</p>
            </div>
          </div>

          {/* Informations Agence */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
            Informations Agence
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlineBuildingOffice size={16} /> Nom Agence</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{client?.agence?.name || client?.agence?.nom || 'N/A'}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Code Agence</label>
              <p style={{ fontSize: 15, color: 'var(--navy)', margin: 0 }}>{client?.agence?.code_agence || 'N/A'}</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Ville</label>
              <p style={{ fontSize: 15, color: 'var(--navy)', margin: 0 }}>{client?.agence?.ville || 'N/A'}</p>
            </div>
          </div>

          {/* Informations Agent */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
            Informations Agent
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlineUserCircle size={16} /> Nom Agent</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>
                {guichetier?.nom || guichetier?.name || 'N/A'} {guichetier?.prenom || ''}
              </p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Matricule</label>
              <p style={{ fontSize: 15, color: 'var(--navy)', margin: 0 }}>{guichetier?.id || 'N/A'}</p>
            </div>
          </div>

          {/* Informations Financières */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
            Informations Financières
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
            <div style={{ background: isRetrait ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}><HiOutlineCurrencyDollar size={16} /> Montant</label>
              <p style={{ fontSize: 18, fontWeight: 800, color: isRetrait ? '#dc2626' : '#16a34a', margin: 0 }}>{isRetrait ? '-' : '+'}{formatCurrency(item?.montant)} MAD</p>
            </div>
            <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Frais</label>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>0.00 MAD</p>
            </div>
          </div>

          {/* Dépôt or Retrait specific info */}
          {!isRetrait ? (
            <>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
                Informations Déposant
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
                <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Nom</label>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{item?.nom || 'N/A'}</p>
                </div>
                <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Prénom</label>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{item?.prenom || 'N/A'}</p>
                </div>
                <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>CIN</label>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{item?.cin || 'N/A'}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f1929', marginBottom: '1.25rem', borderBottom: '1px solid #f1ece6', paddingBottom: '0.5rem', fontFamily: 'Syne, sans-serif' }}>
                Informations Bénéficiaire
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: 36 }}>
                <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Nom</label>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{item?.cheque?.beneficiaire_nom || client?.nom || 'N/A'}</p>
                </div>
                <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Prénom</label>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{item?.cheque?.beneficiaire_prenom || client?.prenom || 'N/A'}</p>
                </div>
                <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>CIN</label>
                  <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{item?.cheque?.beneficiaire_cin || client?.cin || 'N/A'}</p>
                </div>
                {item?.cheque?.beneficiaire_cin_expiration && (
                  <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Expiration CIN</label>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{new Date(item.cheque.beneficiaire_cin_expiration).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
                {item?.cheque?.numero_cheque && (
                  <div style={{ background: '#faf7f0', padding: 16, borderRadius: 12 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>Numéro de Chèque</label>
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--navy)', margin: 0 }}>{item.cheque.numero_cheque}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .hover-gold:hover {
          color: #d4a017 !important;
        }
      `}</style>
    </div>
  );
}
