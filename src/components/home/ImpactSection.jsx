import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Heart, Stethoscope, Search } from 'lucide-react';

const CARDS = [
  {
    icon: Heart,
    color: 'bg-rose-50 text-rose-600',
    ring: 'ring-rose-100',
    title: 'Adopt a Pet',
    body: 'Give a deserving animal a safe, loving home. Browse dogs, cats, rabbits and more currently available for adoption at our shelter.',
    cta: 'Browse Animals',
    page: 'Adopt',
    ctaClass: 'bg-rose-600 hover:bg-rose-700 text-white',
  },
  {
    icon: Stethoscope,
    color: 'bg-green-50 text-green-700',
    ring: 'ring-green-100',
    title: 'Spay & Neuter Services',
    body: 'Help control the pet population and improve animal health. We provide low-cost spay/neuter and medical services to Caswell County residents.',
    cta: 'Learn More',
    page: 'Services',
    ctaClass: 'bg-green-700 hover:bg-green-600 text-white',
  },
  {
    icon: Search,
    color: 'bg-amber-50 text-amber-600',
    ring: 'ring-amber-100',
    title: 'Lost or Found a Pet?',
    body: 'Lost your beloved companion? Found a stray? Our Lost & Found board helps reunite animals with their families in Caswell County.',
    cta: 'Report Now',
    page: 'LostFound',
    ctaClass: 'bg-amber-600 hover:bg-amber-700 text-white',
  },
];

export default function ImpactSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-gray-900 mb-3">How We Help</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            The Animal Protection Society of Caswell County has been a lifeline for homeless and injured animals in our community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CARDS.map(({ icon: Icon, color, ring, title, body, cta, page, ctaClass }) => (
            <div key={title} className={`rounded-2xl p-8 ring-1 ${ring} bg-white shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-5`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">{body}</p>
              <Link
                to={createPageUrl(page)}
                className={`inline-flex items-center font-semibold text-sm px-5 py-2.5 rounded-full transition-colors ${ctaClass}`}
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