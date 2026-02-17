import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Heart, Syringe, Utensils, Home } from 'lucide-react';

const IMPACT = [
  { icon: Utensils, label: '$25 feeds an animal for a month' },
  { icon: Syringe, label: '$50 covers vaccinations' },
  { icon: Heart, label: '$100 funds spay or neuter surgery' },
  { icon: Home, label: '$250 sponsors a full rescue & adoption' },
];

export default function DonateCallout() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ backgroundImage: `url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-green-900/88" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
          <Heart className="w-4 h-4 text-rose-400" /> Every Dollar Makes a Difference
        </div>
        <h2 className="text-4xl sm:text-5xl font-black mb-5 leading-tight">
          Your Donation Saves Lives
        </h2>
        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          The Animal Protection Society of Caswell County runs entirely on the generosity of donors like you.
          Your support pays for food, medical care, and second chances for animals in need.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {IMPACT.map(({ icon: Icon, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/15">
              <Icon className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-xs text-white/80 leading-snug">{label}</p>
            </div>
          ))}
        </div>
        <Link
          to={createPageUrl('Donate')}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white font-black text-xl px-12 py-5 rounded-full transition-all hover:scale-105 shadow-2xl"
        >
          <Heart className="w-6 h-6" /> Donate Today
        </Link>
      </div>
    </section>
  );
}