import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export type PageView =
  | 'home'
  | 'services'
  | 'login'
  | 'admin-login'
  | 'signup'
  | 'booking'
  | 'user-dashboard'
  | 'admin-dashboard';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView, sectionId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { session, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLink = (page: PageView, sectionId?: string) => {
    setMobileOpen(false);
    onNavigate(page, sectionId);
  };

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    onNavigate('home');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleLink('home')}
          className="font-display text-lg font-extrabold tracking-tight text-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
        >
          HomeCare Services
        </button>

        {/* Zone 2: Single-line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => handleLink('home')}
            className={`transition-colors hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'home' ? 'text-blue-700 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => handleLink('services')}
            className={`transition-colors hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'services' ? 'text-blue-700 font-semibold' : ''
            }`}
          >
            Services
          </button>

          {!session ? (
            <>
              <button
                type="button"
                onClick={() => handleLink('home', 'about-section')}
                className="transition-colors hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
              >
                About
              </button>
              <button
                type="button"
                onClick={() => handleLink('login')}
                className={`transition-colors hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer ${
                  currentPage === 'login' || currentPage === 'admin-login'
                    ? 'text-blue-700 font-semibold'
                    : ''
                }`}
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() =>
                  handleLink(
                    session.role === 'admin' ? 'admin-dashboard' : 'user-dashboard'
                  )
                }
                className={`transition-colors hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer ${
                  currentPage === 'user-dashboard' || currentPage === 'admin-dashboard'
                    ? 'text-blue-700 font-semibold'
                    : ''
                }`}
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="transition-colors hover:text-rose-600 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="hidden md:flex items-center shrink-0">
          {!session ? (
            <button
              type="button"
              onClick={() => handleLink('signup')}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Sign Up
            </button>
          ) : session.role === 'user' ? (
            <button
              type="button"
              onClick={() => handleLink('booking')}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Book Service
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleLink('admin-dashboard')}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Admin Panel
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="md:hidden rounded-lg p-2 text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleLink('home')}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => handleLink('services')}
              className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Services
            </button>
            {!session ? (
              <>
                <button
                  type="button"
                  onClick={() => handleLink('login')}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  User Login
                </button>
                <button
                  type="button"
                  onClick={() => handleLink('admin-login')}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => handleLink('signup')}
                  className="mt-1 rounded-lg bg-blue-700 px-3 py-2.5 text-center text-sm font-medium text-white"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() =>
                    handleLink(
                      session.role === 'admin' ? 'admin-dashboard' : 'user-dashboard'
                    )
                  }
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-700 hover:bg-blue-50"
                >
                  Dashboard ({session.name})
                </button>
                {session.role === 'user' && (
                  <button
                    type="button"
                    onClick={() => handleLink('booking')}
                    className="rounded-lg bg-blue-700 px-3 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Book Service
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
