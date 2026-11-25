import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ServiceItem } from './data/services';
import { Navbar, PageView } from './components/Navbar';
import { Footer } from './components/Footer';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Booking } from './pages/Booking';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { session, logout } = useApp();

  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    if (session?.role === 'admin') return 'admin-dashboard';
    if (session?.role === 'user') return 'user-dashboard';
    return 'home';
  });

  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(
    undefined
  );
  const [userDashboardTab, setUserDashboardTab] = useState<
    'overview' | 'browse' | 'book' | 'bookings' | 'payments' | 'reviews'
  >('overview');
  const [detailService, setDetailService] = useState<ServiceItem | null>(null);
  const [loginBanner, setLoginBanner] = useState('');
  const [prefillEmail, setPrefillEmail] = useState('');
  const [pendingRedirectAfterLogin, setPendingRedirectAfterLogin] =
    useState<PageView | null>(null);

  // Enforce role-based access guards whenever page or session changes
  useEffect(() => {
    if (currentPage === 'admin-dashboard') {
      if (!session) {
        setCurrentPage('admin-login');
      } else if (session.role !== 'admin') {
        setCurrentPage('user-dashboard');
      }
    } else if (currentPage === 'user-dashboard' || currentPage === 'booking') {
      if (!session) {
        setLoginBanner('Please log in as a user to continue with your booking.');
        setPendingRedirectAfterLogin(currentPage);
        setCurrentPage('login');
      } else if (session.role === 'admin') {
        setCurrentPage('admin-dashboard');
      }
    }
  }, [currentPage, session]);

  const handleNavigate = (page: PageView, sectionId?: string) => {
    // Role checks before navigation
    if (page === 'admin-dashboard' && session?.role !== 'admin') {
      if (session?.role === 'user') {
        setCurrentPage('user-dashboard');
        return;
      }
      setCurrentPage('admin-login');
      return;
    }

    if ((page === 'user-dashboard' || page === 'booking') && session?.role === 'admin') {
      setCurrentPage('admin-dashboard');
      return;
    }

    if ((page === 'user-dashboard' || page === 'booking') && !session) {
      setLoginBanner('Please log in with your user account first.');
      setPendingRedirectAfterLogin(page);
      setCurrentPage('login');
      return;
    }

    if (page === 'user-dashboard') {
      setUserDashboardTab('overview');
    }
    setLoginBanner('');
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
    }
  };

  const handleBookService = (service: ServiceItem) => {
    setSelectedServiceId(service.id);

    if (!session) {
      setLoginBanner(
        `Please sign in to book "${service.name}". You will be taken straight to the booking form.`
      );
      setPendingRedirectAfterLogin('booking');
      setCurrentPage('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (session.role === 'admin') {
      setCurrentPage('admin-dashboard');
      return;
    }

    setCurrentPage('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (role: 'user' | 'admin') => {
    setLoginBanner('');
    setPrefillEmail('');
    if (role === 'admin') {
      setPendingRedirectAfterLogin(null);
      setCurrentPage('admin-dashboard');
    } else if (pendingRedirectAfterLogin === 'booking') {
      setPendingRedirectAfterLogin(null);
      setCurrentPage('booking');
    } else {
      setPendingRedirectAfterLogin(null);
      setUserDashboardTab('overview');
      setCurrentPage('user-dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignupSuccess = (email: string) => {
    setPrefillEmail(email);
    setLoginBanner('Account created successfully! Please sign in to continue.');
    setCurrentPage('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDashboardLogout = () => {
    logout();
    setSelectedServiceId(undefined);
    setPendingRedirectAfterLogin(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      <div className="flex-1">
        {currentPage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onBookService={handleBookService}
            onViewDetails={(srv) => setDetailService(srv)}
          />
        )}

        {currentPage === 'services' && (
          <Services
            onBookService={handleBookService}
            onViewDetails={(srv) => setDetailService(srv)}
          />
        )}

        {(currentPage === 'login' || currentPage === 'admin-login') && (
          <Login
            initialMode={currentPage === 'admin-login' ? 'admin' : 'user'}
            bannerMessage={loginBanner}
            prefillEmail={prefillEmail}
            onSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'signup' && (
          <Signup
            onSuccess={handleSignupSuccess}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'booking' && session?.role === 'user' && (
          <Booking
            initialServiceId={selectedServiceId}
            onViewBookings={() => {
              setUserDashboardTab('bookings');
              setCurrentPage('user-dashboard');
            }}
          />
        )}

        {currentPage === 'user-dashboard' && session?.role === 'user' && (
          <UserDashboard
            initialTab={userDashboardTab}
            initialServiceId={selectedServiceId}
            onViewDetails={(srv) => setDetailService(srv)}
            onLogout={handleDashboardLogout}
          />
        )}

        {currentPage === 'admin-dashboard' && session?.role === 'admin' && (
          <AdminDashboard onLogout={handleDashboardLogout} />
        )}
      </div>

      <Footer onNavigate={handleNavigate} />

      <ServiceDetailModal
        service={detailService}
        onClose={() => setDetailService(null)}
        onBookNow={handleBookService}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
