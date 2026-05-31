import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function WithdrawalCheque() {
  const navigate = useNavigate();
  const [cin, setCin] = useState('');
  const [client, setClient] = useState(null);
  const [account, setAccount] = useState(null);
  const [clientTrouve, setClientTrouve] = useState(false);
  const [amount, setAmount] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [beneficiaireNom, setBeneficiaireNom] = useState('');
  const [beneficiairePrenom, setBeneficiairePrenom] = useState('');
  const [beneficiaireCin, setBeneficiaireCin] = useState('');
  const [beneficiaireCinExpiration, setBeneficiaireCinExpiration] = useState('');
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
    setClientTrouve(false);

    if (!cin.trim()) {
      setMessage('Veuillez saisir le CIN du client.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/clients/search', { params: { cin } });
      setClient(response.data.client);
      setAccount(response.data.client.accounts[0] || null);
      setMessage('Client trouvé avec succès.');
      setMessageType('success');
      setClientTrouve(true);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Aucun client trouvé avec ce CIN.');
      setMessageType('error');
      setClientTrouve(false);
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

    if (!chequeNumber || !beneficiaireNom || !beneficiairePrenom || !beneficiaireCin) {
      setMessage('Veuillez renseigner toutes les informations du chèque et du bénéficiaire.');
      setMessageType('warning');
      return;
    }

    if (montant > Number(account.balance)) {
      setMessage('⚠️ Solde insuffisant pour ce chèque. Vous pouvez générer un avis de rejet.');
      setMessageType('warning');
      return;
    }

    navigate('/agence/retrait/cheque/confirmation', {
      state: {
        client,
        account,
        montant,
        chequeNumber,
        beneficiaireNom,
        beneficiairePrenom,
        beneficiaireCin,
        beneficiaireCinExpiration,
      },
    });
  };

  const generateRejection = async () => {
    if (!account) {
      setMessage("Veuillez d'abord rechercher un client.");
      setMessageType('error');
      return;
    }

    if (!chequeNumber || !beneficiaireNom || !beneficiairePrenom || !beneficiaireCin || !amount) {
      setMessage('Veuillez remplir toutes les informations du chèque et du bénéficiaire.');
      setMessageType('warning');
      return;
    }

    const montant = parseFloat(amount.replace(',', '.'));
    if (!montant || montant <= 0) {
      setMessage('Veuillez saisir un montant de retrait valide.');
      setMessageType('warning');
      return;
    }

    setMessage('');
    setMessageType('');
    setLoading(true);

    try {
      const response = await api.post('/certificat-non-paiement', {
        numero_cheque: chequeNumber,
        account_id: account.id,
        beneficiaire_nom: beneficiaireNom,
        beneficiaire_prenom: beneficiairePrenom,
        beneficiaire_cin: beneficiaireCin,
        beneficiaire_cin_expiration: beneficiaireCinExpiration || null,
        montant,
        motif: 'Provision insuffisante',
      });

      const avisId = response.data.avis.id;
      const pdfResponse = await api.get(`/certificat-non-paiement/${avisId}/pdf`, {
        responseType: 'blob',
      });

      const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `avis-rejet-cheque-${avisId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erreur lors de la génération du certificat.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,160,23,0.12)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            💸
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f1929', margin: 0, letterSpacing: '-0.02em' }}>Retrait par Chèque</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Paiement d’un chèque avec vérification du compte et du solde.</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(124,105,97,0.08)', boxShadow: '0 10px 30px rgba(124,105,97,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
            <div className="space-y-6">
              <section className="rounded-[20px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-[30px] font-semibold text-slate-900">Recherche du client titulaire</h2>
                    <p className="mt-3 text-[20px] text-slate-500">Recherchez le CIN et chargez les informations du titulaire.</p>
                  </div>
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4A017]/10 text-3xl">🪪</div>
                </div>

                <label className="block text-[20px] font-semibold text-slate-700">CIN du client</label>
                <input
                  type="text"
                  value={cin}
                  onChange={(e) => setCin(e.target.value)}
                  placeholder="Ex: AA123456"
                  className={inputClass}
                />

                <button
                  type="button"
                  onClick={searchClient}
                  disabled={loading}
                  className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-[14px] bg-[#D4A017] px-8 text-[20px] font-bold text-white shadow-md shadow-[#D4A017]/20 transition duration-200 hover:bg-[#b7880f] disabled:cursor-not-allowed disabled:opacity-60"
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
                <section className="rounded-[20px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-[30px] font-semibold text-slate-900">👤 Informations du Client</h3>
                      <p className="mt-3 text-[20px] text-slate-500">Détails du titulaire et du compte vérifié.</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-4 py-2 text-[18px] font-semibold text-emerald-700">
                      Compte Vérifié
                    </span>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="rounded-[18px] bg-slate-50 p-5">
                      <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Nom complet</p>
                      <p className="mt-3 text-[20px] font-semibold text-slate-900">{client.nom} {client.prenom}</p>
                    </div>
                    <div className="rounded-[18px] bg-slate-50 p-5">
                      <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">CIN</p>
                      <p className="mt-3 text-[20px] font-semibold text-slate-900">{client.cin}</p>
                    </div>
                    <div className="rounded-[18px] bg-slate-50 p-5">
                      <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Numéro de compte</p>
                      <p className="mt-3 text-[20px] font-semibold text-slate-900">{account?.numero_compte || 'N/A'}</p>
                    </div>
                    <div className="rounded-[18px] bg-slate-50 p-5">
                      <p className="text-[16px] uppercase tracking-[0.2em] text-slate-500">Solde actuel</p>
                      <p className="mt-3 text-[20px] font-semibold text-slate-900">{account ? Number(account.balance).toFixed(2) : '0.00'} Dhs</p>
                    </div>
                  </div>
                </section>
              )}
            </div>

            {clientTrouve && (
              <div className="space-y-6">
                <section className="rounded-[20px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                  <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-[30px] font-semibold text-slate-900">📄 Informations du chèque</h3>
                      <p className="mt-3 text-[20px] text-slate-500">Complétez les informations avant de confirmer.</p>
                    </div>
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4A017]/10 text-3xl">💳</div>
                  </div>

                  <div className="grid gap-6">
                    <div>
                      <label className="block text-[20px] font-semibold text-slate-700">Numéro de chèque</label>
                      <input
                        type="text"
                        value={chequeNumber}
                        onChange={(e) => setChequeNumber(e.target.value)}
                        className={inputClass}
                        placeholder="Ex: CHQ123456"
                      />
                    </div>
                    <div>
                      <label className="block text-[20px] font-semibold text-slate-700">Montant</label>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className={inputClass}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-[20px] font-semibold text-slate-700">Bénéficiaire - Nom</label>
                        <input
                          type="text"
                          value={beneficiaireNom}
                          onChange={(e) => setBeneficiaireNom(e.target.value)}
                          className={inputClass}
                          placeholder="Nom"
                        />
                      </div>
                      <div>
                        <label className="block text-[20px] font-semibold text-slate-700">Bénéficiaire - Prénom</label>
                        <input
                          type="text"
                          value={beneficiairePrenom}
                          onChange={(e) => setBeneficiairePrenom(e.target.value)}
                          className={inputClass}
                          placeholder="Prénom"
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <label className="block text-[20px] font-semibold text-slate-700">CIN du bénéficiaire</label>
                        <input
                          type="text"
                          value={beneficiaireCin}
                          onChange={(e) => setBeneficiaireCin(e.target.value)}
                          className={inputClass}
                          placeholder="CIN"
                        />
                      </div>
                      <div>
                        <label className="block text-[20px] font-semibold text-slate-700">Expiration CIN</label>
                        <input
                          type="date"
                          value={beneficiaireCinExpiration}
                          onChange={(e) => setBeneficiaireCinExpiration(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 md:flex-row">
                    <button
                      type="button"
                      onClick={continueToConfirmation}
                      className="inline-flex h-14 w-full items-center justify-center rounded-[14px] bg-[#D4A017] px-8 text-[20px] font-bold text-white shadow-md shadow-[#D4A017]/20 transition duration-200 hover:bg-[#b7880f]"
                    >
                      Continuer
                    </button>
                    <button
                      type="button"
                      onClick={generateRejection}
                      disabled={loading}
                      className="inline-flex h-14 w-full items-center justify-center rounded-[14px] bg-rose-500 px-8 text-[20px] font-bold text-white shadow-md shadow-rose-500/20 transition duration-200 hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Générer l'avis de rejet
                    </button>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalCheque;
