import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import SpaceBackgroundClean from './components/SpaceBackgroundClean';
import EarthViewer from './components/EarthViewer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AsteroidDetail from './pages/AsteroidDetail';
import Watchlist from './pages/Watchlist';
import Alerts from './pages/Alerts';
import Profile from './pages/Profile';
import HowItWorks from './pages/HowItWorks';
import Footer from './components/Footer';
import Help from './components/Help';
import Tutorial from './components/Tutorial';
import TutorialMenu from './components/TutorialMenu';
import SoundControls from './components/SoundControls';
import { TutorialProvider } from './contexts/TutorialContext';
import { SoundProvider } from './contexts/SoundContext';
import './styles/index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// Routes with conditional footer
const RoutesWithFooter = () => {
  const location = useLocation();
  const isEarthViewer = location.pathname === '/earth';

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/asteroid/:id"
          element={
            <ProtectedRoute>
              <AsteroidDetail />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/watchlist"
          element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/alerts"
          element={
            <ProtectedRoute>
              <Alerts />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/earth"
          element={
            <ProtectedRoute>
              <EarthViewer />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/how-it-works"
          element={
            <ProtectedRoute>
              <HowItWorks />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isEarthViewer && <Footer />}
      <Help />
      <Tutorial />
      <TutorialMenu />
      <SoundControls />
    </>
  );
};

function AppContent() {
  return (
    <Router>
      <RoutesWithFooter />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <TutorialProvider>
        <SoundProvider>
          <SpaceBackgroundClean />
          <AppContent />
        </SoundProvider>
      </TutorialProvider>
    </AuthProvider>
  );
}

export default App;
