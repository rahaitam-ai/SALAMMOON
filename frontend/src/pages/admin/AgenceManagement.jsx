import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

export default function AgenceManagement() {
  const [agences, setAgences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAgence, setEditingAgence] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    agency_name: ''
  });

  useEffect(() => {
    fetchAgences();
  }, []);

  const fetchAgences = async () => {
    try {
      const res = await api.get('/admin/agences');
      setAgences(res.data.agences);
    } catch (err) {
      toast.error('Erreur lors du chargement des agences');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (agence = null) => {
    setEditingAgence(agence);
    setFormData({
      name: agence ? agence.name : '',
      email: agence ? agence.email : '',
      password: '', // Auto-generated for new only
      phone: agence ? agence.phone || '' : '',
      address: agence ? agence.address || '' : '',
      agency_name: agence ? agence.agency_name || '' : '',
    });
    
    if (!agence) {
      setFormData(prev => ({ ...prev, password: generatePassword() }));
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAgence(null);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgence) {
        const payload = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          agency_name: formData.agency_name,
        };
        await api.put(`/admin/agences/${editingAgence.id}`, payload);
        toast.success('Agence mise à jour avec succès');
      } else {
        await api.post('/admin/agences', formData);
        toast.success('Agence créée avec succès');
      }
      fetchAgences();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette agence ? Toutes ses données seront perdues.')) return;
    try {
      await api.delete(`/admin/agences/${id}`);
      toast.success('Agence supprimée');
      fetchAgences();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="management-page">
      <div className="dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Gestion des Agences</h1>
          <p>Créer et administrer les comptes d'agences bancaires</p>
        </div>
        <button className="btn btn--primary" onClick={() => openModal()}>
          <HiOutlinePlus /> Nouvelle Agence
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom de l'Agence</th>
                <th>Gérant</th>
                <th>Email</th>
                <th>Clients</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agences.length > 0 ? (
                agences.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.agency_code}</strong></td>
                    <td>{a.agency_name}</td>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{a.clients_count || 0}</td>
                    <td>
                      <span className={`stat-card__badge`} style={{ backgroundColor: a.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: a.is_active ? 'var(--success)' : 'var(--error)' }}>
                        {a.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn" style={{ padding: '0.5rem', color: 'var(--info)', background: 'transparent', boxShadow: 'none' }} onClick={() => openModal(a)} title="Modifier">
                        <HiOutlinePencilAlt size={18} />
                      </button>
                      <button className="btn" style={{ padding: '0.5rem', color: 'var(--error)', background: 'transparent', boxShadow: 'none' }} onClick={() => handleDelete(a.id)} title="Supprimer">
                        <HiOutlineTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">Aucune agence trouvée</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '600px', margin: '2rem auto', animation: 'slideUp 0.3s' }}>
            <div className="card__header">
              <h2 className="card__title">{editingAgence ? "Modifier l'Agence" : 'Nouvelle Agence'}</h2>
              <button className="btn" style={{ background: 'transparent', boxShadow: 'none', padding: '0' }} onClick={closeModal}><HiOutlineX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              
              <div className="form-group">
                <label>Nom de l'Agence</label>
                <div className="input-wrapper">
                  <input type="text" value={formData.agency_name} onChange={e => setFormData({ ...formData, agency_name: e.target.value })} required placeholder="Ex: Agence Hassan II" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Nom du Gérant</label>
                  <div className="input-wrapper">
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required placeholder="Nom et prénom" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email de connexion</label>
                  <div className="input-wrapper">
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="agence@baridbank.ma" />
                  </div>
                </div>
              </div>

              {!editingAgence && (
                <div className="form-group">
                  <label>Mot de passe (Temporaire)</label>
                  <div className="input-wrapper">
                    <input type="text" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required minLength={8} />
                  </div>
                  <small className="text-muted" style={{ display: 'block', marginTop: '0.5rem' }}>Le gérant devra le changer à la première connexion.</small>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Téléphone</label>
                  <div className="input-wrapper">
                    <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Ex: 0522000000" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Adresse de l'agence</label>
                  <div className="input-wrapper">
                    <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Adresse physique" />
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ flex: 1, backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} onClick={closeModal}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>
                  {editingAgence ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
