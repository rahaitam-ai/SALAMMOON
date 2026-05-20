import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineX, HiOutlineCube, HiOutlineCheckCircle, HiOutlineSparkles, HiOutlinePencil, HiOutlineCollection, HiOutlineCheck } from 'react-icons/hi';

export default function PackManagement() {
  const navigate = useNavigate();

  const generateAutomaticCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = letters.charAt(Math.floor(Math.random() * letters.length));
    const randomDigits = Math.floor(10 + Math.random() * 90); // 10 to 99
    return `${randomLetter}${randomDigits}`;
  };

  const generateNextProductCode = (productList = products) => {
    let maxNum = 0;
    productList.forEach(p => {
      if (p.code) {
        const match = p.code.match(/\d+/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (num > maxNum) {
            maxNum = num;
          }
        }
      }
    });
    return `PRD${String(maxNum + 1).padStart(2, '0')}`;
  };

  const [packs, setPacks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [editingPack, setEditingPack] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    code: generateAutomaticCode(),
    monthly_fee: 0,
    product_ids: [],
    is_active: true
  });
  
  const [showQuickProduct, setShowQuickProduct] = useState(false);
  const [newProductData, setNewProductData] = useState({
    name: '',
    code: '',
    type: 'service',
    fee: 0,
    card_type: '',
    account_type: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const total = formData.product_ids.reduce((sum, id) => {
      const prod = products.find(p => p.id === id);
      return sum + (prod ? parseFloat(prod.fee || 0) : 0);
    }, 0);
    setFormData(prev => {
      if (prev.monthly_fee !== total) {
        return { ...prev, monthly_fee: total };
      }
      return prev;
    });
  }, [formData.product_ids, products]);

  const fetchData = async () => {
    try {
      const [packsRes, productsRes] = await Promise.all([
        api.get('/siege/packs'),
        api.get('/siege/products')
      ]);
      const loadedPacks = packsRes.data.packs;
      setPacks(loadedPacks);
      const loadedProducts = productsRes.data.products;
      setProducts(loadedProducts);
      setNewProductData(prev => ({
        ...prev,
        code: generateNextProductCode(loadedProducts)
      }));

      // Check for edit parameter
      const query = new URLSearchParams(window.location.search);
      const editId = query.get('edit');
      if (editId) {
        const packToEdit = loadedPacks.find(p => p.id === parseInt(editId));
        if (packToEdit) {
          handleEdit(packToEdit);
          // Clear query params so that if the user refreshes/reloads, it starts with a clean/empty form!
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    } catch (err) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickProductAdd = async (e) => {
    e.preventDefault();
    if (!newProductData.name || !newProductData.code) {
      toast.error('Veuillez remplir le nom et le code du produit.');
      return;
    }
    try {
      const res = await api.post('/siege/products', newProductData);
      const createdProduct = res.data.product;
      const updatedProducts = [createdProduct, ...products];
      setProducts(updatedProducts);
      setFormData(prev => ({
        ...prev,
        product_ids: [...prev.product_ids, createdProduct.id]
      }));
      setNewProductData({ 
        name: '', 
        code: generateNextProductCode(updatedProducts), 
        type: 'service', 
        fee: 0, 
        card_type: '', 
        account_type: '' 
      });
      setShowQuickProduct(false);
      toast.success('Produit ajouté et sélectionné !');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'ajout du produit');
    }
  };

  const handleProductEdit = (product) => {
    setEditingProduct({ ...product });
    setShowProductModal(true);
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/siege/products/${editingProduct.id}`, editingProduct);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
      
      // Also update products inside packs list locally to avoid a full fetch if possible
      setPacks(prev => prev.map(pack => ({
        ...pack,
        products: pack.products?.map(p => p.id === editingProduct.id ? editingProduct : p)
      })));

      setShowProductModal(false);
      setEditingProduct(null);
      toast.success('Produit mis à jour');
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du produit');
    }
  };

  const handleProductDelete = async (e, productId) => {
    e.stopPropagation();
    if (!window.confirm('Voulez-vous supprimer définitivement ce produit ?')) return;
    try {
      await api.delete(`/siege/products/${productId}`);
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      setNewProductData(prev => ({
        ...prev,
        code: generateNextProductCode(updatedProducts)
      }));
      setPacks(prev => prev.map(pack => ({
        ...pack,
        products: pack.products?.filter(p => p.id !== productId)
      })));
      setFormData(prev => ({
        ...prev,
        product_ids: prev.product_ids.filter(id => id !== productId)
      }));
      toast.success('Produit supprimé');
    } catch (err) {
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  const resetForm = () => {
    setEditingPack(null);
    setFormData({
      name: '',
      code: generateAutomaticCode(),
      monthly_fee: 0,
      product_ids: [],
      is_active: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleProduct = (productId) => {
    setFormData(prev => {
      const ids = [...prev.product_ids];
      if (ids.includes(productId)) {
        return { ...prev, product_ids: ids.filter(id => id !== productId) };
      } else {
        return { ...prev, product_ids: [...ids, productId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.product_ids.length === 0) {
      toast.error('Veuillez sélectionner au moins un produit pour ce pack.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingPack) {
        await api.put(`/siege/packs/${editingPack.id}`, formData);
        toast.success('Pack mis à jour avec succès');
      } else {
        await api.post('/siege/packs', formData);
        toast.success('Pack créé avec succès');
      }
      fetchData();
      resetForm();
      navigate('/siege/offres');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pack) => {
    setEditingPack(pack);
    setFormData({
      name: pack.name,
      code: pack.code,
      monthly_fee: pack.monthly_fee,
      product_ids: pack.products?.map(p => p.id) || [],
      is_active: pack.is_active
    });
    // Scroll to form which is now at the bottom
    setTimeout(() => {
      document.getElementById('pack-form').scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce pack ?')) return;
    try {
      await api.delete(`/siege/packs/${id}`);
      toast.success('Pack supprimé avec succès');
      fetchData();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (loading) return <div className="spinner-container"><div className="spinner"></div></div>;

  return (
    <div className="pack-management-premium" style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      
      {/* Return header style matching account types nouveau */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {editingPack ? 'Modifier le pack banquier' : 'ajouter un pack banquier'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          {editingPack ? 'Mettez à jour les informations, la tarification et les services de ce pack bancaire.' : 'Configurez un nouveau pack d\'offres groupées pour l\'ensemble du réseau national.'}
        </p>
      </div>

      {/* FORM CARD MATCHING ACCOUNT TYPES NOUVEAU */}
      <div className="card" style={{ border: 'none', boxShadow: '0 20px 40px rgba(124, 105, 97, 0.05)', borderRadius: '1.5rem', background: '#ffffff', padding: '3rem 3.5rem' }} id="pack-form">
        <form onSubmit={handleSubmit}>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
              Dénomination du Pack <span style={{ color: '#d4a017' }}>*</span>
            </label>
            <input 
              type="text" 
              className="form-control"
              required 
              value={formData.name} 
              onChange={e => setFormData({ ...formData, name: e.target.value })} 
              placeholder="Ex: Pack Gold Excellence..."
              style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
              Code Identifiant (Généré Automatiquement)
            </label>
            <input 
              type="text" 
              className="form-control"
              required 
              value={formData.code} 
              readOnly
              style={{ padding: '0.9rem 1.2rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none', backgroundColor: '#faf9f6', cursor: 'not-allowed', fontWeight: 'bold', color: '#5d4e48' }}
            />
          </div>



          {/* Products selector section with matching labels */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 700, fontSize: '0.8rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                Sélectionner les Produits Associés <span style={{ color: '#d4a017' }}>*</span>
              </label>
              <button 
                type="button" 
                onClick={() => setShowQuickProduct(!showQuickProduct)}
                style={{ 
                  border: '1px solid rgba(212, 160, 23, 0.3)', 
                  color: '#d4a017', 
                  background: 'transparent', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '0.5rem', 
                  fontWeight: 600, 
                  fontSize: '0.85rem', 
                  cursor: 'pointer', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  transition: 'all 0.2s' 
                }}
              >
                {showQuickProduct ? 'Fermer' : '+ Créer un produit'}
              </button>
            </div>

            {showQuickProduct && (
              <div className="quick-product-form animate-slide-down" style={{ background: '#faf9f6', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(124, 105, 97, 0.1)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Nom du produit <span style={{ color: '#d4a017' }}>*</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: Carte Guichet..." 
                      value={newProductData.name} 
                      onChange={e => setNewProductData({...newProductData, name: e.target.value})} 
                      className="form-control"
                      style={{ padding: '0.75rem 1rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Code produit (Auto)
                    </label>
                    <input 
                      type="text" 
                      placeholder="Code" 
                      value={newProductData.code} 
                      readOnly 
                      className="form-control"
                      style={{ padding: '0.75rem 1rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.9rem', outline: 'none', backgroundColor: '#e9ecef', cursor: 'not-allowed', fontWeight: 'bold', color: '#495057' }} 
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Prix du service <span style={{ color: '#d4a017' }}>*</span>
                    </label>
                    <input 
                      type="number" 
                      placeholder="Prix (MAD)" 
                      value={newProductData.fee} 
                      onChange={e => setNewProductData({...newProductData, fee: e.target.value})} 
                      className="form-control"
                      style={{ padding: '0.75rem 1rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={handleQuickProductAdd}
                    className="btn btn--primary btn--sm"
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '0.8rem', border: 'none', fontWeight: 700, cursor: 'pointer', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            <div className={`products-selector-grid ${formData.product_ids.length === 0 ? 'invalid' : ''}`} style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
              gap: '1.25rem', 
              padding: '1.5rem', 
              border: '1px dashed rgba(124, 105, 97, 0.2)', 
              borderRadius: '1.25rem', 
              minHeight: '120px', 
              backgroundColor: '#faf9f6',
              marginTop: '0.75rem'
            }}>
              {products
                .filter(product => {
                  const isInOtherPack = packs.some(pack => 
                    pack.id !== editingPack?.id && 
                    pack.products?.some(p => p.id === product.id)
                  );
                  return !isInOtherPack;
                })
                .map(product => {
                  const isSelected = formData.product_ids.includes(product.id);
                  return (
                    <div 
                      key={product.id} 
                      onClick={() => toggleProduct(product.id)}
                      style={{ 
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '1.25rem',
                        borderRadius: '1rem',
                        border: isSelected ? '2px solid #2e7d32' : '1px solid rgba(124, 105, 97, 0.15)',
                        backgroundColor: isSelected ? 'rgba(46, 125, 50, 0.02)' : '#ffffff',
                        boxShadow: isSelected ? '0 10px 25px rgba(46, 125, 50, 0.08)' : '0 4px 12px rgba(124, 105, 97, 0.03)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: '110px'
                      }}
                      className="product-card-item"
                    >
                      {/* Top Row: Icon, Select Indicator & Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: isSelected ? 'rgba(46, 125, 50, 0.1)' : 'rgba(124, 105, 97, 0.05)',
                          color: isSelected ? '#2e7d32' : '#7c6961'
                        }}>
                          {isSelected ? <HiOutlineCheckCircle size={18} /> : <HiOutlineCube size={18} />}
                        </div>
                        
                        {/* Action buttons */}
                        <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductEdit(product);
                            }}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#7c6961', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              transition: 'all 0.2s',
                              opacity: 0.8
                            }}
                            className="product-action-btn"
                            title="Modifier"
                          >
                            <HiOutlinePencil size={14} />
                          </button>
                          <button 
                            onClick={(e) => handleProductDelete(e, product.id)}
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: 'var(--error)', 
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              transition: 'all 0.2s',
                              opacity: 0.8
                            }}
                            className="product-action-btn"
                            title="Supprimer"
                          >
                            <HiOutlineTrash size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Middle & Bottom: Details */}
                      <div>
                        <h4 style={{ 
                          fontWeight: 700, 
                          fontSize: '0.95rem', 
                          color: '#5d4e48', 
                          margin: '0 0 0.25rem 0',
                          lineHeight: '1.2'
                        }}>
                          {product.name}
                        </h4>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            color: '#7c6961', 
                            backgroundColor: '#faf9f6', 
                            padding: '0.2rem 0.5rem', 
                            borderRadius: '0.4rem',
                            fontWeight: 700,
                            letterSpacing: '0.05em'
                          }}>
                            {product.code || 'PRD'}
                          </span>
                          <span style={{ 
                            fontSize: '1rem', 
                            fontWeight: 800, 
                            color: '#d4a017' 
                          }}>
                            {product.fee} DH
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            {formData.product_ids.length === 0 && <span className="error-text" style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: '0.5rem', display: 'block' }}>Au moins un produit est requis pour valider l'offre.</span>}
          </div>

          {/* Calculated Price Display Card */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '1.2rem 1.5rem', 
            borderRadius: '1rem', 
            backgroundColor: '#faf9f6', 
            border: '1px solid rgba(124, 105, 97, 0.15)',
            marginBottom: '2rem',
            marginTop: '2rem'
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Prix total du pack (Somme des produits)
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d4a017' }}>
              {formData.monthly_fee} DH <small style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ mois</small>
            </span>
          </div>

          {/* Form Actions Footer styled like CreateAccountType.jsx */}
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(124, 105, 97, 0.08)', paddingTop: '2rem' }}>
            {editingPack && (
              <button 
                type="button" 
                onClick={resetForm}
                style={{ 
                  padding: '1rem 2rem', 
                  borderRadius: '1rem', 
                  background: '#faf9f6', 
                  border: '1px solid rgba(124, 105, 97, 0.15)', 
                  color: '#5d4e48', 
                  fontWeight: 700, 
                  fontSize: '0.95rem', 
                  transition: 'all 0.2s', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                Annuler
              </button>
            )}
            <button 
              type="submit" 
              disabled={submitting}
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
              {submitting && <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px', borderTopColor: 'transparent', margin: 0 }}></div>}
              {editingPack ? 'Sauvegarder les modifications' : 'Générer l\'offre groupée'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-control:focus {
          border-color: #d4a017 !important;
          box-shadow: 0 0 0 4px rgba(212, 160, 23, 0.1) !important;
        }
        .product-card-item {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .product-card-item:hover {
          transform: translateY(-4px);
          border-color: rgba(46, 125, 50, 0.4) !important;
          box-shadow: 0 12px 30px rgba(46, 125, 50, 0.08) !important;
        }
        .product-action-btn:hover {
          background-color: rgba(124, 105, 97, 0.08) !important;
          color: #2e7d32 !important;
          opacity: 1 !important;
        }
      `}</style>

      {showProductModal && editingProduct && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content card animate-slide-down" style={{ width: '100%', maxWidth: '480px', border: 'none', boxShadow: '0 20px 40px rgba(124, 105, 97, 0.15)', borderRadius: '1.5rem', background: '#ffffff', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', margin: 0 }}>Modifier le produit</h2>
              <button onClick={() => setShowProductModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><HiOutlineX size={20} /></button>
            </div>
            
            <form onSubmit={handleProductUpdate}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
                  Nom du produit <span style={{ color: '#d4a017' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  required 
                  value={editingProduct.name} 
                  onChange={e => setEditingProduct({...editingProduct, name: e.target.value})}
                  style={{ padding: '0.85rem 1.1rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
                  Code produit
                </label>
                <input 
                  type="text" 
                  className="form-control"
                  required 
                  readOnly
                  value={editingProduct.code} 
                  style={{ padding: '0.85rem 1.1rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none', backgroundColor: '#e9ecef', cursor: 'not-allowed', color: '#495057', fontWeight: 'bold' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label style={{ fontWeight: 700, fontSize: '0.75rem', color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', display: 'block' }}>
                  Prix du service (MAD) <span style={{ color: '#d4a017' }}>*</span>
                </label>
                <input 
                  type="number" 
                  className="form-control"
                  required 
                  value={editingProduct.fee} 
                  onChange={e => setEditingProduct({...editingProduct, fee: e.target.value})}
                  style={{ padding: '0.85rem 1.1rem', borderRadius: '0.8rem', border: '1px solid rgba(124, 105, 97, 0.15)', fontSize: '0.95rem', width: '100%', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(124, 105, 97, 0.08)', paddingTop: '1.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)}
                  style={{ 
                    padding: '0.8rem 1.5rem', 
                    borderRadius: '0.8rem', 
                    background: '#faf9f6', 
                    border: '1px solid rgba(124, 105, 97, 0.15)', 
                    color: '#5d4e48', 
                    fontWeight: 700, 
                    fontSize: '0.9rem', 
                    cursor: 'pointer' 
                  }}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="btn btn--primary"
                  style={{ 
                    padding: '0.8rem 1.8rem', 
                    borderRadius: '0.8rem', 
                    border: 'none', 
                    fontWeight: 700, 
                    fontSize: '0.9rem', 
                    boxShadow: '0 8px 24px rgba(212, 160, 23, 0.25)', 
                    cursor: 'pointer' 
                  }}
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .pack-management-premium {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          background: transparent;
        }

        .premium-header {
          margin-bottom: 3rem;
          text-align: center;
        }

        .premium-header__content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .premium-header__icon {
          font-size: 3rem;
          color: var(--primary);
          filter: drop-shadow(0 0 10px rgba(10, 106, 177, 0.2));
        }

        .premium-header h1 {
          font-size: 2.25rem;
          color: var(--text-primary);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .premium-header p {
          color: var(--text-light);
          font-size: 1.1rem;
        }

        .form-section-centered {
          display: flex;
          justify-content: center;
          margin-bottom: 5rem;
        }

        .form-card {
          width: 100%;
          max-width: 700px;
          border: none;
          box-shadow: var(--shadow-lg);
          border-radius: 1.5rem;
          background: white;
          overflow: hidden;
        }

        .card__header-premium {
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, var(--primary), #0d84d1);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card__header-premium h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .premium-form {
          padding: 2rem;
        }

        .form-grid-premium {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-grid-inner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group-premium label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .premium-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: 1rem;
          transition: all 0.2s;
          background-color: #f9fafb;
        }

        .premium-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(10, 106, 177, 0.1);
          background-color: white;
          outline: none;
        }

        .section-header-compact {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .section-header-compact h3 {
          font-size: 1rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .quick-add-btn {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .quick-add-btn:hover {
          background: rgba(10, 106, 177, 0.05);
        }

        .quick-product-form {
          background: #f3f4f6;
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
        }

        .quick-product-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr auto;
          gap: 0.5rem;
        }

        .quick-product-grid input {
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .products-selector-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 1rem;
          background: #f9fafb;
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          max-height: 250px;
          overflow-y: auto;
          transition: border-color 0.2s;
        }

        .products-selector-grid.invalid {
          border-color: rgba(239, 68, 68, 0.3);
          background: rgba(239, 68, 68, 0.02);
        }

        .product-item-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 100px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s;
          user-select: none;
        }

        .product-item-pill:hover {
          border-color: var(--primary);
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        .product-item-pill.selected {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(10, 106, 177, 0.25);
        }

        .cube-icon { color: var(--text-light); }
        .product-item-pill.selected .cube-icon { color: white; }
        .check-icon { color: white; }

        .error-text {
          color: var(--error);
          font-size: 0.75rem;
          margin-top: 0.5rem;
          display: block;
        }

        .btn--full { width: 100%; }
        .btn--lg { padding: 1rem 2rem; font-size: 1.1rem; font-weight: 700; border-radius: var(--radius-md); }

        .section-divider {
          display: flex;
          align-items: center;
          margin-bottom: 3rem;
        }

        .section-divider::before, .section-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border-color);
        }

        .section-divider span {
          padding: 0 1.5rem;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .packs-grid-premium {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .pack-premium-card {
          padding: 0;
          border: none;
          box-shadow: var(--shadow-md);
          transition: all 0.3s;
          border-radius: 1.25rem;
          display: flex;
          flex-direction: column;
        }

        .pack-premium-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .pack-card__header {
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          background: #f9fafb;
          border-bottom: 1px solid var(--border-color);
        }

        .pack-card__info h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .pack-card__info code {
          font-size: 0.75rem;
          color: var(--text-light);
          background: white;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }

        .pack-card__price {
          text-align: right;
        }

        .pack-card__price span {
          display: block;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .pack-card__price small {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-light);
        }

        .pack-card__body {
          padding: 1.5rem;
          flex: 1;
        }

        .description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .products-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .product-badge {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.6rem;
          background: #f3f4f6;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .pack-card__actions {
          padding: 1rem;
          display: flex;
          gap: 0.5rem;
          background: #f9fafb;
          border-top: 1px solid var(--border-color);
        }

        .btn-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.6rem;
          border: 1px solid var(--border-color);
          background: white;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-action.edit:hover {
          color: var(--info);
          border-color: var(--info);
          background: rgba(10, 106, 177, 0.02);
        }

        .btn-action.delete:hover {
          color: var(--error);
          border-color: var(--error);
          background: rgba(239, 68, 68, 0.02);
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .form-grid-inner { grid-template-columns: 1fr; }
          .quick-product-grid { grid-template-columns: 1fr 1fr; }
          .pack-premium-card { min-width: 100%; }
        }
      `}</style>
    </div>
  );
}
