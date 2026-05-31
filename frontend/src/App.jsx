import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SiegeManagement from './pages/admin/SiegeManagement';
import CreateSiegeMember from './pages/admin/CreateSiegeMember';
import GuichetierManagement from './pages/admin/GuichetierManagement';
import CreateGuichetier from './pages/admin/CreateGuichetier';
import AgencesPhysiquesManagement from './pages/admin/AgencesPhysiquesManagement';
import AddAgencePhysique from './pages/admin/AddAgencePhysique';
import AgenceDetails from './pages/admin/AgenceDetails';
import SiegeDashboard from './pages/siege/SiegeDashboard';
import ProductManagement from './pages/siege/ProductManagement';
import PackManagement from './pages/siege/PackManagement';
import AccountTypeManagement from './pages/siege/AccountTypeManagement';
import CreateAccountType from './pages/siege/CreateAccountType';
import OffresActuelles from './pages/siege/OffresActuelles';
import ConsulterAgences from './pages/siege/ConsulterAgences';
import AgenceDashboard from './pages/agence/AgenceDashboard';
import AccountManagement from './pages/agence/AccountManagement';
import Profile from './pages/agence/Profile';
import AccountDetail from './pages/agence/AccountDetail';
import DepositPage from './pages/agence/DepositPage';
import DepositReceipt from './pages/agence/DepositReceipt';
import WithdrawalSelection from './pages/agence/WithdrawalSelection';
import WithdrawalPersonal from './pages/agence/WithdrawalPersonal';
import WithdrawalPersonalConfirmation from './pages/agence/WithdrawalPersonalConfirmation';
import WithdrawalCheque from './pages/agence/WithdrawalCheque';
import WithdrawalChequeConfirmation from './pages/agence/WithdrawalChequeConfirmation';
import WithdrawalPersonalReceipt from './pages/agence/WithdrawalPersonalReceipt';
import AccountHistory from './pages/agence/AccountHistory';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  const routes = { admin: '/admin', siege: '/siege', agence: '/agence/dashboard', guichetier: '/agence/dashboard' };
  return <Navigate to={routes[user.role] || '/login'} replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/change-password" element={
            <ProtectedRoute>
              <ChangePasswordPage />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sieges" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <SiegeManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/sieges/nouveau" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <CreateSiegeMember />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/guichetiers" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <GuichetierManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/guichetiers/nouveau" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <CreateGuichetier />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/agences-physiques" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AgencesPhysiquesManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/agences-physiques/add" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AddAgencePhysique />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/agences-physiques/edit/:id" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AddAgencePhysique />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin/agence/:id" element={
            <ProtectedRoute roles={['admin']}>
              <Layout>
                <AgenceDetails />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Siege Routes */}
          <Route path="/siege" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <SiegeDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/siege/products" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <ProductManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/siege/packs" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <PackManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/siege/account-types" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <AccountTypeManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/siege/account-types/nouveau" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <CreateAccountType />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/siege/offres" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <OffresActuelles />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/siege/account-types/modifier/:id" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <CreateAccountType />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/siege/agences" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <ConsulterAgences />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/siege/agence/:id" element={
            <ProtectedRoute roles={['siege']}>
              <Layout>
                <AgenceDetails />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Agence Routes (Accessible for both 'agence' and 'guichetier') */}
          <Route path="/agence/dashboard" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <AgenceDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/comptes" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <AccountManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/dashboard/ouvrir-compte" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <AccountManagement openAccountModal={true} standalone={true} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/dashboard/nouveau-client" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <AccountManagement openClientModal={true} standalone={true} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/dashboard/consulter-clients" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <AccountManagement initialTab="clients" hideTabs={true} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/dashboard/gestion-comptes" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <AccountManagement initialTab="accounts" hideTabs={true} />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/dashboard/comptes/:id" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <AccountDetail />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/comptes/:id/historique" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <AccountHistory />
              </Layout>
            </ProtectedRoute>
          } />
          {/* Deposit Routes */}
          <Route path="/agence/dashboard/depot" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <DepositPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/dashboard/retrait" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <WithdrawalSelection />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/retrait/personnel" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <WithdrawalPersonal />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/retrait/personnel/confirmation" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <WithdrawalPersonalConfirmation />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/retrait/cheque" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <WithdrawalCheque />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/retrait/cheque/confirmation" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <WithdrawalChequeConfirmation />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/retrait/personnel/recu/:id" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <WithdrawalPersonalReceipt />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/agence/dashboard/depot-recu/:id" element={
            <ProtectedRoute roles={['agence', 'guichetier']}>
              <Layout>
                <DepositReceipt />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
