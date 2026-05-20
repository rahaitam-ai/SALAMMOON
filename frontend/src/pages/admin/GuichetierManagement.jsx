import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineX, HiOutlinePencilAlt, HiOutlineTrash } from 'react-icons/hi';

export default function GuichetierManagement() {
  const [guichetiers, setGuichetiers] = useState([]);
  const [villes, setVilles] = useState([]);
  const [agences, setAgences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAgences, setLoadingAgences] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedVille, setSelectedVille] = useState('');
  const [editingGuichetier, setEditingGuichetier] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('number'); // number, name, cin

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resGuichetiers = await api.get('/admin/guichetiers');
      const resVilles = await api.get('/admin/guichetiers/villes');
      setGuichetiers(resGuichetiers.data.guichetiers);
      setVilles(resVilles.data.villes || resVilles.data);
    } catch (err) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleVilleChange = async (e) => {
    const ville = e.target.value;
    setSelectedVille(ville);
    // Only reset agence_id if we are changing city (to avoid clearing on edit load)
    if (!editingGuichetier || (editingGuichetier && editingGuichetier.agence?.ville !== ville)) {
        setFormData(prev => ({ ...prev, agence_id: '' }));
    }
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

  const openModal = async (guichetier = null) => {
    setEditingGuichetier(guichetier);
    if (guichetier) {
      setFormData({
        nom: guichetier.nom,
        prenom: guichetier.prenom,
        cin: guichetier.cin,
        agence_id: guichetier.agence_id,
        email: guichetier.email,
        password: '',
        is_active: guichetier.is_active
      });
      setSelectedVille(guichetier.agence?.ville || '');
      if (guichetier.agence?.ville) {
          setLoadingAgences(true);
          try {
            const res = await api.get(`/admin/guichetiers/agences-par-ville/${guichetier.agence.ville}`);
            setAgences(res.data);
          } catch (err) {} finally { setLoadingAgences(false); }
      }
    } else {
      setFormData({
        nom: '',
        prenom: '',
        cin: '',
        agence_id: '',
        email: '',
        password: '',
        is_active: true
      });
      setSelectedVille('');
      setAgences([]);
    }
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGuichetier(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGuichetier) {
        // Create a copy of formData to avoid modifying the state directly
        const dataToSubmit = { ...formData };
        
        // Remove password if it's empty to prevent backend from thinking we're changing it
        if (!dataToSubmit.password || dataToSubmit.password.trim() === '') {
          delete dataToSubmit.password;
        }

        await api.put(`/admin/guichetiers/${editingGuichetier.id}`, dataToSubmit);
        toast.success('Guichetier mis à jour avec succès');
      } else {
        await api.post('/admin/guichetiers', formData);
        toast.success('Guichetier ajouté avec succès');
      }
      fetchData();
      closeModal();
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstErrorKey = Object.keys(err.response.data.errors)[0];
        const errorMessage = err.response.data.errors[firstErrorKey][0];
        toast.error(errorMessage);
      } else {
        toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce guichetier ?')) return;
    try {
      await api.delete(`/admin/guichetiers/${id}`);
      toast.success('Guichetier supprimé');
      fetchData();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredGuichetiers = guichetiers.filter(g => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    if (searchCriteria === 'number') {
      const num = g.numero_guichetier !== undefined && g.numero_guichetier !== null ? g.numero_guichetier : '';
      return num.toString().toLowerCase().includes(query);
    }
    if (searchCriteria === 'name') {
      const nom = g.nom || '';
      const prenom = g.prenom || '';
      const fullName = `${nom} ${prenom}`.toLowerCase();
      const reverseFullName = `${prenom} ${nom}`.toLowerCase();
      return fullName.includes(query) || reverseFullName.includes(query);
    }
    if (searchCriteria === 'cin') {
      const cin = g.cin !== undefined && g.cin !== null ? g.cin : '';
      return cin.toString().toLowerCase().includes(query);
    }
    if (searchCriteria === 'agency') {
      const agenceNom = g.agence?.nom !== undefined && g.agence?.nom !== null ? g.agence?.nom : '';
      const agenceCode = g.agence?.code_agence !== undefined && g.agence?.code_agence !== null ? g.agence?.code_agence : '';
      const fullAgence = `${agenceNom} ${agenceCode}`.toLowerCase();
      return fullAgence.includes(query);
    }
    if (searchCriteria === 'city') {
      const ville = g.agence?.ville !== undefined && g.agence?.ville !== null ? g.agence?.ville : '';
      return ville.toString().toLowerCase().includes(query);
    }
    return true;
  });

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="management-page">
      <div className="dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Gestion des guichetiers</h1>
          <p>Administration et rattachement des agents aux agences</p>
        </div>
        <Link to="/admin/guichetiers/nouveau" className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', textDecoration: 'none' }}>
          <HiOutlinePlus /> Ajouter un guichetier
        </Link>
      </div>

      <div className="card" style={{ border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '1rem', overflow: 'hidden' }}>
        
        {/* Barre de Recherche Multi-critères */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(124, 105, 97, 0.08)', display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#faf9f6', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#5d4e48', fontWeight: 700, fontSize: '0.9rem' }}>
            <span>Rechercher par :</span>
            <select 
              value={searchCriteria} 
              onChange={e => { setSearchCriteria(e.target.value); setSearchQuery(''); }}
              style={{ padding: '0.5rem 1rem', borderRadius: '0.6rem', border: '1px solid rgba(124, 105, 97, 0.15)', outline: 'none', backgroundColor: '#ffffff', color: '#1e1e1e', fontWeight: 600, cursor: 'pointer' }}
            >
              <option value="number">Matricule</option>
              <option value="name">Nom Complet</option>
              <option value="agency">Agence</option>
              <option value="city">Ville</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder={
                searchCriteria === 'number' ? 'Entrez le matricule...' :
                searchCriteria === 'name' ? 'Entrez le nom ou prénom...' :
                searchCriteria === 'agency' ? 'Entrez le nom ou code de l\'agence...' :
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

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Matricule</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>CIN</th>
                <th>Agence rattachée</th>
                <th>Statut</th>
                <th>Date de création</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuichetiers.length > 0 ? (
                filteredGuichetiers.map(g => (
                  <tr key={g.id}>
                    <td><strong>{g.numero_guichetier}</strong></td>
                    <td>{g.nom}</td>
                    <td>{g.prenom}</td>
                    <td><code style={{ background: 'var(--bg-color)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{g.cin}</code></td>
                    <td>{g.agence?.nom} ({g.agence?.code_agence})</td>
                    <td>
                      <span className={`stat-card__badge`} style={{ backgroundColor: g.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: g.is_active ? 'var(--success)' : 'var(--error)' }}>
                        {g.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td>{new Date(g.created_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn" style={{ padding: '0.5rem', color: 'var(--info)', background: 'transparent', boxShadow: 'none' }} onClick={() => openModal(g)} title="Modifier">
                        <HiOutlinePencilAlt size={18} />
                      </button>
                      <button className="btn" style={{ padding: '0.5rem', color: 'var(--error)', background: 'transparent', boxShadow: 'none' }} onClick={() => handleDelete(g.id)} title="Supprimer">
                        <HiOutlineTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-5">
                    {searchQuery ? 'Aucun guichetier ne correspond à votre critère de recherche.' : 'Aucun guichetier trouvé dans le système'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '750px' }}>
            <div className="card__header">
              <h2 className="card__title">{editingGuichetier ? 'Modifier le guichetier' : 'Ajouter un guichetier'}</h2>
              <button className="btn" style={{ background: 'transparent', boxShadow: 'none', padding: '0' }} onClick={closeModal}><HiOutlineX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label>Nom <span style={{color: 'red'}}>*</span></label>
                  <div className="input-wrapper">
                    <input type="text" value={formData.nom} onChange={e => setFormData({ ...formData, nom: e.target.value })} required placeholder="Nom du guichetier" style={{ fontSize: '1.1rem', padding: '0.8rem' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Prénom <span style={{color: 'red'}}>*</span></label>
                  <div className="input-wrapper">
                    <input type="text" value={formData.prenom} onChange={e => setFormData({ ...formData, prenom: e.target.value })} required placeholder="Prénom du guichetier" style={{ fontSize: '1.1rem', padding: '0.8rem' }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label>CIN <span style={{color: 'red'}}>*</span></label>
                  <div className="input-wrapper">
                    <input type="text" value={formData.cin} onChange={e => setFormData({ ...formData, cin: e.target.value })} required placeholder="Ex: AB123456" style={{ fontSize: '1.1rem', padding: '0.8rem' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email de connexion <span style={{color: 'red'}}>*</span></label>
                  <div className="input-wrapper">
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="Ex: jean.dupont@baridbank.ma" style={{ fontSize: '1.1rem', padding: '0.8rem' }} />
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label>{editingGuichetier ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'} <span style={{color: 'red'}}>{!editingGuichetier && '*'}</span></label>
                <div className="input-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={formData.password} 
                    onChange={e => setFormData({ ...formData, password: e.target.value })} 
                    required={!editingGuichetier}
                    placeholder={editingGuichetier ? "Laisser vide pour ne pas changer" : "Min 8 caractères (Maj, Min, Chiffre)"} 
                    style={{ flex: 1, fontSize: '1.1rem', padding: '0.8rem' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 10px', color: 'var(--text-secondary)' }}
                  >
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
                {!editingGuichetier && (
                  <small className="text-muted" style={{ display: 'block', marginTop: '0.5rem' }}>Le guichetier devra obligatoirement changer ce mot de passe à sa première connexion.</small>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="form-group">
                  <label>Ville <span style={{color: 'red'}}>*</span></label>
                  <div className="input-wrapper">
                    <select 
                      value={selectedVille} 
                      onChange={handleVilleChange} 
                      required 
                      style={{ width: '100%', padding: '0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontSize: '1.1rem' }}
                    >
                      <option value="">-- Choisir une ville --</option>
                      {villes.map(ville => (
                        <option key={ville} value={ville}>{ville}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Agence <span style={{color: 'red'}}>*</span></label>
                  <div className="input-wrapper">
                    <select 
                      value={formData.agence_id} 
                      onChange={e => setFormData({ ...formData, agence_id: e.target.value })} 
                      required 
                      disabled={!selectedVille || loadingAgences}
                      style={{ 
                        width: '100%', 
                        padding: '0.8rem', 
                        borderRadius: '0.5rem', 
                        border: '1px solid var(--border-color)', 
                        backgroundColor: !selectedVille ? 'var(--border-color)' : 'var(--bg-color)', 
                        color: 'var(--text-primary)',
                        cursor: !selectedVille ? 'not-allowed' : 'pointer',
                        fontSize: '1.1rem'
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
              </div>

              {editingGuichetier && (
                <div className="form-group" style={{ marginTop: '1rem' }}>
                  <label className="checkbox-container" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.is_active} 
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>Compte Actif (Décocher pour désactiver l'accès)</span>
                  </label>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button type="button" className="btn order-2 sm:order-1 flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-semibold" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary order-1 sm:order-2 flex-1 py-3 rounded-xl font-semibold shadow-lg shadow-orange-200">
                  {editingGuichetier ? 'Enregistrer' : 'Ajouter le guichetier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
