import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { 
  HiOutlinePlus, 
  HiOutlinePencilAlt, 
  HiOutlineTrash, 
  HiOutlineX, 
  HiOutlineEye 
} from 'react-icons/hi';

const REGIONS_VILLES = {
  "Casablanca-Settat": ["Casablanca", "Mohammédia", "El Jadida", "Settat", "Berrechid", "Benslimane"],
  "Rabat-Salé-Kénitra": ["Rabat", "Salé", "Kénitra", "Skhirat", "Témara"],
  "Marrakech-Safi": ["Marrakech", "Safi", "Essaouira", "Youssoufia"],
  "Fès-Meknès": ["Fès", "Meknès", "Ifrane", "Sefrou", "Taza"],
  "Tanger-Tétouan-Al Hoceïma": ["Tanger", "Tétouan", "Al Hoceïma", "Larache", "Chefchaouen"],
  "Souss-Massa": ["Agadir", "Taroudant", "Tiznit"],
  "Oriental": ["Oujda", "Nador", "Berkane"],
  "Béni Mellal-Khénifra": ["Béni Mellal", "Khénifra", "Azilal"],
  "Drâa-Tafilalet": ["Errachidia", "Ouarzazate", "Zagora"],
  "Laâyoune-Sakia El Hamra": ["Laâyoune", "Boujdour"],
  "Dakhla-Oued Ed-Dahab": ["Dakhla"],
  "Guelmim-Oued Noun": ["Guelmim", "Sidi Ifni"]
};

const VILLE_CODES = {
  "Casablanca": "200",
  "Mohammédia": "201",
  "El Jadida": "202",
  "Settat": "203",
  "Rabat": "204",
  "Salé": "205",
  "Marrakech": "206",
  "Fès": "207",
  "Tanger": "208",
  "Agadir": "209",
  "Berrechid": "210",
  "Benslimane": "211",
  "Kénitra": "212",
  "Skhirat": "213",
  "Témara": "214",
  "Safi": "215",
  "Essaouira": "216",
  "Youssoufia": "217",
  "Meknès": "218",
  "Ifrane": "219",
  "Sefrou": "220",
  "Taza": "221",
  "Tétouan": "222",
  "Al Hoceïma": "223",
  "Larache": "224",
  "Chefchaouen": "225",
  "Taroudant": "226",
  "Tiznit": "227",
  "Oujda": "228",
  "Nador": "229",
  "Berkane": "230",
  "Béni Mellal": "231",
  "Khénifra": "232",
  "Azilal": "233",
  "Errachidia": "234",
  "Ouarzazate": "235",
  "Zagora": "236",
  "Laâyoune": "237",
  "Boujdour": "238",
  "Dakhla": "239",
  "Guelmim": "240",
  "Sidi Ifni": "241"
};

export default function AgencesPhysiquesManagement() {
  const [agences, setAgences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgence, setEditingAgence] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('code'); // code, name, city
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    code_ville: '',
    region: '',
    code_agence: ''
  });

  useEffect(() => {
    fetchAgences();
  }, []);

  useEffect(() => {
    const code = formData.ville ? (VILLE_CODES[formData.ville] || '') : '';
    setFormData(prev => ({ ...prev, code_ville: code }));
  }, [formData.ville]);

  const fetchAgences = async () => {
    try {
      const res = await api.get('/admin/agences-physiques');
      setAgences(res.data.agences);
    } catch (err) {
      toast.error('Erreur lors du chargement des agences');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (agence = null) => {
    setEditingAgence(agence);
    
    let nextCode = '001';
    if (!agence) {
      if (agences.length > 0) {
        const codes = agences
          .map(a => parseInt(a.code_agence))
          .filter(n => !isNaN(n));
        const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
        nextCode = formatCode(maxCode + 1);
      }
    }

    setFormData({
      nom: agence ? agence.nom : '',
      ville: agence ? agence.ville : '',
      code_ville: agence ? (agence.code_ville || '') : '',
      region: agence ? (agence.region || '') : '',
      code_agence: agence ? agence.code_agence : nextCode,
    });
    setShowModal(true);
  };

  const formatCode = (val) => {
    if (!val) return '';
    return val.toString().padStart(3, '0').slice(-3);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAgence(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgence) {
        await api.put(`/admin/agences-physiques/${editingAgence.id}`, formData);
        toast.success('Agence mise à jour avec succès');
      } else {
        await api.post('/admin/agences-physiques', formData);
        toast.success('Agence créée avec succès');
      }
      fetchAgences();
      closeModal();
    } catch (err) {
      if (err.response?.data?.errors?.code_agence) {
        toast.error(err.response.data.errors.code_agence[0]);
      } else {
        toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette agence ?')) return;
    try {
      await api.delete(`/admin/agences-physiques/${id}`);
      toast.success('Agence supprimée');
      fetchAgences();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
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
      
      {/* HEADER SECTION (Matches exactly the SiegeManagement header) */}
      <div className="dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Gestion des agences physiques</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Supervision administrative du réseau d'agences physiques</p>
        </div>
        <button
          onClick={() => navigate('/admin/agences-physiques/add')}
          className="btn btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', textDecoration: 'none' }}
        >
          <HiOutlinePlus size={20} /> AJOUTER AGENCE
        </button>
      </div>

      {/* TABLE AND FILTER CARD CONTAINER (Matches exactly the card wrapper style from your screenshot) */}
      <div className="card" style={{ border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
        
        {/* Barre de Recherche Multi-critères (Identical to your screenshot) */}
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
                <th>Détails</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgences.length > 0 ? (
                filteredAgences.map(a => (
                  <tr key={a.id}>
                    {/* Code Agence - styled in gold just like "Matricule" in your screenshot */}
                    <td>
                      <strong style={{ color: 'var(--primary)' }}>{a.code_agence}</strong>
                    </td>
                    
                    {/* Nom de l'Agence - bold with ID subtext exactly like "Nom Complet" in your screenshot */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{a.nom}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: #{a.id}</span>
                      </div>
                    </td>

                    {/* Ville */}
                    <td>{a.ville}</td>

                    {/* Région - styled as code block like "CIN" in your screenshot */}
                    <td>
                      <code style={{ background: 'var(--bg-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--primary)' }}>
                        {a.region || 'N/A'}
                      </code>
                    </td>

                    {/* Voir plus column with a beautiful golden button */}
                    <td>
                      <button 
                        onClick={() => navigate(`/admin/agence/${a.id}`)}
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

                    {/* Actions - clean simple icons placed side by side with zero background wrapper */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button 
                          className="btn" 
                          style={{ padding: '0.5rem', color: 'var(--info)', background: 'transparent', boxShadow: 'none' }} 
                          onClick={() => navigate(`/admin/agences-physiques/edit/${a.id}`)} 
                          title="Modifier"
                        >
                          <HiOutlinePencilAlt size={20} />
                        </button>
                        <button 
                          className="btn" 
                          style={{ padding: '0.5rem', color: 'var(--error)', background: 'transparent', boxShadow: 'none' }} 
                          onClick={() => handleDelete(a.id)} 
                          title="Supprimer"
                        >
                          <HiOutlineTrash size={20} />
                        </button>
                      </div>
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
        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
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
