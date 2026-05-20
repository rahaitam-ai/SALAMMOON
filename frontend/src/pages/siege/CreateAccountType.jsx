import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import { HiOutlineArrowLeft, HiOutlineLibrary, HiOutlineCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function CreateAccountType() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true
  });

  useEffect(() => {
    if (isEdit) {
      fetchAccountType();
    }
  }, [id]);

  const fetchAccountType = async () => {
    try {
      const res = await api.get(`/siege/account-types`);
      const currentType = res.data.find(t => t.id === parseInt(id));
      if (currentType) {
        setFormData({
          name: currentType.name,
          description: currentType.description || '',
          is_active: currentType.is_active
        });
      } else {
        toast.error('Type de compte non trouvé');
        navigate('/siege/account-types');
      }
    } catch (err) {
      toast.error('Erreur lors du chargement des données');
      navigate('/siege/account-types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/siege/account-types/${id}`, formData);
        toast.success('Type de compte mis à jour avec succès');
      } else {
        await api.post('/siege/account-types', formData);
        toast.success('Nouveau type de compte créé avec succès');
      }
      navigate('/siege/account-types');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="management-page" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Return header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/siege/account-types" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', marginBottom: '1rem', transition: 'color 0.2s' }}>
          <HiOutlineArrowLeft size={16} /> Retour à la liste
        </Link>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {isEdit ? 'Modifier le type de compte' : 'Ajouter un type de compte'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          {isEdit ? 'Mettez à jour les informations et règles de déploiement de ce produit.' : 'Configurez un nouveau produit de compte bancaire pour l\'ensemble du réseau national.'}
        </p>
      </div>

      {/* FORM CARD */}
      <div className="card" style={{ border: 'none', boxShadow: '0 20px 40px rgba(124, 105, 97, 0.05)', borderRadius: '1.5rem', background: '#ffffff', padding: '3rem 3.5rem' }}>
        <form onSubmit={handleSubmit}>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
              Dénomination du produit <span style={{ color: '#d4a017' }}>*</span>
            </label>
            <input 
              type="text" 
              className="form-control"
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Ex: Compte Épargne Premium..."
              style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
            />
          </div>



          {/* Form Actions Footer */}
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(124, 105, 97, 0.08)', paddingTop: '2rem' }}>
            <Link 
              to="/siege/account-types" 
              style={{ 
                padding: '1rem 2rem', 
                borderRadius: '1rem', 
                background: '#faf9f6', 
                border: '1px solid rgba(124, 105, 97, 0.15)', 
                color: '#5d4e48', 
                textDecoration: 'none', 
                fontWeight: 700, 
                fontSize: '0.95rem', 
                transition: 'all 0.2s', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              Annuler
            </Link>
            <button 
              type="submit" 
              disabled={saving}
              className="btn btn--primary" 
              style={{ 
                padding: '1rem 2.5rem', 
                borderRadius: '1rem', 
                border: 'none', 
                fontWeight: 700, 
                fontSize: '0.95rem', 
                boxShadow: '0 8px 24px rgba(212, 160, 23, 0.25)', 
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {saving && <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px', borderTopColor: 'transparent', margin: 0 }}></div>}
              {isEdit ? 'Enregistrer les modifications' : 'Créer le type de compte'}
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
