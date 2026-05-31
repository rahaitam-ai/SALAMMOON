import React from 'react';

function DepositStepper({ step = 1 }) {
  const steps = ['Sélection', 'Montant', 'Confirmation', 'Reçu'];
  return (
    <div className="mb-6 flex w-full max-w-4xl items-center justify-between gap-4">
      {steps.map((label, i) => {
        const idx = i + 1;
        const active = idx === step;
        const done = idx < step;
        return (
          <div key={label} className="flex-1">
            <div className="flex items-center">
              <div
                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                  done ? 'bg-emerald-500 text-white' : active ? 'bg-[#D4A017] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {done ? '✓' : idx}
              </div>
              <div className="text-sm font-medium text-slate-600">{label}</div>
            </div>
            {i < steps.length - 1 && <div className="mt-3 h-1 bg-slate-100" />}
          </div>
        );
      })}
    </div>
  );
}

export default DepositStepper;
