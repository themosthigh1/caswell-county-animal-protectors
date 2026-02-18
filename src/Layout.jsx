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
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Info Bar */}
      <div className="bg-white/80 backdrop-blur-md text-gray-700 text-xs py-3 px-4 hidden sm:block border-b border-cyan-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4 flex-wrap">
          <div className="flex items-center gap-5">
            <a href="tel:3366944921" className="flex items-center gap-1.5 hover:text-cyan-600 transition-colors">
              <Phone className="w-3 h-3" /> (336) 694-4921
            </a>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-cyan-500" />
              836 County Home Road, Yanceyville, NC 27379
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Clock className="w-3 h-3" />
            Mon/Tue/Thu/Fri: 12–4pm &bull; Sat: 10am–2pm &bull; Wed & Sun: Closed
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 transition-all backdrop-blur-md ${scrolled ? 'bg-white/90 border-b border-cyan-200' : 'bg-white/70 border-b border-cyan-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 group-hover:shadow-lg group-hover:shadow-cyan-300/50 rounded-xl flex items-center justify-center transition-all">
                <PawPrint className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold text-gray-900">Animal Protection Society</div>
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
                      ? 'bg-cyan-100 text-cyan-700 font-semibold'
                      : 'text-gray-600 hover:text-cyan-600 hover:bg-cyan-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={createPageUrl('Donate')}
                className={`ml-2 flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  currentPageName === 'Donate'
                    ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg shadow-fuchsia-300/50'
                    : 'bg-gradient-to-r from-fuchsia-400 to-pink-400 hover:shadow-lg hover:shadow-fuchsia-300/50 text-white'
                }`}
              >
                <Heart className="w-4 h-4" /> Donate
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-cyan-100 text-cyan-600 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-cyan-200 bg-white/80 backdrop-blur-md px-4 pt-3 pb-5 space-y-1">
            {allLinks.map(link => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPageName === link.page ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600 hover:bg-cyan-50'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to={createPageUrl('Donate')}
              className="block mt-2 text-center bg-gradient-to-r from-fuchsia-400 to-pink-400 hover:shadow-lg hover:shadow-fuchsia-300/50 text-white font-bold px-4 py-3 rounded-full transition-all"
              onClick={() => setMobileOpen(false)}
            >
              ❤️ Donate Now
            </Link>
            <div className="pt-3 border-t border-cyan-200 text-xs text-gray-600 space-y-1 px-1">
              <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> (336) 694-4921</div>
              <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Mon/Tue/Thu/Fri: 12–4pm • Sat: 10am–2pm</div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-100 backdrop-blur-md border-t border-cyan-200 text-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-white" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-bold">Animal Protection Society</div>
                  <div className="text-xs text-cyan-600">Caswell County</div>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Rescuing, sheltering, and rehoming animals in Caswell County. Every animal deserves a loving home.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-cyan-600">Quick Links</h4>
              <ul className="space-y-2.5">
                {[...NAV_LINKS, { label: 'Donate', page: 'Donate' }].map(link => (
                  <li key={link.page}>
                    <Link to={createPageUrl(link.page)} className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-cyan-600">Contact Us</h4>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-cyan-500 flex-shrink-0" />
                  <span>836 County Home Road<br />Yanceyville, NC 27379</span>
                </li>
                <li>
                  <a href="tel:3366944921" className="flex items-center gap-2 hover:text-cyan-600 transition-colors">
                    <Phone className="w-4 h-4 text-cyan-500" />
                    (336) 694-4921
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-cyan-600">Hours</h4>
              <table className="text-sm text-gray-600 w-full">
                <tbody>
                  <tr><td className="pr-3 py-1">Mon, Tue, Thu, Fri</td><td>12pm – 4pm</td></tr>
                  <tr><td className="pr-3 py-1">Saturday</td><td>10am – 2pm</td></tr>
                  <tr><td className="pr-3 py-1 text-cyan-600">Wednesday</td><td className="text-cyan-600">Closed</td></tr>
                  <tr><td className="pr-3 py-1 text-cyan-600">Sunday</td><td className="text-cyan-600">Closed</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="border-t border-cyan-200">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <span>© 2024 Animal Protection Society of Caswell County. All rights reserved.</span>
            <span>Made with ❤️ for the animals of Caswell County</span>
          </div>
        </div>
      </footer>
    </div>
  );
}