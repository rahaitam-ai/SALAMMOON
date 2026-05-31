import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../../api/axios';

export default function WithdrawalPersonalReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [retrait, setRetrait] = useState(location.state?.retrait || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!retrait && id) {
      setLoading(true);
      api.get(`/retraits/${id}`).then((res) => {
        setRetrait(res.data.retrait);
      }).catch(() => {
        // if not found, go back
        navigate(-1);
      }).finally(() => setLoading(false));
    }
  }, [id, retrait, navigate]);

  const downloadPdf = async () => {
    if (!retrait) return;
    try {
      const pdfResponse = await api.get(`/retraits/${retrait.id}/recu`, { responseType: 'blob' });
      const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recu-retrait-personnel-${retrait.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Impossible de télécharger le PDF.');
    }
  };

  if (loading || !retrait) return <div style={{ padding: 24 }}>Chargement...</div>;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f1929' }}>Reçu de Retrait Personnel</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 6 }}>Détails de l'opération</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(124,105,97,0.08)', boxShadow: '0 10px 30px rgba(124,105,97,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          <div style={{ marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Client</p>
            <h2 style={{ marginTop: 6, fontSize: 16, fontWeight: 800 }}>{retrait.client?.nom} {retrait.client?.prenom}</h2>
            <div style={{ fontFamily: 'monospace', color: '#0f1929', marginTop: 6 }}>{retrait.client?.cin}</div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Compte</p>
            <h3 style={{ marginTop: 6, fontSize: 15, fontWeight: 700 }}>{retrait.account?.numero_compte}</h3>
            <div style={{ marginTop: 6, color: '#0f1929' }}>Solde après retrait : <strong>{Number(retrait.solde_apres).toFixed(2)} Dhs</strong></div>
          </div>

          <div style={{ marginBottom: 18 }}>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Montant</p>
            <h3 style={{ marginTop: 6, fontSize: 20, fontWeight: 900, color: '#0f1720' }}>{Number(retrait.montant).toFixed(2)} Dhs</h3>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <button onClick={() => navigate(-1)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontWeight: 700 }}>Fermer</button>
            <button onClick={downloadPdf} style={{ padding: '10px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #b8963e, #8a6e2a)', color: '#fff', fontWeight: 800 }}>Télécharger le reçu</button>
            <button onClick={() => navigate('/agence/dashboard/retrait')} style={{ padding: '10px 16px', borderRadius: 10, background: '#059669', color: '#fff', fontWeight: 800 }}>Enregistrer et revenir</button>
          </div>
        </div>
      </div>
    </div>
  );
}
