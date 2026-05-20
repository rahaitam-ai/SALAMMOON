import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { HiOutlineOfficeBuilding, HiOutlineArrowLeft, HiOutlineCheck } from 'react-icons/hi';

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
  "Casablanca": "200", "Mohammédia": "201", "El Jadida": "202", "Settat": "203", "Rabat": "204", "Salé": "205",
  "Marrakech": "206", "Fès": "207", "Tanger": "208", "Agadir": "209", "Berrechid": "210", "Benslimane": "211",
  "Kénitra": "212", "Skhirat": "213", "Témara": "214", "Safi": "215", "Essaouira": "216", "Youssoufia": "217",
  "Meknès": "218", "Ifrane": "219", "Sefrou": "220", "Taza": "221", "Tétouan": "222", "Al Hoceïma": "223",
  "Larache": "224", "Chefchaouen": "225", "Taroudant": "226", "Tiznit": "227", "Oujda": "228", "Nador": "229",
  "Berkane": "230", "Béni Mellal": "231", "Khénifra": "232", "Azilal": "233", "Errachidia": "234", "Ouarzazate": "235",
  "Zagora": "236", "Laâyoune": "237", "Boujdour": "238", "Dakhla": "239", "Guelmim": "240", "Sidi Ifni": "241"
};

export default function AddAgencePhysique() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    code_ville: '',
    region: '',
    code_agence: ''
  });

  useEffect(() => {
    if (isEditing) {
      fetchAgence();
    } else {
      generateNextCode();
    }
  }, [id]);

  useEffect(() => {
    const code = formData.ville ? (VILLE_CODES[formData.ville] || '') : '';
    setFormData(prev => ({ ...prev, code_ville: code }));
  }, [formData.ville]);

  const fetchAgence = async () => {
    try {
      const res = await api.get('/admin/agences-physiques');
      const agence = res.data.agences.find(a => a.id === parseInt(id));
      if (agence) {
        setFormData({
          nom: agence.nom,
          ville: agence.ville,
          code_ville: agence.code_ville || '',
          region: agence.region || '',
          code_agence: agence.code_agence,
        });
      }
    } catch (err) {
      toast.error("Erreur lors du chargement de l'agence");
    } finally {
      setLoading(false);
    }
  };

  const generateNextCode = async () => {
    try {
      const res = await api.get('/admin/agences-physiques');
      const agences = res.data.agences;
      let nextCode = '001';
      if (agences.length > 0) {
        const codes = agences.map(a => parseInt(a.code_agence)).filter(n => !isNaN(n));
        const maxCode = codes.length > 0 ? Math.max(...codes) : 0;
        nextCode = (maxCode + 1).toString().padStart(3, '0').slice(-3);
      }
      setFormData(prev => ({ ...prev, code_agence: nextCode }));
    } catch (err) {
      //
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing) {
        await api.put(`/admin/agences-physiques/${id}`, formData);
        toast.success('Agence mise à jour avec succès');
      } else {
        await api.post('/admin/agences-physiques', formData);
        toast.success('Agence créée avec succès');
      }
      navigate('/admin/agences-physiques');
    } catch (err) {
      if (err.response?.data?.errors?.code_agence) {
        toast.error(err.response.data.errors.code_agence[0]);
      } else {
        toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <button 
          onClick={() => navigate('/admin/agences-physiques')}
          style={{ width: 45, height: 45, borderRadius: '50%', background: '#ffffff', border: '1px solid rgba(124,105,97,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateX(-3px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
        >
          <HiOutlineArrowLeft size={20} color="#7c6961" />
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d4a017', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(212,160,23,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
              Administration
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f1929', margin: 0, letterSpacing: '-0.02em' }}>
            {isEditing ? "Modifier l'Agence" : 'Nouvelle Agence Physique'}
          </h1>
        </div>
      </div>

      {/* Large Form Card */}
      <div style={{ background: '#ffffff', borderRadius: '1.5rem', border: '1px solid rgba(124,105,97,0.08)', boxShadow: '0 10px 40px rgba(124,105,97,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '2.5rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0eeeb' }}>
            <div style={{ width: 50, height: 50, borderRadius: '1rem', background: 'rgba(212,160,23,0.15)', color: '#d4a017', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              <HiOutlineOfficeBuilding />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f1929', margin: 0 }}>Détails de l'agence</h2>
              <p style={{ color: '#7c6961', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>Remplissez les informations géographiques et d'identification.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* ROW 1: Region & Ville */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c6961', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Région <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select 
                  value={formData.region} 
                  onChange={e => setFormData({ ...formData, region: e.target.value, ville: '' })} 
                  required 
                  style={{ width: '100%', padding: '1rem 1.25rem', background: '#faf9f6', border: '1px solid rgba(124,105,97,0.15)', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f1929', outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#d4a017'}
                  onBlur={e => e.target.style.borderColor = 'rgba(124,105,97,0.15)'}
                >
                  <option value="">-- Sélectionner une région --</option>
                  {Object.keys(REGIONS_VILLES).map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c6961', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ville <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select 
                  value={formData.ville} 
                  onChange={e => setFormData({ ...formData, ville: e.target.value })} 
                  required 
                  disabled={!formData.region}
                  style={{ width: '100%', padding: '1rem 1.25rem', background: formData.region ? '#faf9f6' : '#f0eeeb', border: '1px solid rgba(124,105,97,0.15)', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f1929', outline: 'none', cursor: formData.region ? 'pointer' : 'not-allowed', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#d4a017'}
                  onBlur={e => e.target.style.borderColor = 'rgba(124,105,97,0.15)'}
                >
                  <option value="">-- Sélectionner une ville --</option>
                  {formData.region && REGIONS_VILLES[formData.region]?.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROW 2: Nom de l'agence */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c6961', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Nom de l'Agence <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input 
                type="text" 
                value={formData.nom} 
                onChange={e => setFormData({ ...formData, nom: e.target.value })} 
                required 
                placeholder="Ex: Agence Casablanca - Gauthier" 
                style={{ width: '100%', padding: '1rem 1.25rem', background: '#faf9f6', border: '1px solid rgba(124,105,97,0.15)', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f1929', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#d4a017'}
                onBlur={e => e.target.style.borderColor = 'rgba(124,105,97,0.15)'}
              />
            </div>

            {/* ROW 3: Codes générés */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '1.5rem', background: '#fcfcfc', border: '1px dashed rgba(124,105,97,0.2)', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c6961', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Code de la Ville (Généré)
                </label>
                <input 
                  type="text" 
                  value={formData.code_ville} 
                  readOnly
                  placeholder="Généré automatiquement" 
                  style={{ width: '100%', padding: '1rem 1.25rem', background: '#f0eeeb', border: '1px solid rgba(124,105,97,0.1)', borderRadius: '1rem', fontSize: '1.2rem', fontWeight: 900, color: '#7c6961', outline: 'none', cursor: 'not-allowed', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c6961', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Code de l'Agence (Généré)
                </label>
                <input 
                  type="text" 
                  value={formData.code_agence} 
                  readOnly
                  placeholder="Ex: 001" 
                  style={{ width: '100%', padding: '1rem 1.25rem', background: '#f0eeeb', border: '1px solid rgba(124,105,97,0.1)', borderRadius: '1rem', fontSize: '1.2rem', fontWeight: 900, color: '#7c6961', outline: 'none', cursor: 'not-allowed', fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button 
                type="button" 
                onClick={() => navigate('/admin/agences-physiques')}
                style={{ padding: '1rem 2rem', borderRadius: '1rem', background: 'transparent', color: '#7c6961', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.color = '#0f1929'}
                onMouseLeave={e => e.currentTarget.style.color = '#7c6961'}
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={submitting}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', borderRadius: '1rem', background: 'linear-gradient(135deg, #d4a017 0%, #b8963e 100%)', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', boxShadow: '0 10px 20px rgba(212,160,23,0.3)', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(212,160,23,0.4)'; } }}
                onMouseLeave={e => { if (!submitting) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(212,160,23,0.3)'; } }}
              >
                {submitting ? <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }}></div> : <><HiOutlineCheck size={20} /> {isEditing ? 'Enregistrer les modifications' : "Créer l'Agence"}</>}
              </button>
            </div>

          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
