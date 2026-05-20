import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineKey } from 'react-icons/hi';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, changePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    try {
      await changePassword(currentPassword, newPassword, confirmPassword);
      const routes = { admin: '/admin', siege: '/siege', agence: '/agence', guichetier: '/agence' };
      navigate(routes[user.role] || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg__shape login-bg__shape--1" />
        <div className="login-bg__shape login-bg__shape--2" />
        <div className="login-bg__shape login-bg__shape--3" />
      </div>
      <div className="login-card">
        <div className="login-card__header">
          <div className="login-card__logo"><HiOutlineKey size={24} /></div>
          <h1>Nouveau Mot de Passe</h1>
          <p>Pour des raisons de sécurité, veuillez modifier votre mot de passe</p>
        </div>
        <form onSubmit={handleSubmit} className="login-card__form">
          <div className="form-group">
            <label>Mot de passe actuel</label>
            <div className="input-wrapper">
              <HiOutlineLockClosed className="input-icon" />
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <div className="input-wrapper">
              <HiOutlineLockClosed className="input-icon" />
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={8} />
            </div>
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <div className="input-wrapper">
              <HiOutlineLockClosed className="input-icon" />
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? <span className="spinner-sm" /> : 'Mettre à jour'}
          </button>
        </form>
      </div>
    </div>
  );
}
