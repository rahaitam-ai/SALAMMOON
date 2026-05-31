import { useNavigate } from 'react-router-dom';

function WithdrawalSelection() {
  const navigate = useNavigate();

  const cards = [
    {
      icon: '👤',
      title: 'Retrait Personnel',
      description: "Retrait d'espèces directement depuis le compte du client.",
      path: '/agence/retrait/personnel',
    },
    {
      icon: '📄',
      title: 'Retrait par Chèque',
      description: 'Paiement d’un chèque avec vérification du compte et du solde.',
      path: '/agence/retrait/cheque',
    },
  ];

  return (
    <div style={{ maxWidth: 980, margin: '0 auto', padding: '3rem 2rem', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212,160,23,0.12)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            💸
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f1929', margin: 0, letterSpacing: '-0.02em' }}>Gestion des Retraits</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Effectuer un retrait personnel ou un retrait par chèque</p>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(124,105,97,0.08)', boxShadow: '0 10px 30px rgba(124,105,97,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: '2rem' }}>
          <div className="grid gap-[28px] md:grid-cols-2">
            {cards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => navigate(card.path)}
                className="group flex min-h-[320px] flex-col justify-between overflow-hidden rounded-[20px] border border-transparent bg-white p-[44px] text-left shadow-[0_12px_36px_rgba(0,0,0,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#D4A017] hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
              >
                <div>
                  <div className="inline-flex h-[90px] w-[90px] items-center justify-center rounded-[18px] bg-[#D4A017]/10 text-[40px] transition duration-300 group-hover:bg-[#D4A017] group-hover:text-white">
                    {card.icon}
                  </div>
                  <h2 className="mt-8 text-[36px] font-semibold text-slate-900">{card.title}</h2>
                  <p className="mt-4 text-[22px] leading-9 text-slate-600">{card.description}</p>
                </div>
                <div className="mt-8 inline-flex items-center gap-2 text-[22px] font-semibold text-[#D4A017]">
                  Commencer <span aria-hidden="true">→</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WithdrawalSelection;
