import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineCash,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineArrowLeft,
  HiOutlineExclamationCircle,
  HiOutlineArrowRight,
  HiOutlineX
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const STEPS = [
  { num: 1, label: 'Vérification', icon: HiOutlineSearch },
  { num: 2, label: 'Déposant', icon: HiOutlineUser },
  { num: 3, label: 'Montant', icon: HiOutlineCash },
  { num: 4, label: 'Confirmation', icon: HiOutlineCheckCircle },
];

export default function DepositPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');

  // Step 1
  const [identifier, setIdentifier] = useState('');

  // Step 2
  const [depositor, setDepositor] = useState({
    nom: '',
    prenom: '',
    cin: '',
    date_expiration_cin: '',
  });
  const [errors, setErrors] = useState({});

  // Step 3
  const [montant, setMontant] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ─── STEP 1: Verify Account ───
  const handleVerify = async () => {
    if (!identifier.trim()) {
      setError('Veuillez saisir un RIB ou numéro de compte.');
      return;
    }
    setLoading(true);
    setError('');
    setAccount(null);
    try {
      const res = await api.post('/accounts/verify', { identifier: identifier.trim() });
      if (res.data.exists) {
        setAccount(res.data.account);
        setStep(2);
        toast.success('Compte vérifié avec succès');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Compte introuvable. Vérifiez les informations saisies.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ─── STEP 2: Validate depositor info ───
  const validateStep2 = () => {
    const errs = {};
    if (!depositor.nom.trim()) errs.nom = 'Le nom est obligatoire';
    if (!depositor.prenom.trim()) errs.prenom = 'Le prénom est obligatoire';
    if (!depositor.cin.trim()) errs.cin = 'Le CIN est obligatoire';
    else if (depositor.cin.trim().length < 5) errs.cin = 'Format CIN invalide';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep2Next = () => {
    if (validateStep2()) setStep(3);
  };

  const handleStep3Next = () => {
    const amount = parseFloat(montant);
    if (!montant || isNaN(amount) || amount <= 0) {
      toast.error('Veuillez saisir un montant valide supérieur à 0');
      return;
    }
    setStep(4);
  };

  // ─── STEP 4: Submit Deposit ───
  const handleSubmit = async () => {
    const amount = parseFloat(montant);
    if (!montant || isNaN(amount) || amount <= 0) {
      toast.error('Veuillez saisir un montant valide supérieur à 0');
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post('/depots', {
        account_id: account.id,
        nom: depositor.nom.trim(),
        prenom: depositor.prenom.trim(),
        cin: depositor.cin.trim(),
        date_expiration_cin: depositor.date_expiration_cin || null,
        montant: amount,
        type_depot: 'especes',
      });
      toast.success('Dépôt enregistré avec succès !');
      navigate(`/agence/dashboard/depot-recu/${res.data.depot.id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'enregistrement du dépôt';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAccount(null);
    setIdentifier('');
    setDepositor({ nom: '', prenom: '', cin: '', date_expiration_cin: '' });
    setMontant('');
    setError('');
    setErrors({});
  };

  const formatBalance = (val) => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Back */}
      <button
        onClick={() => navigate('/agence/dashboard')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 24, padding: '4px 0' }}
      >
        <HiOutlineArrowLeft size={16} /> Retour au tableau de bord
      </button>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(212, 160, 23, 0.12)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            <HiOutlineCash />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f1929', margin: 0, letterSpacing: '-0.02em' }}>Dépôt d'Argent</h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Versement sécurisé sur compte bancaire</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, background: '#fff', borderRadius: 16, padding: '6px 16px', border: '1px solid rgba(124,105,97,0.08)', boxShadow: '0 4px 16px rgba(124,105,97,0.04)' }}>
        {STEPS.map((s, i) => (
          <div key={s.num} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 8px', opacity: step === s.num ? 1 : step > s.num ? 0.85 : 0.4, transition: 'all 0.3s' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, flexShrink: 0,
              background: step >= s.num ? 'linear-gradient(135deg, #b8963e, #8a6e2a)' : '#f1f0ee',
              color: step >= s.num ? '#fff' : '#9a847a',
              boxShadow: step >= s.num ? '0 4px 10px rgba(184,150,62,0.3)' : 'none',
            }}>
              {step > s.num ? <HiOutlineCheckCircle size={18} /> : s.num}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: step >= s.num ? '#0f1929' : '#9a847a', letterSpacing: '0.03em' }}>{s.label}</p>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 8px', background: step > s.num ? '#b8963e' : '#e8e4df', borderRadius: 1 }} />
            )}
          </div>
        ))}
      </div>

      {/* Content Card */}
      <div style={{ background: '#fff', borderRadius: 24, border: '1px solid rgba(124,105,97,0.08)', boxShadow: '0 10px 30px rgba(124,105,97,0.03)', overflow: 'hidden' }}>
        
        {/* ═══════════════════════ STEP 1 ═══════════════════════ */}
        {step === 1 && (
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(37,99,235,0.08)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                <HiOutlineSearch />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f1929', margin: 0 }}>Vérification du Compte</h2>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Saisissez le RIB ou le numéro de compte</p>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f1929', marginBottom: 8 }}>
                RIB ou Numéro de Compte <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="Ex: 0078001234567890 ou ABB..."
                  style={{
                    flex: 1, padding: '14px 16px', borderRadius: 12, border: '1.5px solid #e8e4df',
                    fontSize: 14, fontWeight: 600, color: '#0f1929', outline: 'none',
                    transition: 'border-color 0.2s', fontFamily: "'Inter', sans-serif",
                  }}
                  className="deposit-input"
                />
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  style={{
                    padding: '14px 28px', borderRadius: 12, border: 'none',
                    background: 'linear-gradient(135deg, #b8963e, #8a6e2a)', color: '#fff',
                    fontWeight: 800, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8,
                    whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {loading ? (
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.6s linear infinite' }} />
                  ) : (
                    <><HiOutlineSearch size={16} /> Vérifier</>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '14px 16px', borderRadius: 12, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 10 }}>
                <HiOutlineExclamationCircle size={20} />
                {error}
              </div>
            )}

            <div style={{ marginTop: 24, padding: '16px 20px', background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#0f1929', marginBottom: 8 }}>Format attendu</p>
              <ul style={{ margin: 0, padding: '0 0 0 18px', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                <li><strong style={{ color: '#0f1929' }}>RIB complet</strong> : 24 chiffres (ex: 0078001234567890)</li>
                <li><strong style={{ color: '#0f1929' }}>Numéro de compte</strong> : Format interne (ex: ABB-001-...)  </li>
              </ul>
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 2 ═══════════════════════ */}
        {step === 2 && account && (
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(16,185,129,0.08)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                <HiOutlineUser />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f1929', margin: 0 }}>Informations du Déposant</h2>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Identité de la personne effectuant le dépôt</p>
              </div>
            </div>

            {/* Verified account summary */}
            <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', marginBottom: 24, userSelect: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <HiOutlineCheckCircle size={16} style={{ color: '#10b981' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#065f46' }}>Compte vérifié</span>
              </div>
              <div style={{ fontSize: 13, color: '#0f1929', fontWeight: 600 }}>
                {account.client_name} · <span style={{ fontFamily: 'monospace' }}>{account.rib}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                <span>Solde : <strong style={{ color: '#0f1929' }}>{formatBalance(account.balance)} MAD</strong></span>
                <span>Statut : 
                  <span style={{
                    color: account.status === 'active' ? '#059669' : '#dc2626',
                    fontWeight: 700,
                    background: account.status === 'active' ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
                    padding: '2px 8px', borderRadius: 6, fontSize: 11,
                  }}>
                    {account.status === 'active' ? 'Actif' : 'Bloqué'}
                  </span>
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f1929', marginBottom: 6 }}>
                  Nom <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  value={depositor.nom}
                  onChange={(e) => setDepositor({ ...depositor, nom: e.target.value })}
                  placeholder="Nom"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${errors.nom ? '#dc2626' : '#e8e4df'}`,
                    fontSize: 13, fontWeight: 600, color: '#0f1929', outline: 'none',
                    transition: 'border-color 0.2s', fontFamily: "'Inter', sans-serif",
                  }}
                  className="deposit-input"
                />
                {errors.nom && <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#dc2626' }}>{errors.nom}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f1929', marginBottom: 6 }}>
                  Prénom <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  value={depositor.prenom}
                  onChange={(e) => setDepositor({ ...depositor, prenom: e.target.value })}
                  placeholder="Prénom"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${errors.prenom ? '#dc2626' : '#e8e4df'}`,
                    fontSize: 13, fontWeight: 600, color: '#0f1929', outline: 'none',
                    transition: 'border-color 0.2s', fontFamily: "'Inter', sans-serif",
                  }}
                  className="deposit-input"
                />
                {errors.prenom && <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#dc2626' }}>{errors.prenom}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f1929', marginBottom: 6 }}>
                  CIN <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  value={depositor.cin}
                  onChange={(e) => setDepositor({ ...depositor, cin: e.target.value.toUpperCase() })}
                  placeholder="Ex: AB123456"
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10, border: `1.5px solid ${errors.cin ? '#dc2626' : '#e8e4df'}`,
                    fontSize: 13, fontWeight: 600, color: '#0f1929', outline: 'none',
                    transition: 'border-color 0.2s', fontFamily: "'Inter', sans-serif",
                  }}
                  className="deposit-input"
                />
                {errors.cin && <p style={{ margin: '4px 0 0 0', fontSize: 11, color: '#dc2626' }}>{errors.cin}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f1929', marginBottom: 6 }}>Date d'expiration CIN</label>
                <input
                  type="date"
                  value={depositor.date_expiration_cin}
                  onChange={(e) => setDepositor({ ...depositor, date_expiration_cin: e.target.value })}
                  style={{
                    width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e8e4df',
                    fontSize: 13, fontWeight: 600, color: '#0f1929', outline: 'none',
                    transition: 'border-color 0.2s', fontFamily: "'Inter', sans-serif",
                  }}
                  className="deposit-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 3 ═══════════════════════ */}
        {step === 3 && account && (
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(212,160,23,0.08)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                <HiOutlineCash />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f1929', margin: 0 }}>Montant du Dépôt</h2>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Confirmez le montant à verser</p>
              </div>
            </div>

            {/* Recap card */}
            <div style={{ marginBottom: 24, padding: '16px 20px', borderRadius: 16, background: '#fdfbf7', border: '1px solid rgba(212,160,23,0.15)' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>Récapitulatif</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Compte</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: 14, fontWeight: 700, color: '#0f1929' }}>{account.client_name}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>RIB</p>
                  <p style={{ margin: '2px 0 0 0', fontSize: 13, fontWeight: 600, color: '#0f1929', fontFamily: 'monospace' }}>{account.rib}</p>
                </div>
              </div>
            </div>

            {/* Amount input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#0f1929', marginBottom: 8 }}>
                Montant à déposer <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleStep3Next()}
                  placeholder="0,00"
                  style={{
                    width: '100%', padding: '16px 60px 16px 18px', borderRadius: 14,
                    border: '1.5px solid #e8e4df', fontSize: 28, fontWeight: 900,
                    color: '#0f1929', outline: 'none', textAlign: 'right',
                    transition: 'border-color 0.2s', fontFamily: "'Inter', sans-serif",
                    background: montant && parseFloat(montant) > 0 ? '#f0fdf4' : '#fff',
                  }}
                  className="deposit-input"
                />
                <span style={{ position: 'absolute', right: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>MAD</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════ STEP 4: CONFIRMATION ═══════════════════════ */}
        {step === 4 && account && (
          <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(139, 92, 246, 0.08)', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                <HiOutlineShieldCheck />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0f1929', margin: 0 }}>Récapitulatif & Confirmation</h2>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0 0' }}>Vérifiez les informations avant enregistrement</p>
              </div>
            </div>

            {/* DEPOSITOR INFO */}
            <div style={{ marginBottom: 18, padding: '16px 18px', borderRadius: 14, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>Informations du Déposant</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Nom</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929' }}>{depositor.nom}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Prénom</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929' }}>{depositor.prenom}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>CIN</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929', fontFamily: 'monospace' }}>{depositor.cin}</p>
                </div>
                {depositor.date_expiration_cin && (
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Expiration CIN</p>
                    <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929' }}>{new Date(depositor.date_expiration_cin).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* BENEFICIARY INFO */}
            <div style={{ marginBottom: 18, padding: '16px 18px', borderRadius: 14, background: '#fef3f2', border: '1px solid #fecaca' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7c2d12' }}>Compte Bénéficiaire</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Titulaire</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929' }}>{account.client_name}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Numéro de compte</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929', fontFamily: 'monospace' }}>{account.numero_compte}</p>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>RIB</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929', fontFamily: 'monospace', letterSpacing: '0.5px' }}>{account.rib}</p>
                </div>
              </div>
            </div>

            {/* DEPOSIT AMOUNT */}
            <div style={{ marginBottom: 18, padding: '16px 18px', borderRadius: 14, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#065f46' }}>Montant du Dépôt</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Montant à déposer</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#059669' }}>{formatBalance(parseFloat(montant))} MAD</span>
              </div>
            </div>

            {/* TRANSACTION DATE/TIME */}
            <div style={{ marginBottom: 18, padding: '16px 18px', borderRadius: 14, background: '#f9f5ff', border: '1px solid #e9d5ff' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6b21a8' }}>Détails de la Transaction</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Date</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929' }}>{new Date().toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-secondary)' }}>Heure</p>
                  <p style={{ margin: '3px 0 0 0', fontSize: 13, fontWeight: 700, color: '#0f1929' }}>{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>

            {/* SECURITY WARNING */}
            <div style={{ padding: '14px 16px', borderRadius: 12, background: 'rgba(212,160,23,0.06)', border: '1px solid rgba(212,160,23,0.2)', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <HiOutlineShieldCheck size={18} style={{ color: '#d4a017', marginTop: 2, flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 12, color: '#0f1929', lineHeight: 1.5 }}>
                En cliquant sur "ENREGISTRER LE DÉPÔT", vous confirmez l'exactitude de ces informations. La transaction est irréversible.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════ FOOTER ═══════════════════════ */}
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid #f1ece6', background: '#fafaf9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 700, fontSize: 13, color: '#0f1929', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
            >
              <HiOutlineArrowLeft size={16} /> Retour
            </button>
          ) : (
            <button
              onClick={() => navigate('/agence/dashboard')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '12px 20px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 700, fontSize: 13, color: '#0f1929', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
            >
              <HiOutlineX size={16} /> Annuler
            </button>
          )}

          {step === 1 && (
            <button
              onClick={handleVerify}
              disabled={loading}
              style={{
                padding: '12px 28px', borderRadius: 10, border: 'none',
                background: loading ? '#9a847a' : 'linear-gradient(135deg, #b8963e, #8a6e2a)',
                color: '#fff', fontWeight: 800, fontSize: 13, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif",
              }}
            >
              {loading ? 'Vérification...' : <><HiOutlineArrowRight size={16} /> Vérifier le compte</>}
            </button>
          )}

          {step === 2 && (
            <button
              onClick={handleStep2Next}
              style={{
                padding: '12px 28px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #b8963e, #8a6e2a)', color: '#fff',
                fontWeight: 800, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif",
              }}
            >
              Suivant <HiOutlineArrowRight size={16} />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleStep3Next}
              style={{
                padding: '12px 28px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #b8963e, #8a6e2a)', color: '#fff',
                fontWeight: 800, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Inter', sans-serif",
              }}
            >
              Vérifier <HiOutlineArrowRight size={16} />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '14px 32px', borderRadius: 12, border: 'none',
                background: submitting ? '#9a847a' : 'linear-gradient(135deg, #059669, #047857)',
                color: '#fff', fontWeight: 800, fontSize: 14, cursor: submitting ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 20px rgba(5,150,105,0.25)',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {submitting ? (
                <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.6s linear infinite' }} /> Enregistrement...</>
              ) : (
                <><HiOutlineCheckCircle size={20} /> ENREGISTRER LE DÉPÔT</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Security note */}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
        <HiOutlineShieldCheck size={14} style={{ color: '#10b981' }} />
        <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Transaction sécurisée · Connexion SSL 256 bits · Al Barid Bank</span>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .deposit-input:focus { border-color: #b8963e !important; box-shadow: 0 0 0 3px rgba(184,150,62,0.1); }
        .deposit-input::placeholder { color: #c5bdb5; font-weight: 500; }
      `}</style>
    </div>
  );
}
