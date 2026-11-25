import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { PageView } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageView, sectionId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="font-display text-lg font-bold text-white">
              HomeCare Services
            </h3>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400">
              Reliable doorstep home maintenance, repair, and cleaning services with
              transparent fixed pricing, flexible time slots, and instant booking
              tracking.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-white">
              Quick Links
            </h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Services
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  User Login
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('signup')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin-login')}
                  className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Admin Login
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-white">
              Contact Info
            </h4>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                <span className="tabular-nums">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                <span>support@homeservices.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                <span>24 MG Road, Civic Center, Pune 411001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HomeCare Services. All rights reserved.</p>
          <p>Online Home Services Booking System</p>
        </div>
      </div>
    </footer>
  );
};
