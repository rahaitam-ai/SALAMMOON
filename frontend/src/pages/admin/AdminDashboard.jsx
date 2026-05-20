import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  Users,
  Building2,
  TrendingUp,
  CreditCard,
  Briefcase,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Clock,
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  Activity,
  Plus,
  RefreshCw,
  Award,
  ChevronRight,
  Eye
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setData(res.data);
    } catch (err) {
      toast.error('Erreur lors du chargement du tableau de bord');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-[#FDFBF7]">
        <div className="w-10 h-10 border-4 border-[#D4A017] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-[#7C6961] animate-pulse">Initialisation du tableau de bord haute performance...</p>
      </div>
    );
  }

  const stats = data?.stats;
  const recentAgences = data?.recent_agences || [];
  const topAgences = data?.top_agences || [];

  // ── Real monthly data from API ──────────────────────────────────────────
  const months          = data?.monthly_labels    || [];
  const clientsMonthly  = data?.clients_per_month  || [];
  const accountsMonthly = data?.accounts_per_month || [];

  // Evolution of Created Accounts Chart Data (REAL)
  const accountsChartData = {
    labels: months,
    datasets: [
      {
        label: 'Comptes créés',
        data: accountsMonthly,
        borderColor: '#D4A017',
        backgroundColor: 'rgba(212, 160, 23, 0.08)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#D4A017',
      }
    ]
  };

  // Evolution of Clients Chart Data (REAL)
  const clientsChartData = {
    labels: months,
    datasets: [
      {
        label: 'Nouveaux clients',
        data: clientsMonthly,
        borderColor: '#1E1E1E',
        backgroundColor: 'rgba(30, 30, 30, 0.04)',
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#1E1E1E',
      }
    ]
  };

  // Statistics of Agencies Chart Data
  const agenciesChartData = {
    labels: ['Casa', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'],
    datasets: [
      {
        label: 'Nombre d\'Agences',
        data: [3, 2, 2, 1, 1, 1],
        backgroundColor: 'rgba(124, 105, 97, 0.85)',
        hoverBackgroundColor: '#7C6961',
        borderRadius: 6,
      }
    ]
  };

  return (
    <div className="space-y-8 animate-fadeIn bg-[#FDFBF7] p-2 min-h-screen">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 bg-white p-8 rounded-3xl border border-[#F2ECE4] shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#D4A017] uppercase tracking-wider mb-1">
            <span>Espace d'Administration</span>
            <span>•</span>
            <span className="text-[#7C6961]">Al Barid Bank</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#1E1E1E] tracking-tight">Tableau de Bord Exécutif</h1>
          <p className="text-sm text-[#7C6961] mt-1">Supervisez l'activité nationale, l'expansion du réseau d'agences et le volume global des opérations.</p>
        </div>

        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('/admin/sieges/nouveau')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl text-base font-extrabold bg-[#1E1E1E] hover:bg-[#333333] text-white transition-all shadow-lg hover:-translate-y-0.5 duration-200 cursor-pointer"
          >
            <Plus className="w-5.5 h-5.5 text-[#D4A017]" />
            <span>Nouveau Siège</span>
          </button>
          <button
            onClick={() => navigate('/admin/guichetiers/nouveau')}
            className="inline-flex items-center justify-center gap-3 px-8 py-4.5 rounded-2xl text-base font-extrabold bg-[#D4A017] hover:bg-[#be8f14] text-white transition-all shadow-lg hover:-translate-y-0.5 duration-200 cursor-pointer"
          >
            <Plus className="w-5.5 h-5.5 text-white" />
            <span>Nouveau Guichetier</span>
          </button>
          <button
            onClick={fetchDashboardData}
            className="p-3 rounded-xl bg-[#F9F6F0] text-[#7C6961] hover:bg-[#F2ECE4] transition-all border border-[#F2ECE4]"
            title="Actualiser les statistiques"
          >
            <RefreshCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* 5 STATISTICAL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Membres du siège */}
        <div className="bg-white rounded-2xl p-5 pl-7 border border-[#F2ECE4] shadow-sm relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 group-hover:scale-110 transition-transform">
            <Briefcase className="w-20 h-20 text-[#1E1E1E]" />
          </div>
          <span className="text-[10px] font-bold text-[#7C6961] uppercase tracking-wider pl-1.5">Membres Siège</span>
          <div className="flex items-end justify-between mt-3">
            <div>
              <h3 className="text-2xl font-black text-[#1E1E1E]">{stats?.total_sieges || 0}</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{stats?.active_sieges || 0} Actifs</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#F9F6F0] text-[#7C6961] flex items-center justify-center border border-[#F2ECE4]">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 2: Guichetiers */}
        <div className="bg-white rounded-2xl p-5 pl-7 border border-[#F2ECE4] shadow-sm relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 group-hover:scale-110 transition-transform">
            <Users className="w-20 h-20 text-[#1E1E1E]" />
          </div>
          <span className="text-[10px] font-bold text-[#7C6961] uppercase tracking-wider pl-1.5">Guichetiers</span>
          <div className="flex items-end justify-between mt-3">
            <div>
              <h3 className="text-2xl font-black text-[#1E1E1E]">{stats?.total_guichetiers || 0}</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{stats?.active_guichetiers || 0} Actifs</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#F9F6F0] text-[#7C6961] flex items-center justify-center border border-[#F2ECE4]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 3: Agences */}
        <div className="bg-white rounded-2xl p-5 pl-7 border border-[#F2ECE4] shadow-sm relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 group-hover:scale-110 transition-transform">
            <Building2 className="w-20 h-20 text-[#1E1E1E]" />
          </div>
          <span className="text-[10px] font-bold text-[#7C6961] uppercase tracking-wider pl-1.5">Agences</span>
          <div className="flex items-end justify-between mt-3">
            <div>
              <h3 className="text-2xl font-black text-[#1E1E1E]">{stats?.total_agences || 0}</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Réseau national</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#F9F6F0] text-[#D4A017] flex items-center justify-center border border-[#F2ECE4]">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Card 4: Clients */}
        <div className="bg-white rounded-2xl p-5 pl-7 border border-[#F2ECE4] shadow-sm relative overflow-hidden group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-5 group-hover:scale-110 transition-transform">
            <Layers className="w-20 h-20 text-[#1E1E1E]" />
          </div>
          <span className="text-[10px] font-bold text-[#7C6961] uppercase tracking-wider pl-1.5">Clients Banque</span>
          <div className="flex items-end justify-between mt-3">
            <div>
              <h3 className="text-2xl font-black text-[#1E1E1E]">{stats?.total_clients || 0}</h3>
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Portefeuille physique</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#F9F6F0] text-[#1E1E1E] flex items-center justify-center border border-[#F2ECE4]">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>


      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Evolution of Created Accounts Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2ECE4] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wider">Mouvements de Comptes</span>
              <h2 className="text-base font-bold text-[#1E1E1E] mt-0.5">Évolution des comptes créés</h2>
            </div>
            <span className="text-[10px] font-bold text-[#7C6961] bg-[#F9F6F0] px-2 py-1 rounded-md">Semestre 1</span>
          </div>
          <div className="flex-1 min-h-[220px]">
            <Line 
              data={accountsChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { grid: { color: '#FDFBF7' } }, x: { grid: { display: false } } }
              }} 
            />
          </div>
        </div>

        {/* Evolution of Clients Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2ECE4] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wider">Acquisition</span>
              <h2 className="text-base font-bold text-[#1E1E1E] mt-0.5">Évolution des clients</h2>
            </div>
            <span className="text-[10px] font-bold text-[#7C6961] bg-[#F9F6F0] px-2 py-1 rounded-md">Semestre 1</span>
          </div>
          <div className="flex-1 min-h-[220px]">
            <Line 
              data={clientsChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { grid: { color: '#FDFBF7' } }, x: { grid: { display: false } } }
              }} 
            />
          </div>
        </div>

        {/* Statistics of Agencies Chart */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2ECE4] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wider">Implantation</span>
              <h2 className="text-base font-bold text-[#1E1E1E] mt-0.5">Statistiques des agences</h2>
            </div>
            <span className="text-[10px] font-bold text-[#7C6961] bg-[#F9F6F0] px-2 py-1 rounded-md">Par région</span>
          </div>
          <div className="flex-1 min-h-[220px]">
            <Bar 
              data={agenciesChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { grid: { color: '#FDFBF7' } }, x: { grid: { display: false } } }
              }} 
            />
          </div>
        </div>

      </div>

      {/* AGENCIES SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Dernières agences ajoutées */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2ECE4] shadow-sm lg:col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wider">Réseau physique</span>
              <h2 className="text-lg font-black text-[#1E1E1E] mt-0.5">Dernières agences ajoutées</h2>
            </div>
            <button onClick={() => navigate('/admin/agences-physiques')} className="text-xs text-[#D4A017] hover:underline font-bold flex items-center gap-1">
              <span>Voir tout</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-[#F2ECE4] text-left text-xs">
              <thead>
                <tr className="text-[#7C6961] uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-3">Nom</th>
                  <th className="py-3.5 px-3">Ville</th>
                  <th className="py-3.5 px-3">Code Agence</th>
                  <th className="py-3.5 px-3 text-center">Statut</th>
                  <th className="py-3.5 px-3 text-center">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentAgences.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400 font-medium">Aucune agence physique enregistrée</td>
                  </tr>
                ) : (
                  recentAgences.map((ag) => (
                    <tr key={ag.id} className="hover:bg-[#F9F6F0]/50 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-[#1E1E1E]">{ag.nom}</td>
                      <td className="py-3.5 px-3 text-[#7C6961] font-semibold">{ag.ville}</td>
                      <td className="py-3.5 px-3 font-mono text-gray-500 font-bold">{ag.code_agence}</td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          ag.is_active ? 'bg-emerald-100 text-[#1E8E5A]' : 'bg-red-100 text-red-600'
                        }`}>
                          {ag.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => navigate(`/admin/agence/${ag.id}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.3rem 0.75rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            borderRadius: '0.4rem',
                            backgroundColor: 'var(--primary)',
                            color: '#1e1e1e',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(250,211,31,0.2)',
                          }}
                        >
                          <Eye className="w-3 h-3" /> Voir plus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 3 des agences avec le plus de clients */}
        <div className="bg-white p-6 rounded-3xl border border-[#F2ECE4] shadow-sm lg:col-span-2 flex flex-col">
          <div className="mb-6">
            <span className="text-[10px] font-bold text-[#D4A017] uppercase tracking-wider">Performance</span>
            <h2 className="text-lg font-black text-[#1E1E1E] mt-0.5">Top 3 des agences</h2>
            <p className="text-xs text-[#7C6961] mt-0.5">Agences avec le plus gros portefeuille de clients.</p>
          </div>

          <div className="space-y-5 flex-1 flex flex-col justify-center">
            {topAgences.length === 0 ? (
              <div className="text-center text-xs text-gray-400 py-8">Données d'acquisition insuffisantes</div>
            ) : (
              topAgences.map((ag, index) => {
                // Compute visual percentage for progress bar (max client number among top 3 or a standard scale)
                const maxClients = topAgences[0]?.clients_count || 1;
                const pct = Math.min(100, Math.max(10, Math.round((ag.clients_count / maxClients) * 100)));
                
                return (
                  <div key={ag.nom} className="space-y-2 p-3 bg-[#F9F6F0] rounded-2xl border border-[#F2ECE4] hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#1E1E1E] text-[#D4A017] flex items-center justify-center font-bold text-xs shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#1E1E1E] leading-tight">{ag.nom}</h4>
                          <span className="text-[10px] text-gray-400 font-semibold">{ag.ville}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-extrabold text-[#1E1E1E]">{ag.clients_count} clients</p>
                        <p className="text-[9px] text-[#7C6961] font-bold">{ag.accounts_count} comptes</p>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-[#E5DCD3] rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[#D4A017] h-full rounded-full transition-all duration-1000"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
