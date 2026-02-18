import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Heart, Stethoscope, Search } from 'lucide-react';

const CARDS = [
  {
    icon: Heart,
    color: 'bg-gradient-to-br from-fuchsia-400 to-pink-500',
    ring: 'ring-fuchsia-500/30',
    title: 'Adopt a Pet',
    body: 'Give a deserving animal a safe, loving home. Browse dogs, cats, rabbits and more currently available for adoption at our shelter.',
    cta: 'Browse Animals',
    page: 'Adopt',
    ctaClass: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:shadow-lg hover:shadow-fuchsia-500/50 text-white',
  },
  {
    icon: Stethoscope,
    color: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    ring: 'ring-cyan-500/30',
    title: 'Spay & Neuter Services',
    body: 'Help control the pet population and improve animal health. We provide low-cost spay/neuter and medical services to Caswell County residents.',
    cta: 'Learn More',
    page: 'Services',
    ctaClass: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 text-white',
  },
  {
    icon: Search,
    color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    ring: 'ring-blue-500/30',
    title: 'Lost or Found a Pet?',
    body: 'Lost your beloved companion? Found a stray? Our Lost & Found board helps reunite animals with their families in Caswell County.',
    cta: 'Report Now',
    page: 'LostFound',
    ctaClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/50 text-white',
  },
];

export default function ImpactSection() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-white mb-3">How We Help</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            The Animal Protection Society of Caswell County has been a lifeline for homeless and injured animals in our community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map(({ icon: Icon, color, ring, title, body, cta, page, ctaClass }) => (
            <div key={title} className={`rounded-2xl p-8 ring-1 ${ring} bg-slate-800/40 backdrop-blur-md shadow-sm hover:ring-opacity-60 transition-all hover:bg-slate-800/60`}>
              <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-5 text-white`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">{body}</p>
              <Link
                to={createPageUrl(page)}
                className={`inline-flex items-center font-semibold text-sm px-5 py-2.5 rounded-full transition-all ${ctaClass}`}
              >
                {cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}