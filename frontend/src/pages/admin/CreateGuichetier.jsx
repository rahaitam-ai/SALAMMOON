import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineIdentification, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

export default function CreateGuichetier() {
  const [villes, setVilles] = useState([]);
  const [agences, setAgences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAgences, setLoadingAgences] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedVille, setSelectedVille] = useState('');
  const [nextMatricule, setNextMatricule] = useState(5001);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    agence_id: '',
    email: '',
    password: '',
    is_active: true
  });

  useEffect(() => {
    fetchVilles();
  }, []);

  const generateEmail = (nom, prenom, matricule) => {
    if (!nom || !prenom || !matricule) return '';
    
    // Normalize and remove accents/special characters
    const cleanNom = nom
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
      
    const cleanPrenom = prenom
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');
      
    return `${cleanNom}${cleanPrenom}.guichetier${matricule}@gmail.com`;
  };

  useEffect(() => {
    const emailGenerated = generateEmail(formData.nom, formData.prenom, nextMatricule);
    setFormData(prev => ({ ...prev, email: emailGenerated }));
  }, [formData.nom, formData.prenom, nextMatricule]);

  const fetchVilles = async () => {
    try {
      const resVilles = await api.get('/admin/guichetiers/villes');
      setVilles(resVilles.data.villes || []);
      setNextMatricule(resVilles.data.next_matricule || 5001);
    } catch (err) {
      toast.error('Erreur lors du chargement des villes');
    } finally {
      setLoading(false);
    }
  };

  const handleVilleChange = async (e) => {
    const ville = e.target.value;
    setSelectedVille(ville);
    setFormData(prev => ({ ...prev, agence_id: '' }));
    setAgences([]);
    
    if (ville) {
      setLoadingAgences(true);
      try {
        const res = await api.get(`/admin/guichetiers/agences-par-ville/${ville}`);
        setAgences(res.data);
      } catch (err) {
        toast.error('Erreur lors du chargement des agences');
      } finally {
        setLoadingAgences(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom || !formData.cin || !formData.email || !formData.password || !formData.agence_id) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await api.post('/admin/guichetiers', formData);
      toast.success('Guichetier créé avec succès');
      navigate('/admin/guichetiers');
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        const errorMessage = err.response.data.errors[firstErrorKey][0];
        toast.error(errorMessage);
      } else {
        toast.error(err.response?.data?.message || 'Erreur lors de la création');
      }
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="management-page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Return header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem', transition: 'color 0.2s' }}>
          <HiOutlineArrowLeft size={16} /> Retour au tableau de bord
        </Link>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Ajouter un guichetier</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Administration et rattachement des agents aux agences physiques</p>
      </div>

      <div className="card" style={{ border: 'none', boxShadow: '0 20px 40px rgba(124, 105, 97, 0.05)', borderRadius: '1.5rem', background: '#ffffff', padding: '3rem 3.5rem' }}>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Nom <span style={{color: '#d4a017'}}>*</span></label>
              <input 
                type="text" 
                className="form-control"
                value={formData.nom} 
                onChange={e => setFormData({ ...formData, nom: e.target.value })} 
                required 
                placeholder="Nom du guichetier" 
                style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
              />
            </div>
            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Prénom <span style={{color: '#d4a017'}}>*</span></label>
              <input 
                type="text" 
                className="form-control"
                value={formData.prenom} 
                onChange={e => setFormData({ ...formData, prenom: e.target.value })} 
                required 
                placeholder="Prénom du guichetier" 
                style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>CIN <span style={{color: '#d4a017'}}>*</span></label>
              <div style={{ position: 'relative' }}>
                <HiOutlineIdentification size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#9a847a' }} />
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.cin} 
                  onChange={e => setFormData({ ...formData, cin: e.target.value })} 
                  required 
                  placeholder="Ex: AB123456" 
                  style={{ padding: '0.9rem 1.2rem 0.9rem 3.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Email de connexion (Généré automatiquement)</label>
              <div style={{ 
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: formData.email ? 'scale(1.005)' : 'scale(1)'
              }}>
                <HiOutlineMail size={20} style={{ 
                  position: 'absolute', 
                  left: '1.2rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: formData.email ? '#d4a017' : '#9a847a', 
                  transition: 'color 0.3s ease' 
                }} />
                <input 
                  type="email" 
                  className="form-control"
                  value={formData.email} 
                  readOnly
                  required 
                  placeholder="nomprenom.guichetier(matricule)@gmail.com" 
                  style={{ 
                    padding: '0.9rem 1.2rem 0.9rem 3.2rem', 
                    borderRadius: '0.8rem', 
                    border: formData.email ? '1px solid rgba(212, 160, 23, 0.35)' : '1px solid rgba(124, 105, 97, 0.15)', 
                    fontSize: '0.95rem', 
                    width: '100%', 
                    backgroundColor: formData.email ? 'rgba(212, 160, 23, 0.03)' : '#f5f1ec', 
                    color: formData.email ? '#7c6961' : '#9a847a',
                    fontWeight: formData.email ? 600 : 400,
                    cursor: 'not-allowed', 
                    outline: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: formData.email ? '0 4px 15px rgba(212, 160, 23, 0.05)' : 'none'
                  }}
                />
              </div>
              <small style={{ 
                color: '#9a847a', 
                marginTop: '0.5rem', 
                display: 'block', 
                fontSize: '0.8rem', 
                transition: 'opacity 0.3s ease', 
                opacity: formData.email ? 1 : 0.7 
              }}>
                {formData.email ? '✓ Email professionnel généré en temps réel.' : 'Saisissez le Nom & Prénom pour générer l\'adresse email.'}
              </small>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Mot de passe <span style={{color: '#d4a017'}}>*</span></label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <HiOutlineLockClosed size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#9a847a' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control"
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  required 
                  placeholder="Min 8 caractères (Maj, Min, Chiffre)" 
                  autoComplete="new-password"
                  style={{ padding: '0.9rem 4.5rem 0.9rem 3.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  style={{ position: 'absolute', right: '1.2rem', background: 'transparent', border: 'none', cursor: 'pointer', color: '#7c6961', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Valider le mot de passe <span style={{color: '#d4a017'}}>*</span></label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <HiOutlineLockClosed size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#9a847a' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control"
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="Ressaisir le mot de passe" 
                  autoComplete="new-password"
                  style={{ padding: '0.9rem 1.2rem 0.9rem 3.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>
            </div>
          </div>
          <small style={{ color: '#9a847a', marginTop: '-0.75rem', marginBottom: '1.5rem', display: 'block', fontSize: '0.8rem' }}>Le guichetier devra obligatoirement changer ce mot de passe à sa première connexion.</small>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Ville <span style={{color: '#d4a017'}}>*</span></label>
              <select 
                value={selectedVille} 
                onChange={handleVilleChange} 
                required 
                style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', backgroundColor: '#ffffff', color: '#1e1e1e', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}
              >
                <option value="">-- Choisir une ville --</option>
                {villes.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Agence <span style={{color: '#d4a017'}}>*</span></label>
              <select 
                value={formData.agence_id} 
                onChange={e => setFormData({ ...formData, agence_id: e.target.value })} 
                required 
                disabled={!selectedVille || loadingAgences}
                style={{ 
                  width: '100%', 
                  padding: '0.9rem 1.2rem', 
                  borderRadius: '0.8rem', 
                  border: '1px solid rgba(124, 105, 97, 0.15)', 
                  backgroundColor: !selectedVille ? '#faf9f6' : '#ffffff', 
                  color: '#1e1e1e',
                  cursor: !selectedVille ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              >
                <option value="">{loadingAgences ? 'Chargement...' : '-- Sélectionner une agence --'}</option>
                {agences.map(agence => (
                  <option key={agence.id} value={agence.id}>
                    {agence.nom} ({agence.code_agence})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end' }}>
            <Link to="/admin" style={{ padding: '1rem 2rem', borderRadius: '1rem', background: '#faf9f6', border: '1px solid rgba(124, 105, 97, 0.15)', color: '#5d4e48', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              Annuler
            </Link>
            <button type="submit" className="btn btn--primary" style={{ padding: '1rem 2.5rem', borderRadius: '1rem', border: 'none', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(212, 160, 23, 0.25)', cursor: 'pointer' }}>
              Ajouter le guichetier
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-control:focus {
          border-color: #d4a017 !important;
          box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
