import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { 
  HiOutlineEye,
  HiOutlineDownload
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function ConsulterAgences() {
  const navigate = useNavigate();
  const [agences, setAgences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('code'); // code, name, city

  useEffect(() => {
    fetchAgences();
  }, []);

  const fetchAgences = async () => {
    try {
      setLoading(true);
      const res = await api.get('/siege/agences');
      setAgences(res.data.agences || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des agences');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgences = agences.filter(a => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    if (searchCriteria === 'code') {
      const code = a.code_agence !== undefined && a.code_agence !== null ? a.code_agence : '';
      return code.toString().toLowerCase().includes(query);
    }
    if (searchCriteria === 'name') {
      const nom = a.nom || '';
      return nom.toLowerCase().includes(query);
    }
    if (searchCriteria === 'city') {
      const ville = a.ville || '';
      return ville.toLowerCase().includes(query);
    }
    return true;
  });

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
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Consulter les agences</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Supervision du réseau d'agences physiques</p>
        </div>
        <button
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', textDecoration: 'none', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b', fontWeight: 600, borderRadius: '0.5rem', cursor: 'pointer' }}
          onClick={() => toast.success('Exportation en cours...')}
        >
          <HiOutlineDownload size={20} /> EXPORTER LES DONNÉES
        </button>
      </div>

      {/* TABLE AND FILTER CARD CONTAINER */}
      <div className="card" style={{ border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '1rem', overflow: 'hidden', padding: 0 }}>
        
        {/* Barre de Recherche Multi-critères */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(124, 105, 97, 0.08)', display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#faf9f6', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5d4e48', fontWeight: 700, fontSize: '0.9rem' }}>
            <span>Rechercher par :</span>
            <select
              value={searchCriteria}
              onChange={e => { setSearchCriteria(e.target.value); setSearchQuery(''); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.6rem', border: '1px solid rgba(124, 105, 97, 0.15)', outline: 'none', backgroundColor: '#ffffff', color: '#1e1e1e', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="code">Code Agence</option>
              <option value="name">Nom de l'Agence</option>
              <option value="city">Ville</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <input
              type="text"
              placeholder={
                searchCriteria === 'code' ? 'Entrez le code agence...' :
                searchCriteria === 'name' ? 'Entrez le nom de l\'agence...' :
                'Entrez le nom de la ville...'
              }
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#9a847a', cursor: 'pointer', fontWeight: 700 }}
              >
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Table Responsive wrapper */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Code Agence</th>
                <th>Nom de l'Agence</th>
                <th>Ville</th>
                <th>Région</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgences.length > 0 ? (
                filteredAgences.map(a => (
                  <tr key={a.id}>
                    {/* Code Agence */}
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>{a.code_agence}</strong>
                    </td>
                    
                    {/* Nom de l'Agence */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{a.nom}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: #{a.id}</span>
                      </div>
                    </td>

                    {/* Ville */}
                    <td>{a.ville}</td>

                    {/* Région */}
                    <td>
                      <code style={{ background: 'var(--bg-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--primary)' }}>
                        {a.region || 'N/A'}
                      </code>
                    </td>

                    {/* Statut */}
                    <td>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '0.3rem 0.7rem', borderRadius: '2rem',
                        fontSize: '0.8rem', fontWeight: 700,
                        backgroundColor: a.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                        color: a.is_active ? '#10b981' : '#ef4444'
                      }}>
                        {a.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>

                    {/* Voir plus column with a beautiful golden button */}
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => navigate(`/siege/agence/${a.id}`)}
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
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(250, 211, 31, 0.2)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.95)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
                      >
                        <HiOutlineEye size={15} /> Voir plus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    {searchQuery ? 'Aucune agence ne correspond à votre critère de recherche.' : 'Aucune agence trouvée dans le système.'}
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
