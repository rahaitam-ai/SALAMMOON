import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HiOutlineUser, HiOutlineHome, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineCube, HiOutlineCollection, HiOutlineUserGroup, HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineClipboardList, HiOutlineKey, HiOutlineBell, HiOutlineLibrary, HiOutlineSearch, HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import logo from '../assets/al-barid-bank.jpg';
import AdminProfileDropdown from './AdminProfileDropdown';

const menuItems = {
  admin: [
    { path: '/admin', label: 'Tableau de Bord', icon: HiOutlineHome },
    { path: '/admin/sieges/nouveau', label: 'Ajouter Membre Siège', icon: HiOutlinePlus },
    { path: '/admin/guichetiers/nouveau', label: 'Ajouter un Guichetier', icon: HiOutlinePlus },
    { path: '/admin/sieges', label: 'Consultez Membres du Siège', icon: HiOutlineOfficeBuilding },
    { path: '/admin/guichetiers', label: 'Consulter les Guichetiers', icon: HiOutlineUsers },
    { path: '/admin/agences-physiques', label: 'Consulter les Agences', icon: HiOutlineOfficeBuilding },
  ],
  siege: [
    { path: '/siege', label: 'Tableau de Bord', icon: HiOutlineHome },
    { path: '/siege/packs', label: 'Ajouter Pack Bancaire', icon: HiOutlineCollection },
    { path: '/siege/account-types/nouveau', label: 'Ajouter un Type de Compte', icon: HiOutlinePlus },
    { path: '/siege/offres', label: 'Nos Packs Actuels', icon: HiOutlineCube },
    { path: '/siege/account-types', label: 'Types de Comptes', icon: HiOutlineLibrary },
    { path: '/siege/agences', label: 'Consulter les Agences', icon: HiOutlineOfficeBuilding },
  ],
  agence: [
    { path: '/agence/dashboard', label: 'Tableau de Bord', icon: HiOutlineHome },
    { path: '/agence/dashboard/ouvrir-compte', label: 'Ouvrir un Compte', icon: HiOutlineLibrary },
    { path: '/agence/dashboard/nouveau-client', label: 'Nouveau Client', icon: HiOutlineUserGroup },
    { path: '/agence/dashboard/consulter-clients', label: 'Consulter les Clients', icon: HiOutlineUsers },
    { path: '/agence/dashboard/gestion-comptes', label: 'Consulter les Comptes banquier', icon: HiOutlineClipboardList },
  ],
  guichetier: [
    { path: '/agence/dashboard', label: 'Tableau de Bord', icon: HiOutlineHome },
    { path: '/agence/dashboard/ouvrir-compte', label: 'Ouvrir un Compte', icon: HiOutlineLibrary },
    { path: '/agence/dashboard/nouveau-client', label: 'Nouveau Client', icon: HiOutlineUserGroup },
    { path: '/agence/dashboard/consulter-clients', label: 'Consulter les Clients', icon: HiOutlineUsers },
    { path: '/agence/dashboard/gestion-comptes', label: 'Consulter les Comptes banquier', icon: HiOutlineClipboardList },
  ],
};

const roleLabels = { admin: 'Administrateur', siege: 'Siège Central', agence: 'Agence', guichetier: 'Guichetier' };

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const items = menuItems[user?.role] || [];

  const handleLogout = async () => {
    await logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  return (
    <div className="layout">
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <Link to="/" className="sidebar__logo" onClick={() => setSidebarOpen(false)}>
            <div className="sidebar__logo-container">
              <img src={logo} alt="Al Barid Bank" className="sidebar__logo-img" />
            </div>
            <div className="sidebar__logo-text">
              <h1>Al Barid Bank</h1>
              <span>{roleLabels[user?.role]}</span>
            </div>
          </Link>
          <button className="sidebar__close" onClick={() => setSidebarOpen(false)}><HiOutlineX /></button>
        </div>
        <nav className="sidebar__nav">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`sidebar__link ${isActive ? 'sidebar__link--active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <Icon className="sidebar__link-icon" /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

      </aside>
      <div className="main">
        <header className="topbar">
          <button className="topbar__menu" onClick={() => setSidebarOpen(true)}><HiOutlineMenu /></button>
          <div className="topbar__spacer" />
          <div className="topbar__actions">
            <button className="topbar__btn"><HiOutlineBell /></button>
            <AdminProfileDropdown 
              user={user} 
              roleLabel={roleLabels[user?.role]} 
              onLogout={handleLogout} 
            />
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
