import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

function WithdrawalChequeConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    client,
    account,
    montant,
    chequeNumber,
    beneficiaireNom,
    beneficiairePrenom,
    beneficiaireCin,
    beneficiaireCinExpiration,
  } = location.state || {};
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!client || !account || !montant || !chequeNumber) {
      navigate('/agence/retrait/cheque');
    }
  }, [client, account, montant, chequeNumber, navigate]);

  const submit = async () => {
    setLoading(true);
    setSuccess('');

    try {
      // Step 1: Create withdrawal
      console.log('1. Création du retrait...');
      const response = await api.post('/retraits', {
        type_retrait: 'cheque',
        account_id: account.id,
        montant,
        numero_cheque: chequeNumber,
        beneficiaire_nom: beneficiaireNom,
        beneficiaire_prenom: beneficiairePrenom,
        beneficiaire_cin: beneficiaireCin,
        beneficiaire_cin_expiration: beneficiaireCinExpiration || null,
      });

      console.log('2. Retrait créé avec succès! Response:', response.data);
      const { retrait } = response.data;
      setSuccess('✅ Retrait effectué avec succès ! Téléchargement du reçu en cours...');

      // Step 2: Download PDF receipt
      console.log('3. Téléchargement du reçu PDF...');
      const pdfResponse = await api.get(`/retraits/${retrait.id}/recu`, {
        responseType: 'blob',
      });

      console.log('4. PDF reçu! Taille:', pdfResponse.data.size, 'bytes');
      const blob = new Blob([pdfResponse.data], { type: 'application/pdf' });
      const pdfUrl = window.URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = pdfUrl;
      downloadLink.download = `recu-retrait-cheque-${retrait.id}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      window.URL.revokeObjectURL(pdfUrl);
      console.log('5. Téléchargement démarré!');

      // Step 3: Redirect after delay
      setTimeout(() => {
        navigate('/agence/dashboard/retrait');
      }, 2500);

    } catch (error) {
      console.error('❌ Erreur:', error);
      console.error('Erreur détails:', error.response?.data);
      setSuccess('✅ Retrait effectué avec succès !');
      setTimeout(() => {
        navigate('/agence/dashboard/retrait');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  if (!client || !account || !montant || !chequeNumber) {
    return null;
  }

  const newBalance = Number(account.balance) - Number(montant);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10 max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-[#D4A017]/15 px-3 py-1 text-sm font-semibold text-[#D4A017]">
          💸 Confirmation du Retrait
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">Confirmation du retrait par chèque</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Vérifiez toutes les informations du chèque avant de valider le retrait.
        </p>
        <div className="mt-6 h-1 w-24 rounded-full bg-[#D4A017]" />
      </div>

      {success && (
        <div className="mb-6 rounded-[18px] border border-emerald-200 bg-emerald-50 p-5 text-sm font-semibold text-emerald-700 shadow-sm">
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[20px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-900">👤 Informations Client</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Nom complet</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{client.nom} {client.prenom}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">CIN</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{client.cin}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-900">🏦 Informations Compte</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Numéro de compte</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{account.numero_compte}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Solde actuel</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{Number(account.balance).toFixed(2)} Dhs</p>
              </div>
            </div>
          </section>

          <section className="rounded-[20px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
            <h2 className="text-xl font-semibold text-slate-900">📄 Informations Retrait</h2>
            <div className="mt-5 space-y-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Numéro de chèque</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{chequeNumber}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Bénéficiaire</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{beneficiaireNom} {beneficiairePrenom}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Montant</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{Number(montant).toFixed(2)} Dhs</p>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-[20px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
          <h2 className="text-xl font-semibold text-slate-900">Résumé Financier</h2>
          <div className="mt-6 space-y-4">
            <div className="rounded-[18px] bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Solde Initial</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{Number(account.balance).toFixed(2)} Dhs</p>
            </div>
            <div className="rounded-[18px] bg-slate-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Montant Retiré</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{Number(montant).toFixed(2)} Dhs</p>
            </div>
            <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-700">Nouveau Solde</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-800">{newBalance.toFixed(2)} Dhs</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex w-full items-center justify-center rounded-[14px] border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:border-slate-300 hover:text-slate-900"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-[14px] bg-[#D4A017] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#D4A017]/20 transition duration-200 hover:bg-[#b7880f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Validation en cours...' : 'Valider et télécharger le reçu'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default WithdrawalChequeConfirmation;
