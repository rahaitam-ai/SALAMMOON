import React from 'react';
import { useNavigate } from 'react-router-dom';
import DepositStepper from '../../components/DepositStepper';
import DepositCard from '../../components/DepositCard';

export default function DepositSelection() {
  const navigate = useNavigate();

  const proceed = () => {
    // In a real app you'd lookup client/accounts; here we pass a placeholder
    const client = { nom: 'Client', prenom: 'Test', cin: 'AA123456' };
    const account = { numero_compte: '000123456789', balance: 2500 };
    navigate('/agence/depot/montant', { state: { client, account } });
  };

  return (
    <div className="px-6 py-8 md:px-10 md:py-12 bg-slate-50 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <DepositStepper step={1} />
        <DepositCard>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[28px] font-semibold text-slate-900">Dépôt d'Argent — Sélection</h1>
              <p className="mt-2 text-slate-500">Sélectionnez le client et le compte pour le dépôt.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded bg-slate-50 p-4">Rechercher un client (maquette) — placeholder</div>
            <div className="rounded bg-slate-50 p-4">Sélection du compte — placeholder</div>
            <button onClick={proceed} className="mt-4 inline-flex h-12 items-center justify-center rounded-md bg-[#D4A017] px-6 font-bold text-white hover:opacity-95 transition">Continuer</button>
          </div>
        </DepositCard>
      </div>
    </div>
  );
}
