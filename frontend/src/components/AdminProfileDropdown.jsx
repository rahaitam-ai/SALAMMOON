import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi';

export default function AdminProfileDropdown({ user, roleLabel, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    navigate('/profile');
  };

  const handleLogoutClick = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    onLogout();
  };

  const displayName = user?.name || (user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : 'Haitam RA');
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Trigger: Profile Card (Clicking opens dropdown) */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-white border border-slate-100 hover:border-[#d4a017]/30 hover:bg-[#fcfbf9] transition-all duration-300 cursor-pointer shadow-sm select-none"
      >
        <div className="relative">
          <div className="w-11 h-11 rounded-2xl bg-[#5d4e48] border-2 border-[#d4a017] text-white font-extrabold flex items-center justify-center text-xl shadow-sm transition-transform duration-300 hover:scale-105">
            {initial}
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
        </div>
        <div className="text-left hidden md:block">
          <p className="text-sm font-bold text-[#1e1e1e] leading-tight tracking-tight">
            {displayName}
          </p>
          <p className="text-[11px] font-extrabold text-[#d4a017] tracking-wider uppercase mt-0.5">
            {roleLabel || 'Administrateur'}
          </p>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          style={{ position: 'absolute', right: 0, top: '100%', marginTop: '12px', zIndex: 100 }}
          className="w-72 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden transform origin-top-right transition-all duration-200 ease-out animate-dropdown"
        >
          <style>{`
            @keyframes dropdown {
              from { opacity: 0; transform: translateY(-10px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-dropdown {
              animation: dropdown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
          
          <div className="p-5 border-b border-slate-50 bg-[#fcfbf9]/65">
            <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">Espace sécurisé</p>
            <p className="text-[15.5px] font-extrabold text-slate-800 truncate mt-1">{user?.email || 'admin@albaridbank.ma'}</p>
          </div>

          <div className="p-3.5 space-y-2">
            <button
              onClick={handleProfileClick}
              className="w-full flex items-center gap-4 px-4 py-3 text-base font-bold text-slate-700 hover:text-[#d4a017] hover:bg-[#fcfbf9] rounded-2xl transition-all duration-250 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#d4a017] flex items-center justify-center transition-colors duration-200">
                <HiOutlineUser size={20} />
              </div>
              <span>Mon Profil</span>
            </button>

            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-4 px-4 py-3 text-base font-bold text-[#b83232] hover:bg-red-50 rounded-2xl transition-all duration-250 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#b83232] flex items-center justify-center transition-colors duration-200">
                <HiOutlineLogout size={20} />
              </div>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
