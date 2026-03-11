import React from 'react';
import { PawPrint, Heart, Home, Users } from 'lucide-react';

const STATS = [
{ icon: PawPrint, label: 'Animals in Our Care', value: '50+', color: 'text-cyan-400' },
{ icon: Heart, label: 'Adoptions This Year', value: '200+', color: 'text-fuchsia-400' },
{ icon: Home, label: 'Forever Homes Found', value: '1,000+', color: 'text-blue-400' },
{ icon: Users, label: 'Community Volunteers', value: '75+', color: 'text-pink-400' }];


export default function StatsBanner() {
  return (
    <section className="bg-white border-b border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ icon: Icon, label, value, color }) =>
          <div key={label} className="text-center group">
              <Icon className={`w-8 h-8 mx-auto mb-2 ${color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className={`text-3xl font-black ${color}`}>{value}</div>
              <div className="text-gray-600 mt-1 text-xs font-medium">{label}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}