import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import {
  HiOutlineArrowLeft,
  HiOutlineDownload
} from 'react-icons/hi';

export default function AccountHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [retraits, setRetraits] = useState([]);
  const [depots, setDepots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'retraits', 'depots'

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
      const [accountRes, retraitsRes, depotsRes] = await Promise.all([
        api.get(`/accounts/${id}`),
        api.get(`/comptes/${id}/retraits`).catch(() => ({ data: { retraits: [] } })),
        api.get(`/comptes/${id}/depots`).catch(() => ({ data: { depots: [] } }))
      ]);
      setAccount(accountRes.data.account);
      setRetraits(retraitsRes.data.retraits || []);
      setDepots(depotsRes.data.depots || []);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du chargement de l'historique");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDownloadHistory = async () => {
    const toastId = toast.loading("Génération de l'historique...");
    try {
      const response = await api.get(`/accounts/${id}/historique-pdf`, {
        responseType: 'blob'
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Historique_Compte_${account?.numero_compte}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Historique téléchargé !", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération", { id: toastId });
    }
  };

  const handleDownloadReceipt = async (item) => {
    const isRetrait = item.type === 'retrait' || item.type_retrait;
    const toastId = toast.loading("Génération du reçu...");
    try {
      let response;
      if (isRetrait) {
        response = await api.get(`/retraits/${item.id}/recu`, {
          responseType: 'blob'
        });
      } else {
        response = await api.get(`/depots/${item.id}/recu`, {
          responseType: 'blob'
        });
      }
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Recu_${isRetrait ? 'Retrait' : 'Depot'}_${item.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Reçu téléchargé !", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la génération", { id: toastId });
    }
  };

  const combinedHistory = [
        ...retraits.map(r => ({ 
            ...r, 
            type: 'retrait',
            solde_avant: r.solde_avant,
            solde_apres: r.solde_apres
        })),
        ...depots.map(d => ({ 
            ...d, 
            type: 'depot',
            solde_avant: d.ancien_solde,
            solde_apres: d.nouveau_solde
        }))
    ].sort((a, b) => new Date(b.created_at || b.date_operation) - new Date(a.created_at || a.date_operation));

  if (loading) {
    return (
      <div style={{ padding: '24px 32px', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', border: '4px solid rgba(212, 160, 23, 0.1)', borderTopColor: '#d4a017', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Chargement de l'historique...</p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  const displayData = activeTab === 'retraits' ? retraits.map(r => ({ ...r, type: 'retrait' }))
    : activeTab === 'depots' ? depots.map(d => ({ ...d, type: 'depot' }))
    : combinedHistory;

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
        <span style={{ cursor: 'pointer', transition: 'color 0.15s' }} onClick={() => navigate(`/agence/dashboard/comptes/${id}`)} className="hover-gold">
          <HiOutlineArrowLeft size={16} style={{ display: 'inline-block', marginRight: 4 }} /> Retour aux détails
        </span>
      </div>

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: '0 0 8px', fontSize: '1.8rem', fontWeight: 800, color: '#0f1929' }}>
            Historique du Compte
          </h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Compte N° {account?.numero_compte} • {account?.client?.nom} {account?.client?.prenom}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownloadHistory}
          style={{
            background: '#d4a017',
            color: '#0f1929',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(212, 160, 23, 0.25)',
            transition: 'all 0.2s',
            fontFamily: 'Inter, sans-serif',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 160, 23, 0.35)';
            e.currentTarget.style.background = '#fae650';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 160, 23, 0.25)';
            e.currentTarget.style.background = '#d4a017';
          }}
        >
          <HiOutlineDownload size={16} /> Télécharger l'historique
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: 'Tout' },
          { id: 'retraits', label: 'Retraits' },
          { id: 'depots', label: 'Dépôts' },
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: activeTab === tab.id ? '1px solid #d4a017' : '1px solid #e2e8f0',
              background: activeTab === tab.id ? 'rgba(212, 160, 23, 0.1)' : '#fff',
              color: activeTab === tab.id ? '#d4a017' : '#64748b',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.15s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 20px 40px rgba(15, 25, 41, 0.08)', overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #f1ece6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {displayData.length} transaction{displayData.length > 1 ? 's' : ''} trouvée{displayData.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          {displayData.length === 0 ? (
            <div style={{ padding: '48px 32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p style={{ margin: 0, fontSize: '1rem' }}>Aucune transaction trouvée</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#faf7f0' }}>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', borderBottom: '1px solid #f1ece6' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', borderBottom: '1px solid #f1ece6' }}>Type</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', borderBottom: '1px solid #f1ece6' }}>Montant</th>
                  <th style={{ textAlign: 'right', padding: '14px 20px', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b', borderBottom: '1px solid #f1ece6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayData.map(item => {
                  const isRetrait = item.type === 'retrait' || item.type_retrait;
                  const typeLabel = isRetrait ? 'Retrait' : 'Dépôt';
                  const montant = item.montant;
                  const date = item.created_at || item.date_operation || item.date_depot;

                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8f8f7' }}>
                      <td style={{ padding: '16px 20px', color: '#0f1929', fontSize: '0.95rem', fontWeight: 500 }}>
                        {formatDate(date)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            background: isRetrait ? 'rgba(239, 68, 68, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                            color: isRetrait ? '#dc2626' : '#16a34a'
                          }}
                        >
                          {typeLabel}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: isRetrait ? '#dc2626' : '#16a34a', fontSize: '1rem', textAlign: 'right' }}>
                        {isRetrait ? '- ' : '+ '}{formatCurrency(montant)} DH
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleDownloadReceipt(item)}
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            color: '#16a34a',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            transition: 'all 0.15s'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.2)';
                          }}
                        >
                          <HiOutlineDownload size={14} /> Télécharger reçu
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
