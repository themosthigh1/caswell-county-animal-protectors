import React from 'react';
import HeroSection from '../components/home/HeroSection';
import StatsBanner from '../components/home/StatsBanner';
import ImpactSection from '../components/home/ImpactSection';
import FeaturedPets from '../components/home/FeaturedPets';
import DonateCallout from '../components/home/DonateCallout';
import { Phone, MapPin, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsBanner />
      <ImpactSection />
      <FeaturedPets />
      <DonateCallout />

      {/* Visit Us Section */}
      <section className="py-20 bg-cyan-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-black text-gray-900 mb-3">Visit Us</h2>
            <p className="text-gray-700 text-xl font-semibold">We'd love to meet you and your future pet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-700/20 backdrop-blur-md rounded-2xl p-7 shadow-sm ring-1 ring-cyan-500/20 text-center hover:ring-cyan-500/40 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black text-gray-900 mb-2 text-lg">Our Location</h3>
              <p className="text-gray-700 text-base leading-relaxed font-medium">836 County Home Road<br />Yanceyville, NC 27379</p>
            </div>
            <div className="bg-slate-700/20 backdrop-blur-md rounded-2xl p-7 shadow-sm ring-1 ring-cyan-500/20 text-center hover:ring-cyan-500/40 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black text-gray-900 mb-3 text-lg">Hours</h3>
              <table className="text-base text-gray-700 font-medium mx-auto">
                <tbody>
                  <tr><td className="pr-3 pb-1 text-right font-semibold">Mon, Tue, Thu, Fri</td><td className="pb-1">12pm – 4pm</td></tr>
                  <tr><td className="pr-3 pb-1 text-right font-semibold">Saturday</td><td className="pb-1">10am – 2pm</td></tr>
                  <tr><td className="pr-3 text-right font-semibold text-cyan-700">Wed & Sun</td><td className="text-cyan-700">Closed</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-slate-700/20 backdrop-blur-md rounded-2xl p-7 shadow-sm ring-1 ring-cyan-500/20 text-center hover:ring-cyan-500/40 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-black text-gray-900 mb-2 text-lg">Give Us a Call</h3>
              <a href="tel:3366944921" className="text-cyan-700 font-black text-2xl hover:text-cyan-800 transition-colors">
                (336) 694-4921
              </a>
              <p className="text-gray-700 text-sm mt-2 font-medium">During shelter hours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}