import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineArrowLeft, HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEye, HiOutlineX, HiOutlineSearch } from 'react-icons/hi';

export default function AgenceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSiege = user?.role === 'siege';

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Guichetiers state
  const [guichetiers, setGuichetiers] = useState([]);
  const [guichetierSearch, setGuichetierSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Transactions state (agency-wide)
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);

  // Edit Guichetier Modal state
  const [editingGuichetier, setEditingGuichetier] = useState(null);
  const [editFormData, setEditFormData] = useState({ nom: '', prenom: '', email: '', cin: '', is_active: true });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => { fetchAgenceDetails(); fetchTransactions(); }, [id]);

  const fetchAgenceDetails = async () => {
    try {
      const endpoint = isSiege ? `/siege/agences/${id}` : `/admin/agences-physiques/${id}`;
      const res = await api.get(endpoint);
      setData(res.data);
      setGuichetiers(res.data.guichetiers || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des détails de l\'agence');
      navigate(isSiege ? '/siege/agences' : '/admin/agences-physiques');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const endpoint = `/admin/agences-physiques/${id}/transactions`;
      const res = await api.get(endpoint);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      toast.error('Erreur lors du chargement de l\'historique des transactions');
    } finally {
      setLoadingTransactions(false);
    }
  };

  const downloadTransactionsPdf = async () => {
    try {
      const res = await api.get(`/admin/agences-physiques/${id}/transactions/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `historique-transactions-agence-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      toast.error('Erreur lors du téléchargement du PDF');
    }
  };

  const downloadTransactionReceipt = async (t) => {
    try {
      const endpoint = t.type === 'Dépôt' ? `/admin/depots/${t.id}/recu` : `/admin/retraits/${t.id}/recu`;
      const res = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = t.type === 'Dépôt' ? `recu-depot-${t.id}.pdf` : `recu-retrait-${t.id}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      toast.error('Impossible de télécharger le reçu.');
    }
  };

  const handleDeleteGuichetier = async (gId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce guichetier ?')) return;
    try {
      await api.delete(`/admin/guichetiers/${gId}`);
      toast.success('Guichetier supprimé avec succès');
      setGuichetiers(prev => prev.filter(g => g.id !== gId));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleOpenEditModal = (g) => {
    setEditingGuichetier(g);
    setEditFormData({ nom: g.nom, prenom: g.prenom, email: g.email, cin: g.cin, is_active: g.is_active });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/guichetiers/${editingGuichetier.id}`, editFormData);
      toast.success('Informations du guichetier mises à jour');
      setShowEditModal(false);
      fetchAgenceDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  const agence = data?.agence;
  const stats = data?.stats;
  const recentClients = data?.recent_clients || [];

  const filteredGuichetiers = guichetiers.filter(g => {
    const query = guichetierSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      g.nom_complet?.toLowerCase().includes(query) ||
      g.email?.toLowerCase().includes(query) ||
      g.cin?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredGuichetiers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuichetiers = filteredGuichetiers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="management-page">

      {/* ── HEADER ── */}
      <div className="dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <button
            onClick={() => navigate(isSiege ? '/siege/agences' : '/admin/agences-physiques')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.75rem', padding: 0 }}
          >
            <HiOutlineArrowLeft size={16} /> Retour aux agences physiques
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                <code style={{ background: 'var(--bg-color)', border: '1px solid var(--border-color)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  ABB-{agence?.code_agence}
                </code>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', padding: '0.15rem 0.6rem', borderRadius: '2rem',
                  fontSize: '0.75rem', fontWeight: 700,
                  backgroundColor: agence?.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  color: agence?.is_active ? '#10b981' : '#ef4444'
                }}>
                  {agence?.is_active ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>{agence?.nom}</h1>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{agence?.ville} — Région {agence?.region}</p>
            </div>
          </div>
        </div>
        {!isSiege && (
          <button
            onClick={() => navigate('/admin/guichetiers/nouveau')}
            className="btn btn--primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}
          >
            <HiOutlinePlus size={20} /> Nouveau Guichetier
          </button>
        )}
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { label: 'Clients de l\'agence', value: stats?.clients_count || 0, sub: 'Portefeuille direct', color: 'var(--info)' },
          { label: 'Comptes rattachés', value: stats?.accounts_count || 0, sub: 'Comptes sécurisés', color: 'var(--primary)' },
          { label: 'Effectif guichetiers', value: stats?.guichetiers_count || 0, sub: 'Opérateurs actifs', color: 'var(--success)' },
          { label: 'Volume transactions', value: stats?.operations_count || 0, sub: 'Mouvements logs', color: 'var(--warning)' },
        ].map((s, i) => (
          <div key={i} className="card stat-card" style={{ borderLeft: `4px solid ${s.color}`, borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>{s.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '0.3rem' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── TWO COLUMNS: INFO + CLIENTS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginBottom: '2rem' }}>

        {/* Informations administratives */}
        <div className="card" style={{ borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', padding: '1.5rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Profil d'Établissement</p>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>Informations administratives</h2>
          <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
            <tbody>
              {[
                { label: 'Nom commercial', value: agence?.nom },
                { label: 'Code agence', value: <code style={{ background: 'var(--bg-color)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--primary)', fontWeight: 700 }}>{agence?.code_agence}</code> },
                { label: 'Ville', value: agence?.ville },
                { label: 'Région', value: agence?.region },
                { label: 'Code ville', value: agence?.code_ville || 'N/A' },
                { label: 'Date d\'inauguration', value: new Date(agence?.created_at).toLocaleDateString('fr-FR') },
                { label: 'Statut', value: (
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', padding: '0.2rem 0.6rem', borderRadius: '2rem',
                    fontSize: '0.75rem', fontWeight: 700,
                    backgroundColor: agence?.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: agence?.is_active ? '#10b981' : '#ef4444'
                  }}>{agence?.is_active ? 'Actif' : 'Inactif'}</span>
                )},
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(124,105,97,0.08)' }}>
                  <td style={{ padding: '0.65rem 0', color: 'var(--text-secondary)', fontWeight: 600, whiteSpace: 'nowrap', paddingRight: '1rem' }}>{row.label}</td>
                  <td style={{ padding: '0.65rem 0', color: 'var(--text-primary)', fontWeight: 700, textAlign: 'right' }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Derniers clients */}
        <div className="card" style={{ borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(124,105,97,0.08)', backgroundColor: '#faf9f6' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Acquisition locale</p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Derniers clients ajoutés</h2>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Numéro Client</th>
                  <th>Nom Complet</th>
                  <th>CIN</th>
                  <th>Téléphone</th>
                  <th>Date d'enregistrement</th>
                </tr>
              </thead>
              <tbody>
                {recentClients.length === 0 ? (
                  <tr><td colSpan="5" className="text-center text-muted py-5">Aucun client rattaché à cet établissement.</td></tr>
                ) : (
                  recentClients.map(c => (
                    <tr key={c.id}>
                      <td><code style={{ background: 'var(--bg-color)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{c.client_number}</code></td>
                      <td><strong>{c.prenom} {c.nom}</strong></td>
                      <td><code style={{ background: 'var(--bg-color)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--primary)' }}>{c.cin}</code></td>
                      <td>{c.phone}</td>
                      <td>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── GUICHETIERS SECTION ── */}
      <div className="card" style={{ borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', overflow: 'hidden', padding: 0 }}>

        {/* Toolbar */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(124,105,97,0.08)', display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: '#faf9f6', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Effectif local</p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Liste des guichetiers de cette agence</h2>
          </div>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <HiOutlineSearch style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#9a847a' }} />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou CIN..."
              value={guichetierSearch}
              onChange={e => { setGuichetierSearch(e.target.value); setCurrentPage(1); }}
              style={{ width: '100%', padding: '0.6rem 1.2rem 0.6rem 2.4rem', borderRadius: '0.8rem', border: '1px solid rgba(124,105,97,0.15)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
            />
            {guichetierSearch && (
              <button onClick={() => setGuichetierSearch('')} style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#9a847a', cursor: 'pointer', fontWeight: 700 }}>
                Effacer
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Nom Complet</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>CIN</th>
                <th>Statut</th>
                <th>Date d'Ajout</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentGuichetiers.length > 0 ? (
                currentGuichetiers.map(g => {
                  const initials = (g.prenom?.[0] || '') + (g.nom?.[0] || '');
                  return (
                    <tr key={g.id}>
                      <td>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#1e1e1e', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>
                          {initials.toUpperCase()}
                        </div>
                      </td>
                      <td><strong>{g.nom_complet}</strong></td>
                      <td>{g.email}</td>
                      <td>{g.phone}</td>
                      <td><code style={{ background: 'var(--bg-color)', padding: '0.15rem 0.4rem', borderRadius: '4px', color: 'var(--primary)' }}>{g.cin}</code></td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', padding: '0.3rem 0.7rem', borderRadius: '2rem',
                          fontSize: '0.8rem', fontWeight: 700,
                          backgroundColor: g.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                          color: g.is_active ? '#10b981' : '#ef4444'
                        }}>
                          {g.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>{new Date(g.created_at).toLocaleDateString('fr-FR')}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn"
                            style={{ padding: '0.5rem', color: '#9a847a', background: 'transparent', boxShadow: 'none' }}
                            onClick={() => toast(`Profil de ${g.nom_complet} • CIN: ${g.cin}`, { icon: '👁️', style: { borderRadius: '10px', background: '#1e1e1e', color: '#fff' } })}
                            title="Consulter profil"
                          >
                            <HiOutlineEye size={18} />
                          </button>
                          {!isSiege && (
                            <>
                              <button
                                className="btn"
                                style={{ padding: '0.5rem', color: 'var(--info)', background: 'transparent', boxShadow: 'none' }}
                                onClick={() => handleOpenEditModal(g)}
                                title="Modifier"
                              >
                                <HiOutlinePencilAlt size={18} />
                              </button>
                              <button
                                className="btn"
                                style={{ padding: '0.5rem', color: 'var(--error)', background: 'transparent', boxShadow: 'none' }}
                                onClick={() => handleDeleteGuichetier(g.id)}
                                title="Supprimer"
                              >
                                <HiOutlineTrash size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="text-center text-muted py-5">
                    {guichetierSearch ? 'Aucun guichetier ne correspond à votre recherche.' : 'Aucun guichetier opérationnel affecté à cette agence.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(124,105,97,0.08)', backgroundColor: '#faf9f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Page {currentPage} sur {totalPages}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', fontWeight: 600, opacity: currentPage === 1 ? 0.4 : 1 }}>
                Précédent
              </button>
              <button className="btn btn--primary" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', fontWeight: 600, opacity: currentPage === totalPages ? 0.4 : 1 }}>
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── TRANSACTION HISTORY SECTION ── */}
      <div className="card" style={{ borderRadius: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', overflow: 'hidden', padding: '1.5rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Historique</p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Historique des Transactions de l'Agence</h2>
          </div>
          <div>
            <button onClick={downloadTransactionsPdf} className="btn btn--primary" style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>
              Télécharger l'historique
            </button>
          </div>
        </div>

        <div className="table-responsive">
          {loadingTransactions ? (
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Montant (MAD)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-5">Aucune transaction trouvée pour cette agence.</td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={`${t.type}-${t.id}`}>
                      <td>{t.date ? new Date(t.date).toLocaleString('fr-FR') : '-'}</td>
                      <td>{t.type}</td>
                      <td style={{ textAlign: 'right' }}>{Number(t.montant || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn" onClick={() => downloadTransactionReceipt(t)} style={{ padding: '0.4rem 0.6rem' }}>
                            Télécharger le reçu
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── EDIT GUICHETIER MODAL ── */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px', width: '95%', borderRadius: '1.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.18)' }}>
            <div className="card__header" style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(124,105,97,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="card__title" style={{ margin: 0, fontSize: '1.2rem' }}>Modifier le guichetier</h2>
              <button className="btn" onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}><HiOutlineX size={22} /></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ padding: '1.5rem 2rem' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label style={{ fontWeight: 600, marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>Prénom <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" className="form-control" required value={editFormData.prenom} onChange={e => setEditFormData({ ...editFormData, prenom: e.target.value })} style={{ padding: '0.7rem' }} />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 600, marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>Nom <span style={{ color: 'red' }}>*</span></label>
                  <input type="text" className="form-control" required value={editFormData.nom} onChange={e => setEditFormData({ ...editFormData, nom: e.target.value })} style={{ padding: '0.7rem' }} />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>Email <span style={{ color: 'red' }}>*</span></label>
                <input type="email" className="form-control" required value={editFormData.email} onChange={e => setEditFormData({ ...editFormData, email: e.target.value })} style={{ padding: '0.7rem' }} />
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label style={{ fontWeight: 600, marginBottom: '0.4rem', display: 'block', fontSize: '0.85rem' }}>CIN <span style={{ color: 'red' }}>*</span></label>
                <input type="text" className="form-control" required value={editFormData.cin} onChange={e => setEditFormData({ ...editFormData, cin: e.target.value })} style={{ padding: '0.7rem' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                <input type="checkbox" checked={editFormData.is_active} onChange={e => setEditFormData({ ...editFormData, is_active: e.target.checked })} style={{ width: '18px', height: '18px' }} />
                Compte guichetier actif
              </label>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button type="button" className="btn order-2 sm:order-1 flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-semibold" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn btn--primary order-1 sm:order-2 flex-1 py-3 rounded-xl font-semibold">
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
