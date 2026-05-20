import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlineMail, HiOutlineIdentification, HiOutlineLockClosed } from 'react-icons/hi';

export default function CreateSiegeMember() {
  const [nextId, setNextId] = useState(1);
  const [nextMatricule, setNextMatricule] = useState(1001);
  const [loading, setLoading] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    email: '',
    password: '',
    phone: '',
  });

  useEffect(() => {
    fetchNextId();
  }, []);

  const fetchNextId = async () => {
    try {
      const res = await api.get('/admin/sieges');
      setNextId(res.data.next_id);
      setNextMatricule(res.data.next_matricule || 1001);
    } catch (err) {
      toast.error('Erreur lors du chargement des informations d\'initialisation');
    } finally {
      setLoading(false);
    }
  };

  const generateEmail = (nom, prenom, id) => {
    if (!nom && !prenom) return '';
    const cleanNom = nom.trim().toLowerCase().replace(/\s+/g, '');
    const cleanPrenom = prenom.trim().toLowerCase().replace(/\s+/g, '');
    return `${cleanPrenom}${cleanNom}.siege${id}@gmail.com`;
  };

  const handleNameChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    newFormData.email = generateEmail(
      field === 'nom' ? value : formData.nom,
      field === 'prenom' ? value : formData.prenom,
      nextId
    );
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom || !formData.cin) {
      toast.error('Veuillez remplir les champs obligatoires');
      return;
    }

    if (formData.password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await api.post('/admin/sieges', formData);
      toast.success('Membre du siège créé avec succès');
      navigate('/admin/sieges');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
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
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Ajouter un membre du siège</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Création d'un nouvel identifiant d'accès pour le personnel central</p>
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
                onChange={e => handleNameChange('nom', e.target.value)} 
                required 
                placeholder="ex: Haitam" 
                style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
              />
            </div>
            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Prénom <span style={{color: '#d4a017'}}>*</span></label>
              <input 
                type="text" 
                className="form-control"
                value={formData.prenom} 
                onChange={e => handleNameChange('prenom', e.target.value)} 
                required 
                placeholder="ex: Ragouby" 
                style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Numéro CIN <span style={{color: '#d4a017'}}>*</span></label>
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

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Email Professionnel (Généré automatiquement)</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineMail size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#9a847a' }} />
              <input 
                type="email" 
                className="form-control"
                value={formData.email} 
                readOnly 
                placeholder="prenomnom.siegeID@gmail.com" 
                style={{ padding: '0.9rem 1.2rem 0.9rem 3.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', backgroundColor: '#f5f1ec', cursor: 'not-allowed', color: '#7c6961', fontWeight: 600 }}
              />
            </div>
            <small style={{ color: '#9a847a', marginTop: '0.5rem', display: 'block', fontSize: '0.8rem' }}>Ce champ est généré dynamiquement et n'est pas modifiable.</small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
                Mot de passe <span style={{color: '#d4a017'}}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <HiOutlineLockClosed size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#9a847a' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control"
                  value={formData.password} 
                  onChange={e => setFormData({ ...formData, password: e.target.value })} 
                  required 
                  placeholder="Min 8 caractères"
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
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
                Valider le mot de passe <span style={{color: '#d4a017'}}>*</span>
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <HiOutlineLockClosed size={20} style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#9a847a' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="form-control"
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="Ressaisir le mot de passe"
                  style={{ padding: '0.9rem 1.2rem 0.9rem 3.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }} 
                />
              </div>
            </div>
          </div>
          <small style={{ color: '#9a847a', marginTop: '-0.75rem', marginBottom: '1.5rem', display: 'block', fontSize: '0.8rem' }}>L'utilisateur devra changer son mot de passe lors de sa toute première connexion.</small>

          <div className="form-group" style={{ marginBottom: '2.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>Téléphone</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.phone} 
              onChange={e => setFormData({ ...formData, phone: e.target.value })} 
              placeholder="Ex: +212 600000000" 
              style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end' }}>
            <Link to="/admin" style={{ padding: '1rem 2rem', borderRadius: '1rem', background: '#faf9f6', border: '1px solid rgba(124, 105, 97, 0.15)', color: '#5d4e48', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', transition: 'all 0.2s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              Annuler
            </Link>
            <button type="submit" className="btn btn--primary" style={{ padding: '1rem 2.5rem', borderRadius: '1rem', border: 'none', fontWeight: 700, fontSize: '0.95rem', boxShadow: '0 8px 24px rgba(212, 160, 23, 0.25)', cursor: 'pointer' }}>
              Créer le compte membre
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
