import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function WithdrawalPersonal() {
  const navigate = useNavigate();
  const [cin, setCin] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [client, setClient] = useState(null);
  const [account, setAccount] = useState(null);
  const [amount, setAmount] = useState('');
  const [typeRetrait, setTypeRetrait] = useState('personnel');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const inputClass =
    'mt-3 h-[65px] w-full rounded-[14px] border border-slate-200 bg-white px-[18px] text-[20px] text-slate-900 shadow-sm outline-none transition duration-200 focus:border-[#D4A017] focus:ring-2 focus:ring-[#D4A017]/20';

  const searchClient = async () => {
    setMessage('');
    setMessageType('');
    setClient(null);
    setAccount(null);

    if (!cin.trim() && !nom.trim() && !prenom.trim()) {
      setMessage('Veuillez saisir le CIN, le nom ou le prénom du client.');
      setMessageType('error');
      return;
    }

    const params = {};
    if (cin.trim()) params.cin = cin.trim();
    if (nom.trim()) params.nom = nom.trim();
    if (prenom.trim()) params.prenom = prenom.trim();

    setLoading(true);
    try {
      const response = await api.get('/clients/search', { params });
      setClient(response.data.client);
      setAccount(response.data.client.accounts[0] || null);
      setMessage('✅ Client trouvé avec succès.');
      setMessageType('success');
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Aucun client trouvé.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const continueToConfirmation = () => {
    if (!account) {
      setMessage('Le client doit avoir au moins un compte pour effectuer un retrait.');
      setMessageType('warning');
      return;
    }

    const montant = parseFloat(amount.replace(',', '.'));
    if (!montant || montant <= 0) {
      setMessage('Veuillez saisir un montant de retrait valide.');
      setMessageType('warning');
      return;
    }

    navigate('/agence/retrait/personnel/confirmation', {
      state: { client, account, montant, typeRetrait },
    });
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,160,23,0.12)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            💸
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f1929', margin: 0, letterSpacing: '-0.02em' }}>Retrait Personnel</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Retrait d'espèces directement depuis le compte du client.</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(124,105,97,0.08)', boxShadow: '0 10px 30px rgba(124,105,97,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          <div className="grid gap-[25px] xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-[25px]">
              <section className="rounded-[20px] border border-slate-200 bg-white p-[35px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-[30px] font-semibold text-slate-900">Recherche du client</h2>
                    <p className="mt-3 text-[20px] text-slate-500">Vérifiez le client par CIN et préparez le retrait.</p>
                  </div>
                  <div className="inline-flex h-[70px] w-[70px] items-center justify-center rounded-[18px] bg-[#D4A017]/10 text-[32px]">👤</div>
                </div>

                <label className="block text-[20px] font-semibold text-slate-700">Nom du client</label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: Dupont"
                />

                <label className="block text-[20px] font-semibold text-slate-700">Prénom du client</label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: Jean"
                />

                <label className="block text-[20px] font-semibold text-slate-700">CIN du client</label>
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  className={inputClass}
                  placeholder="Ex: AA123456"
                />

                <button
                  type="button"
                  onClick={searchClient}
                  disabled={loading}
                  className="mt-6 inline-flex h-[60px] w-full items-center justify-center gap-3 rounded-[14px] bg-[#D4A017] px-8 text-[20px] font-bold text-white shadow-md shadow-[#D4A017]/20 transition duration-200 hover:bg-[#b7880f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Recherche...' : 'Rechercher'}
                </button>
              </section>

              {message && (
                <div
                  className={`rounded-[18px] border px-5 py-4 text-[20px] font-semibold shadow-sm ${
                    messageType === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : messageType === 'warning'
                      ? 'border-amber-200 bg-amber-50 text-amber-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  {message}
                </div>
              )}

              {client && (
                <section className="rounded-[20px] border border-slate-200 bg-white p-[35px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-[30px] font-semibold text-slate-900">👤 Informations du Client</h3>
                      <p className="mt-3 text-[20px] text-slate-500">Détails du titulaire et du compte vérifié.</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-[18px] font-semibold text-emerald-700">
                      Compte Vérifié
                    </span>
                  </div>
                  <div className="grid gap-[25px] md:grid-cols-2">
                    <div className="rounded-[18px] bg-slate-50 p-5">
                      <p className="text-[16px] uppercase tracking-[0.18em] text-slate-500">Nom complet</p>
                      <p className="mt-3 text-[20px] font-semibold text-slate-900">{client.nom} {client.prenom}</p>
                    </div>
                    <div className="rounded-[18px] bg-slate-50 p-5">
                      <p className="text-[16px] uppercase tracking-[0.18em] text-slate-500">CIN</p>
                      <p className="mt-3 text-[20px] font-semibold text-slate-900">{client.cin}</p>
                    </div>
                    <div className="rounded-[18px] bg-slate-50 p-5">
                      <p className="text-[16px] uppercase tracking-[0.18em] text-slate-500">Numéro de compte</p>
                      <p className="mt-3 text-[20px] font-semibold text-slate-900">{account?.numero_compte || 'N/A'}</p>
                    </div>
                    <div className="rounded-[18px] bg-slate-50 p-5">
                      <p className="text-[16px] uppercase tracking-[0.18em] text-slate-500">Solde actuel</p>
                      <p className="mt-3 text-[20px] font-semibold text-slate-900">{account ? Number(account.balance).toFixed(2) : '0.00'} Dhs</p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            <div className="space-y-[25px]">
              {messageType === 'success' && client ? (
                <section className="rounded-[20px] border border-slate-200 bg-white p-[35px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-[30px] font-semibold text-slate-900">Montant du retrait</h3>
                      <p className="mt-3 text-[20px] text-slate-500">Saisissez le montant à retirer et confirmez l’opération.</p>
                    </div>
                    <div className="inline-flex h-[70px] w-[70px] items-center justify-center rounded-[18px] bg-[#D4A017]/10 text-[32px]">💰</div>
                  </div>

                  <label className="block text-[20px] font-semibold text-slate-700">Montant</label>
                  <div className="relative mt-4">
                    <span className="pointer-events-none absolute inset-y-0 left-5 flex items-center text-[22px] text-slate-400">💰</span>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`${inputClass} pl-[55px]`}
                    />
                  </div>

                  <label className="block text-[20px] font-semibold text-slate-700 mt-4">Type de retrait</label>
                  <select
                    value={typeRetrait}
                    onChange={(e) => setTypeRetrait(e.target.value)}
                    className={`${inputClass} mt-3 h-[60px] px-4 py-2`}
                  >
                    <option value="personnel">Retrait Personnel</option>
                    <option value="cheque">Retrait par Chèque</option>
                  </select>

                  <button
                    type="button"
                    onClick={continueToConfirmation}
                    disabled={!(client && messageType === 'success' && account)}
                    className="mt-8 inline-flex h-[60px] w-full items-center justify-center rounded-[14px] bg-[#D4A017] px-8 text-[20px] font-bold text-white shadow-md shadow-[#D4A017]/20 transition duration-200 hover:bg-[#b7880f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Continuer
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/agence/dashboard')}
                    className="mt-4 inline-flex h-[60px] w-full items-center justify-center rounded-[14px] bg-rose-500 px-8 text-[20px] font-bold text-white shadow-md shadow-rose-500/20 transition duration-200 hover:bg-rose-600"
                  >
                    Annuler
                  </button>
                </section>
              ) : (
                <section className="rounded-[20px] border border-slate-200 bg-white p-[35px] shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <div className="text-[18px] text-slate-500">Effectuez la recherche d'abord pour afficher le formulaire de retrait.</div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalPersonal;
