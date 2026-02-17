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
      <section className="py-20 bg-stone-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3">Visit Us</h2>
            <p className="text-gray-500 text-lg">We'd love to meet you and your future pet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-7 shadow-sm ring-1 ring-gray-100 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Our Location</h3>
              <p className="text-gray-500 text-sm leading-relaxed">836 County Home Road<br />Yanceyville, NC 27379</p>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-sm ring-1 ring-gray-100 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-3">Hours</h3>
              <table className="text-sm text-gray-500 mx-auto">
                <tbody>
                  <tr><td className="pr-3 pb-1 text-right font-medium">Mon, Tue, Thu, Fri</td><td className="pb-1">12pm – 4pm</td></tr>
                  <tr><td className="pr-3 pb-1 text-right font-medium">Saturday</td><td className="pb-1">10am – 2pm</td></tr>
                  <tr><td className="pr-3 text-right font-medium text-rose-400">Wed & Sun</td><td className="text-rose-400">Closed</td></tr>
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-2xl p-7 shadow-sm ring-1 ring-gray-100 text-center">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-green-700" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Give Us a Call</h3>
              <a href="tel:3366944921" className="text-green-700 font-bold text-xl hover:text-green-600 transition-colors">
                (336) 694-4921
              </a>
              <p className="text-gray-400 text-xs mt-2">During shelter hours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}