import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  HiOutlinePlus, 
  HiOutlinePencil, 
  HiOutlineTrash, 
  HiOutlineLibrary 
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function AccountTypeManagement() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await api.get('/siege/account-types');
      setTypes(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des types de comptes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce type de compte ?')) return;
    try {
      await api.delete(`/siege/account-types/${id}`);
      toast.success('Type de compte supprimé avec succès');
      fetchTypes();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
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
    <div className="management-page">
      
      {/* HEADER SECTION */}
      <div className="dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Types de Comptes</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gérer les différents types de comptes bancaires disponibles</p>
        </div>
        
        <Link 
          to="/siege/account-types/nouveau"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.8rem 1.5rem', 
            fontSize: '0.9rem', 
            fontWeight: 700, 
            borderRadius: '0.5rem', 
            backgroundColor: 'var(--primary)', 
            color: '#1e1e1e', 
            border: 'none',
            textDecoration: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(250, 211, 31, 0.2)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.95)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
        >
          <HiOutlinePlus size={18} /> Ajouter un Type de Compte
        </Link>
      </div>

      {/* TABLE AND CARD CONTAINER */}
      <div className="card" style={{ border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '1rem', overflow: 'hidden', padding: 0 }}>
        
        {/* Table Responsive wrapper */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Type de Compte</th>
                <th>Description</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {types.length > 0 ? (
                types.map((type) => (
                  <tr key={type.id}>
                    {/* Type de Compte */}
                    <td>
                      <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{type.name}</strong>
                    </td>
                    
                    {/* Description */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {type.description || 'Aucune description fournie'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: #{type.id}</span>
                      </div>
                    </td>

                    {/* Statut */}
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '0.3rem 0.7rem', borderRadius: '2rem',
                        fontSize: '0.8rem', fontWeight: 700,
                        backgroundColor: type.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: type.is_active ? '#10b981' : '#ef4444'
                      }}>
                        {type.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <Link 
                          to={`/siege/account-types/modifier/${type.id}`} 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: '0.5rem',
                            backgroundColor: 'var(--primary)',
                            color: '#1e1e1e',
                            border: 'none',
                            textDecoration: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(250, 211, 31, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.95)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
                        >
                          <HiOutlinePencil size={15} /> Modifier
                        </Link>

                        <button 
                          onClick={() => handleDelete(type.id)} 
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            borderRadius: '0.5rem',
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(239, 68, 68, 0.2)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.95)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                          onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
                        >
                          <HiOutlineTrash size={15} /> Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-5" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Aucun type de compte trouvé dans le système.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .table tbody tr:nth-child(even) td {
          background-color: #ffffff !important;
        }
        .table tbody tr:nth-child(odd) td {
          background-color: #f3f6f9 !important;
        }
      `}</style>
    </div>
  );
}
