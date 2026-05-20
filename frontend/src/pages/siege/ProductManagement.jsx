import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineX } from 'react-icons/hi';

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'card',
    description: '',
    card_type: '',
    account_type: '',
    fee: 0,
    is_active: true
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/siege/products');
      setProducts(res.data.products);
    } catch (err) {
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      setFormData({
        name: product.name,
        code: product.code,
        type: product.type,
        description: product.description || '',
        card_type: product.card_type || '',
        account_type: product.account_type || '',
        fee: product.fee,
        is_active: product.is_active
      });
    } else {
      setFormData({
        name: '',
        code: '',
        type: 'card',
        description: '',
        card_type: '',
        account_type: '',
        fee: 0,
        is_active: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/siege/products/${editingProduct.id}`, formData);
        toast.success('Produit mis à jour avec succès');
      } else {
        await api.post('/siege/products', formData);
        toast.success('Produit créé avec succès');
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;
    try {
      await api.delete(`/siege/products/${id}`);
      toast.success('Produit supprimé avec succès');
      fetchProducts();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="management-page">
      <div className="dashboard__header">
        <div>
          <h1>Gestion des Produits Bancaires</h1>
          <p>Définissez les cartes, comptes et services disponibles</p>
        </div>
        <button className="btn btn--primary" onClick={() => openModal()}>
          <HiOutlinePlus /> Nouveau Produit
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Nom</th>
                <th>Type</th>
                <th>Frais</th>
                <th>Statut</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map(product => (
                  <tr key={product.id}>
                    <td><code>{product.code}</code></td>
                    <td>{product.name}</td>
                    <td>
                      <span className="badge" style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
                        {product.type === 'card' ? '💳 Carte' : product.type === 'account' ? '🏦 Compte' : '🛠️ Service'}
                      </span>
                    </td>
                    <td>{parseFloat(product.fee).toLocaleString()} MAD</td>
                    <td>
                      <span className={`stat-card__badge`} style={{ backgroundColor: product.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: product.is_active ? 'var(--success)' : 'var(--error)' }}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn btn--icon" onClick={() => openModal(product)} style={{ color: 'var(--info)' }}>
                        <HiOutlinePencilAlt size={18} />
                      </button>
                      <button className="btn btn--icon" onClick={() => handleDelete(product.id)} style={{ color: 'var(--error)' }}>
                        <HiOutlineTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">Aucun produit configuré</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card" style={{ maxWidth: '600px', animation: 'slideDown 0.3s' }}>
            <div className="card__header">
              <h2 className="card__title">{editingProduct ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
              <button className="btn btn--icon" onClick={closeModal}><HiOutlineX size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="form-group">
                  <label>Nom du produit *</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    placeholder="Ex: Carte Visa Gold"
                  />
                </div>
                <div className="form-group">
                  <label>Code unique *</label>
                  <input 
                    type="text" 
                    value={formData.code} 
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
                    required 
                    placeholder="Ex: VISA_GOLD"
                  />
                </div>
                <div className="form-group">
                  <label>Type de produit *</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({ ...formData, type: e.target.value, card_type: '', account_type: '' })}
                    className="input-wrapper"
                    style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  >
                    <option value="card">Carte Bancaire</option>
                    <option value="account">Type de Compte</option>
                    <option value="service">Service (SMS, Assurance, etc.)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Frais (MAD) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.fee} 
                    onChange={e => setFormData({ ...formData, fee: e.target.value })} 
                    required 
                  />
                </div>

                {formData.type === 'card' && (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Réseau de la carte *</label>
                    <select 
                      value={formData.card_type} 
                      onChange={e => setFormData({ ...formData, card_type: e.target.value })}
                      required
                      className="input-wrapper"
                      style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="CMI">CMI (Local)</option>
                    </select>
                  </div>
                )}

                {formData.type === 'account' && (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Type de compte *</label>
                    <select 
                      value={formData.account_type} 
                      onChange={e => setFormData({ ...formData, account_type: e.target.value })}
                      required
                      className="input-wrapper"
                      style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                    >
                      <option value="">Sélectionner...</option>
                      <option value="Current">Courant</option>
                      <option value="Savings">Épargne</option>
                      <option value="Business">Professionnel</option>
                    </select>
                  </div>
                )}

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Détails du produit..."
                    rows="3"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    id="is_active"
                    checked={formData.is_active} 
                    onChange={e => setFormData({ ...formData, is_active: e.target.checked })} 
                  />
                  <label htmlFor="is_active" style={{ marginBottom: 0 }}>Produit Actif</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn" style={{ flex: 1 }} onClick={closeModal}>Annuler</button>
                <button type="submit" className="btn btn--primary" style={{ flex: 1 }}>
                  {editingProduct ? 'Mettre à jour' : 'Créer le Produit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
