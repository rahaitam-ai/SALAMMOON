import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  HiOutlineCheckCircle,
  HiOutlineDownload,
  HiOutlineArrowLeft,
  HiOutlinePrinter,
  HiOutlineCash,
  HiOutlineUser,
  HiOutlineLibrary,
  HiOutlineShieldCheck,
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineIdentification,
  HiOutlineClock,
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function DepositReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [depot, setDepot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  useEffect(() => {
    fetchDepot();
  }, [id]);

  useEffect(() => {
    if (depot && !pdfDownloaded) {
      setTimeout(() => {
        handleDownloadPdf();
        setPdfDownloaded(true);
      }, 800);
    }
  }, [depot]);

  const fetchDepot = async () => {
    try {
      const res = await api.get(`/depots/${id}`);
      setDepot(res.data.depot);
    } catch (err) {
      toast.error('Impossible de charger les détails du dépôt');
      navigate('/agence/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    const toastId = toast.loading('Génération du PDF...');
    try {
      const response = await api.get(`/depots/${id}/recu`, { responseType: 'blob' });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recu-depot-${depot.reference_operation}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Reçu PDF téléchargé !', { id: toastId });
    } catch (err) {
      toast.error('Erreur lors de la génération du PDF', { id: toastId });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatBalance = (val) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 16 }}>
        <div style={{ width: 50, height: 50, borderRadius: '50%', border: '4px solid rgba(212, 160, 23, 0.1)', borderTopColor: '#d4a017', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 14 }}>Chargement du reçu...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!depot) return null;

  const dateFormatted = new Date(depot.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
  const timeFormatted = new Date(depot.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif", animation: 'fadeInUp 0.5s ease-out', userSelect: 'none' }} className="receipt-page">
      {/* Back */}
      <button
        onClick={() => navigate('/agence/dashboard')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: '4px 0' }}
      >
        <HiOutlineArrowLeft size={16} /> Retour au tableau de bord
      </button>

      {/* Success banner */}
      <div style={{
        background: 'linear-gradient(135deg, #059669, #047857)', borderRadius: 20,
        padding: '1.75rem 2rem', marginBottom: 24, color: '#fff',
        display: 'flex', alignItems: 'center', gap: 16,
        boxShadow: '0 12px 30px rgba(5,150,105,0.2)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0
        }}>
          <HiOutlineCheckCircle />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>Dépôt Confirmé</h2>
          <p style={{ margin: '2px 0 0 0', fontSize: 13, opacity: 0.9 }}>
            Réf: <strong style={{ fontFamily: 'monospace', letterSpacing: '0.5px' }}>{depot.reference_operation}</strong>
          </p>
        </div>
      </div>

      {/* Receipt Card */}
      <div style={{
        background: '#fff', borderRadius: 24,
        border: '1px solid rgba(124,105,97,0.08)',
        boxShadow: '0 10px 30px rgba(124,105,97,0.03)', overflow: 'hidden',
      }}>
        {/* Receipt header */}
        <div style={{
          padding: '24px 28px 16px',
          borderBottom: '2px dashed #e8e4df',
          textAlign: 'center',
          background: '#fafaf9',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: 'rgba(212,160,23,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#d4a017', fontSize: 28,
            }}>
              <HiOutlineCash />
            </div>
          </div>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 900, color: '#0f1929', letterSpacing: '0.02em' }}>
            REÇU DE DÉPÔT
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: 12, color: 'var(--text-secondary)' }}>
            AL BARID BANK · Document officiel
          </p>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {/* Transaction ID */}
          <div style={{
            padding: '12px 16px', borderRadius: 12,
            background: '#f8fafc', border: '1px solid #e2e8f0',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 20,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ID Transaction
            </span>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#d4a017', fontFamily: 'monospace', letterSpacing: '1px' }}>
              {depot.reference_operation}
            </span>
          </div>

          {/* Info rows */}
          <div style={{ marginBottom: 20 }}>
            <SectionTitle icon={HiOutlineUser} title="DÉPOSANT" />
            <InfoRow label="Nom complet" value={`${depot.nom.toUpperCase()} ${depot.prenom}`} />
            <InfoRow label="CIN" value={depot.cin} />
            {depot.date_expiration_cin && (
              <InfoRow label="Expiration CIN" value={new Date(depot.date_expiration_cin).toLocaleDateString('fr-FR')} />
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <SectionTitle icon={HiOutlineLibrary} title="COMPTE BÉNÉFICIAIRE" />
            <InfoRow label="Titulaire" value={depot.account?.client ? `${depot.account.client.nom.toUpperCase()} ${depot.account.client.prenom}` : '—'} />
            <InfoRow label="Numéro de compte" value={depot.numero_compte} mono />
            <InfoRow label="RIB" value={depot.rib || '—'} mono />
          </div>

          <div style={{ marginBottom: 20 }}>
            <SectionTitle icon={HiOutlineCash} title="TRANSACTION" />
            <InfoRow label="Type de dépôt" value={depot.type_depot === 'especes' ? 'Espèces' : 'Chèque'} />
            <InfoRow label="Montant déposé" value={`${formatBalance(depot.montant)} MAD`} highlight />
          </div>

          <div>
            <SectionTitle icon={HiOutlineCalendar} title="DATE & HEURE" />
            <InfoRow label="Date" value={dateFormatted} />
            <InfoRow label="Heure" value={timeFormatted} />
            {/* Guichetier removed from receipt display */}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ marginTop: 24, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handleDownloadPdf}
          style={{
            padding: '14px 28px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #b8963e, #8a6e2a)', color: '#fff',
            fontWeight: 800, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: '0 8px 20px rgba(184,150,62,0.25)',
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <HiOutlineDownload size={18} /> Télécharger le PDF
        </button>
        <button
          onClick={handlePrint}
          style={{
            padding: '14px 28px', borderRadius: 12, border: '1px solid #e2e8f0',
            background: '#fff', color: '#0f1929', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <HiOutlinePrinter size={18} /> Imprimer
        </button>
        <button
          onClick={() => navigate('/agence/dashboard/depot')}
          style={{
            padding: '14px 28px', borderRadius: 12, border: '1px solid #e2e8f0',
            background: '#fff', color: '#0f1929', fontWeight: 700, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <HiOutlineCash size={18} /> Nouveau dépôt
        </button>
      </div>

      {/* Security note */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <HiOutlineShieldCheck size={14} style={{ color: '#10b981' }} />
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>
          Document généré électroniquement · Al Barid Bank
        </span>
      </div>

      <style>{`
        @media print {
          .receipt-page button { display: none !important; }
          .receipt-page > button:first-child { display: none !important; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '8px 0', borderBottom: '1px solid #f1ece6' }}>
      <Icon size={14} style={{ color: '#d4a017' }} />
      <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {title}
      </span>
    </div>
  );
}

function InfoRow({ label, value, mono, highlight }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '6px 0', borderBottom: '1px solid #f8f6f4',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      <span style={{
        fontSize: highlight ? 16 : 13, fontWeight: highlight ? 900 : 700,
        color: highlight ? '#059669' : '#0f1929',
        fontFamily: mono ? 'monospace' : 'inherit',
        letterSpacing: mono ? '0.5px' : 'inherit',
      }}>
        {value}
      </span>
    </div>
  );
}
