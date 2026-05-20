import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineX, HiOutlineMail, HiOutlineIdentification } from 'react-icons/hi';

export default function SiegeManagement() {
  const [sieges, setSieges] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSiege, setEditingSiege] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCriteria, setSearchCriteria] = useState('name'); // name, matricule

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cin: '',
    email: '',
    password: '',
    phone: '',
  });

  const location = useLocation();

  useEffect(() => {
    fetchData();
    if (location.state?.openCreateModal) {
      openModal();
      // Nettoyer l'état de l'historique pour éviter que le modal s'ouvre à nouveau après un refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/sieges');
      setSieges(res.data.sieges);
      setNextId(res.data.next_id);
    } catch (err) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Automatic email generation logic
  const generateEmail = (nom, prenom, id) => {
    if (!nom && !prenom) return '';
    const cleanNom = nom.trim().toLowerCase().replace(/\s+/g, '');
    const cleanPrenom = prenom.trim().toLowerCase().replace(/\s+/g, '');
    return `${cleanPrenom}${cleanNom}.siege${id}@gmail.com`;
  };

  const handleNameChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    
    // Only auto-generate if we are creating a new member OR if the email was already an auto-generated one
    if (!editingSiege) {
        newFormData.email = generateEmail(
            field === 'nom' ? value : formData.nom,
            field === 'prenom' ? value : formData.prenom,
            nextId
        );
    }
    
    setFormData(newFormData);
  };

  const openModal = (siege = null) => {
    setEditingSiege(siege);
    if (siege) {
      setFormData({
        nom: siege.nom || '',
        prenom: siege.prenom || '',
        cin: siege.cin || '',
        email: siege.email || '',
        password: '',
        phone: siege.phone || '',
      });
    } else {
      setFormData({
        nom: '',
        prenom: '',
        cin: '',
        email: '',
        password: generatePassword(),
        phone: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingSiege(null);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSiege) {
        await api.put(`/admin/sieges/${editingSiege.id}`, formData);
        toast.success('Membre mis à jour avec succès');
      } else {
        await api.post('/admin/sieges', formData);
        toast.success('Membre créé avec succès');
      }
      fetchData();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce membre ?')) return;
    try {
      await api.delete(`/admin/sieges/${id}`);
      toast.success('Membre supprimé');
      fetchData();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredSieges = sieges.filter(s => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    if (searchCriteria === 'name') {
      const nom = s.nom || '';
      const prenom = s.prenom || '';
      const fullName = `${nom} ${prenom}`.toLowerCase();
      const reverseFullName = `${prenom} ${nom}`.toLowerCase();
      return fullName.includes(query) || reverseFullName.includes(query);
    }
    if (searchCriteria === 'matricule') {
      const matricule = s.matricule !== undefined && s.matricule !== null ? s.matricule : '';
      return matricule.toString().toLowerCase().includes(query);
    }
    return true;
  });

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="management-page">
      <div className="dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Gestion des membres du siège</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Gestion administrative du personnel central</p>
        </div>
        <Link to="/admin/sieges/nouveau" className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', textDecoration: 'none' }}>
          <HiOutlinePlus size={20} /> AJOUTER SIEGE
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
              <option value="name">Nom Complet</option>
              <option value="matricule">Matricule</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <input 
              type="text" 
              placeholder={
                searchCriteria === 'name' ? 'Entrez le nom ou prénom...' :
                'Entrez le matricule...'
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
                <th>Nom Complet</th>
                <th>CIN</th>
                <th>Email Professionnel</th>
                <th>Téléphone</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSieges.length > 0 ? (
                filteredSieges.map(s => (
                  <tr key={s.id}>
                    <td><strong style={{ color: 'var(--primary)' }}>{s.matricule || `S${s.id}`}</strong></td>
                    <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{s.nom} {s.prenom}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: #{s.id}</span>
                        </div>
                    </td>
                    <td><code style={{ background: 'var(--bg-light)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: 'var(--primary)' }}>{s.cin || 'N/A'}</code></td>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <HiOutlineMail className="text-muted" />
                            <span>{s.email}</span>
                        </div>
                    </td>
                    <td>{s.phone || '-'}</td>
                    <td>
                      <span className={`stat-card__badge`} style={{ 
                        backgroundColor: s.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
                        color: s.is_active ? '#10b981' : '#ef4444',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '2rem',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        {s.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn" style={{ padding: '0.5rem', color: 'var(--info)', background: 'transparent' }} onClick={() => openModal(s)}>
                        <HiOutlinePencilAlt size={20} />
                      </button>
                      <button className="btn" style={{ padding: '0.5rem', color: 'var(--error)', background: 'transparent' }} onClick={() => handleDelete(s.id)}>
                        <HiOutlineTrash size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-5">
                    {searchQuery ? 'Aucun membre ne correspond à votre critère de recherche.' : 'Aucun membre trouvé dans le système'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '800px', width: '95%', borderRadius: '1.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.18)' }}>
            <div className="card__header" style={{ padding: '1.5rem 2.5rem', borderBottom: '1px solid rgba(124, 105, 97, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="card__title" style={{ margin: 0, fontSize: '1.5rem' }}>{editingSiege ? 'Modifier le membre' : 'Ajouter un membre'}</h2>
              <button className="btn" onClick={closeModal} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><HiOutlineX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '2rem 2.5rem' }}>
              {!editingSiege && (
                <div style={{ marginBottom: '1.5rem', background: 'var(--primary-light)', padding: '1rem', borderRadius: '0.8rem', border: '1px solid var(--primary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'white', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{nextId}</div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Prochain ID Utilisateur</p>
                        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>L'email sera généré en utilisant cet identifiant.</p>
                    </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Nom <span style={{color: 'red'}}>*</span></label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.nom} 
                    onChange={e => handleNameChange('nom', e.target.value)} 
                    required 
                    placeholder="ex: Haitam" 
                    style={{ padding: '0.8rem', borderRadius: '0.6rem' }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Prénom <span style={{color: 'red'}}>*</span></label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.prenom} 
                    onChange={e => handleNameChange('prenom', e.target.value)} 
                    required 
                    placeholder="ex: Ragouby" 
                    style={{ padding: '0.8rem', borderRadius: '0.6rem' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ marginTop: '1.5rem' }}>
                <div className="form-group">
                  <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Numéro CIN <span style={{color: 'red'}}>*</span></label>
                  <div style={{ position: 'relative' }}>
                      <HiOutlineIdentification style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                      <input 
                          type="text" 
                          className="form-control"
                          value={formData.cin} 
                          onChange={e => setFormData({ ...formData, cin: e.target.value })} 
                          required 
                          placeholder="Ex: AB123456" 
                          style={{ padding: '0.8rem 0.8rem 0.8rem 2.8rem', borderRadius: '0.6rem' }}
                      />
                  </div>
                </div>

                <div className="form-group">
                  <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Téléphone</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    placeholder="Ex: +212 600000000" 
                    style={{ padding: '0.8rem', borderRadius: '0.6rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Email Professionnel (Généré)</label>
                <div style={{ position: 'relative' }}>
                    <HiOutlineMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="email" 
                        className="form-control"
                        value={formData.email} 
                        readOnly 
                        placeholder="prenomnom.siegeID@gmail.com" 
                        style={{ padding: '0.8rem 0.8rem 0.8rem 2.8rem', borderRadius: '0.6rem', backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: 'var(--primary)', fontWeight: 600 }}
                    />
                </div>
                <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>Ce champ est en lecture seule et se met à jour automatiquement.</small>
              </div>

              {!editingSiege && (
                <div className="form-group" style={{ marginTop: '1.5rem' }}>
                  <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Mot de passe temporaire</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.password} 
                    onChange={e => setFormData({ ...formData, password: e.target.value })} 
                    required 
                    style={{ padding: '0.8rem', borderRadius: '0.6rem', fontFamily: 'monospace' }} 
                  />
                  <small style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'block' }}>L'utilisateur devra changer son mot de passe à la première connexion.</small>
                </div>
              )}

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Téléphone</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={formData.phone} 
                  onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                  placeholder="Ex: +212 600000000" 
                  style={{ padding: '0.8rem', borderRadius: '0.6rem' }}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button type="button" className="btn order-2 sm:order-1 flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-semibold" onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary order-1 sm:order-2 flex-[2] py-3 rounded-xl font-semibold shadow-lg shadow-orange-200">
                  {editingSiege ? 'Enregistrer' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-control:focus {
            border-color: var(--primary);
            box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
            outline: none;
        }
      `}</style>
    </div>
  );
}
