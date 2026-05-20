import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  HiOutlineCube, 
  HiOutlineCheck, 
  HiOutlineSparkles,
  HiOutlinePencil
} from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function OffresActuelles() {
  const [packs, setPacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const presets = [
    {
      color: "#D4A017",
      bgGradient: "linear-gradient(135deg, #1E1E1E 0%, #3a3a3a 100%)",
      badgeBg: "rgba(212, 160, 23, 0.2)",
      badgeColor: "#D4A017",
      tag: "Populaire"
    },
    {
      color: "#005096",
      bgGradient: "linear-gradient(135deg, #005096 0%, #002244 100%)",
      badgeBg: "rgba(0, 80, 150, 0.15)",
      badgeColor: "#0073D1",
      tag: "Privilège"
    },
    {
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, #005C33 0%, #00361E 100%)",
      badgeBg: "rgba(16, 185, 129, 0.15)",
      badgeColor: "#10b981",
      tag: "Recommandé"
    },
    {
      color: "#F59E0B",
      bgGradient: "linear-gradient(135deg, #7C6961 0%, #5d4e48 100%)",
      badgeBg: "rgba(245, 158, 11, 0.15)",
      badgeColor: "#F59E0B",
      tag: "Standard"
    }
  ];

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/siege/packs');
      setPacks(res.data.packs || []);
    } catch (err) {
      toast.error('Erreur lors du chargement des offres');
    } finally {
      setLoading(false);
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
    <div className="management-page" style={{ padding: '2rem 1.5rem' }}>
      
      {/* HEADER SECTION */}
      <div className="dashboard__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Nos Offres Actuelles
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Catalogue dynamique de nos solutions financières et packs de comptes configurés au siège central.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            to="/siege/packs"
            className="btn" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.8rem 1.5rem', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              borderRadius: '0.5rem', 
              backgroundColor: '#ffffff', 
              border: '1px solid rgba(124, 105, 97, 0.15)',
              color: '#5d4e48', 
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            AJOUTER UN PACK
          </Link>
          <button 
            onClick={fetchPacks}
            className="btn btn--primary" 
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
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(250, 211, 31, 0.2)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(0.95)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
          >
            Actualiser le Catalogue
          </button>
        </div>
      </div>

      {/* OFFERS GRID */}
      {packs.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {packs.map((pack, index) => {
            const preset = presets[index % presets.length];
            return (
              <div 
                key={pack.id}
                className="card" 
                style={{ 
                  border: 'none', 
                  boxShadow: '0 15px 35px rgba(0,0,0,0.06)', 
                  borderRadius: '1.5rem', 
                  background: '#ffffff', 
                  padding: '2rem', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.06)';
                }}
              >
                {/* Colored Header Block */}
                <div style={{ 
                  background: preset.bgGradient,
                  margin: '-2rem -2rem 1.5rem -2rem',
                  padding: '2.5rem 2rem',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  position: 'relative'
                }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{pack.name}</h2>
                  <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 600 }}>Code: {pack.code}</span>
                </div>

                {/* Price Block */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Tarification Mensuelle :</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: preset.color }}>
                    {pack.monthly_fee && pack.monthly_fee > 0 ? `${pack.monthly_fee} DH` : 'Gratuit'}
                  </span>
                </div>


                {/* Advantages list (Products) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, marginBottom: '2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5d4e48', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                    Services inclus dans le pack :
                  </span>
                  {pack.products && pack.products.length > 0 ? (
                    pack.products.map((product) => (
                      <div key={product.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <HiOutlineCheck size={18} style={{ color: preset.color, flexShrink: 0, marginTop: '0.1rem' }} />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: '1.4' }}>
                          {product.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      Aucun produit individuel associé.
                    </div>
                  )}
                </div>

                {/* Premium modification action button */}
                <Link 
                  to={`/siege/packs?edit=${pack.id}`}
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    borderRadius: '0.8rem',
                    backgroundColor: 'transparent',
                    border: `2px solid ${preset.color}`,
                    color: preset.color,
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = preset.color;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = preset.color;
                  }}
                >
                  <HiOutlinePencil size={15} /> Modifier ce Pack
                </Link>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', borderRadius: '1.5rem', padding: '5rem 2rem', textAlign: 'center', background: '#ffffff' }}>
          <HiOutlineCube size={50} style={{ color: 'var(--text-secondary)', margin: '0 auto 1.5rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Aucun Pack Actif</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Configurez vos premiers packs bancaires depuis l'interface de gestion pour les voir s'afficher ici.</p>
          <Link 
            to="/siege/packs" 
            className="btn btn--primary" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              padding: '0.8rem 2rem', 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              borderRadius: '0.5rem', 
              backgroundColor: 'var(--primary)', 
              color: '#1e1e1e', 
              border: 'none', 
              textDecoration: 'none',
              boxShadow: '0 4px 10px rgba(250, 211, 31, 0.2)' 
            }}
          >
            Créer un Pack Bancaire
          </Link>
        </div>
      )}

    </div>
  );
}
