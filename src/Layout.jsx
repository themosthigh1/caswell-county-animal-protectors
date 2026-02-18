import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { Phone, MapPin, Clock, Menu, X, Heart, PawPrint } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

const NAV_LINKS = [
  { label: 'Home', page: 'Home' },
  { label: 'Adopt', page: 'Adopt' },
  { label: 'Lost & Found', page: 'LostFound' },
  { label: 'Services', page: 'Services' },
  { label: 'Contact', page: 'Contact' },
];

export default function Layout({ children, currentPageName }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: authData } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return { user, isAdmin: user?.role === 'admin' };
      } catch {
        return { user: null, isAdmin: false };
      }
    }
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const allLinks = authData?.isAdmin
    ? [...NAV_LINKS, { label: 'Admin', page: 'Admin' }]
    : NAV_LINKS;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Top Info Bar */}
      <div className="bg-slate-900/50 backdrop-blur-md text-white text-xs py-3 px-4 hidden sm:block border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-5">
            <a href="tel:3366944921" className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <Phone className="w-3 h-3" /> (336) 694-4921
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-cyan-400" />
              836 County Home Road, Yanceyville, NC 27379
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="w-3 h-3" />
            Mon/Tue/Thu/Fri: 12–4pm &bull; Sat: 10am–2pm &bull; Wed & Sun: Closed
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`bg-white sticky top-0 z-50 border-b transition-shadow ${scrolled ? 'shadow-md border-gray-200' : 'shadow-sm border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-green-700 group-hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-green-800">Animal Protection Society</div>
                <div className="text-xs text-gray-500 font-medium">Caswell County, NC</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {allLinks.map(link => (
                <Link
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPageName === link.page
                      ? 'bg-green-50 text-green-700 font-semibold'
                      : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={createPageUrl('Donate')}
                className={`ml-2 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow ${
                  currentPageName === 'Donate'
                    ? 'bg-orange-700 text-white'
                    : 'bg-orange-600 hover:bg-orange-700 text-white hover:scale-105'
                }`}
              >
                <Heart className="w-4 h-4" /> Donate
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-1">
            {allLinks.map(link => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPageName === link.page ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={createPageUrl('Donate')}
              className="block mt-2 text-center bg-orange-600 hover:bg-orange-700 text-white font-bold px-4 py-3 rounded-full transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              ❤️ Donate Now
            </Link>
            <div className="pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1 px-1">
              <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> (336) 694-4921</div>
              <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Mon/Tue/Thu/Fri: 12–4pm • Sat: 10am–2pm</div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-green-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold">Animal Protection Society</div>
                  <div className="text-xs text-green-300">Caswell County</div>
                </div>
              </div>
              <p className="text-green-200 text-sm leading-relaxed">
                Rescuing, sheltering, and rehoming animals in Caswell County. Every animal deserves a loving home.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-green-300">Quick Links</h4>
              <ul className="space-y-2.5">
                {[...NAV_LINKS, { label: 'Donate', page: 'Donate' }].map(link => (
                  <li key={link.page}>
                    <Link to={createPageUrl(link.page)} className="text-sm text-green-200 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-green-300">Contact Us</h4>
              <ul className="space-y-3 text-sm text-green-200">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                  <span>836 County Home Road<br />Yanceyville, NC 27379</span>
                </li>
                <li>
                  <a href="tel:3366944921" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone className="w-4 h-4 text-green-400" />
                    (336) 694-4921
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-green-300">Hours</h4>
              <table className="text-sm text-green-200 w-full">
                <tbody>
                  <tr><td className="pr-3 py-1">Mon, Tue, Thu, Fri</td><td>12pm – 4pm</td></tr>
                  <tr><td className="pr-3 py-1">Saturday</td><td>10am – 2pm</td></tr>
                  <tr><td className="pr-3 py-1 text-green-400">Wednesday</td><td className="text-green-400">Closed</td></tr>
                  <tr><td className="pr-3 py-1 text-green-400">Sunday</td><td className="text-green-400">Closed</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="border-t border-green-800/60">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-green-400">
            <span>© 2024 Animal Protection Society of Caswell County. All rights reserved.</span>
            <span>Made with ❤️ for the animals of Caswell County</span>
          </div>
        </div>
      </footer>
    </div>
  );
}