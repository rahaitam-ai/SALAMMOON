import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function WithdrawalPersonalConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { client, account, montant } = location.state || {};
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client || !account || !montant) {
      navigate('/agence/retrait/personnel');
    }
  }, [client, account, montant, navigate]);

  const submit = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/retraits', {
        type_retrait: 'personnel',
        account_id: account.id,
        montant,
      });

      const { retrait } = response.data;
      // Redirect to standalone receipt page so the user can review and download/save
      navigate(`/agence/retrait/personnel/recu/${retrait.id}`, { state: { retrait } });
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l’enregistrement du retrait.');
    } finally {
      setLoading(false);
    }
  };

  if (!client || !account || !montant) {
    return null;
  }

  const newBalance = Number(account.balance) - Number(montant);

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,160,23,0.12)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            💸
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f1929', margin: 0, letterSpacing: '-0.02em' }}>Confirmation du retrait</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Vérifiez toutes les informations avant de valider le retrait en agence.</p>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 24, padding: '14px 16px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600 }}>
          {error}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(124,105,97,0.08)', boxShadow: '0 10px 30px rgba(124,105,97,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          <div className="grid gap-[25px] xl:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-[25px]">
              <section className="rounded-[20px] border border-slate-200 bg-white p-[35px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <h2 className="text-[30px] font-semibold text-slate-900">👤 Informations Client</h2>
                <div className="mt-5 grid gap-[25px] sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Nom complet</p>
                    <p className="mt-3 text-[20px] font-semibold text-slate-900">{client.nom} {client.prenom}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">CIN</p>
                    <p className="mt-3 text-[20px] font-semibold text-slate-900">{client.cin}</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[20px] border border-slate-200 bg-white p-[35px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <h2 className="text-[30px] font-semibold text-slate-900">🏦 Informations Compte</h2>
                <div className="mt-5 grid gap-[25px] sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Numéro de compte</p>
                    <p className="mt-3 text-[20px] font-semibold text-slate-900">{account.numero_compte}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Solde actuel</p>
                    <p className="mt-3 text-[20px] font-semibold text-slate-900">{Number(account.balance).toFixed(2)} Dhs</p>
                  </div>
                </div>
              </section>

              <section className="rounded-[20px] border border-slate-200 bg-white p-[35px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <h2 className="text-[30px] font-semibold text-slate-900">💰 Informations Retrait</h2>
                <div className="mt-5 space-y-[25px]">
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Montant demandé</p>
                    <p className="mt-3 text-[20px] font-semibold text-slate-900">{Number(montant).toFixed(2)} Dhs</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Date de l'opération</p>
                    <p className="mt-3 text-[20px] font-semibold text-slate-900">{new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-[25px]">
              <section className="rounded-[20px] border border-slate-200 bg-white p-[35px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <h2 className="text-[30px] font-semibold text-slate-900">Résumé Financier</h2>
                <div className="mt-6 space-y-[25px]">
                  <div className="rounded-[18px] bg-slate-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Solde Initial</p>
                    <p className="mt-3 text-[24px] font-semibold text-slate-900">{Number(account.balance).toFixed(2)} Dhs</p>
                  </div>
                  <div className="rounded-[18px] bg-slate-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Montant Retiré</p>
                    <p className="mt-3 text-[24px] font-semibold text-slate-900">{Number(montant).toFixed(2)} Dhs</p>
                  </div>
                  <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
                    <p className="text-[16px] uppercase tracking-[0.2em] text-emerald-700">Nouveau Solde</p>
                    <p className="mt-3 text-[32px] font-semibold text-emerald-800">{newBalance.toFixed(2)} Dhs</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="inline-flex h-[60px] w-full items-center justify-center rounded-[14px] border border-slate-200 bg-white px-8 text-[20px] font-bold text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:text-slate-900"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={loading}
                    className="inline-flex h-[60px] w-full items-center justify-center rounded-[14px] bg-[#D4A017] px-8 text-[20px] font-bold text-white shadow-md shadow-[#D4A017]/20 transition duration-200 hover:bg-[#b7880f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Validation en cours...' : 'Valider et télécharger le reçu'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalPersonalConfirmation;
