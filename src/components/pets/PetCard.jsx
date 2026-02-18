import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Heart, BadgeCheck } from 'lucide-react';

const PLACEHOLDER = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&q=80',
  bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80',
  other: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&q=80',
};

export default function PetCard({ pet }) {
  const photo = pet.photo_url || PLACEHOLDER[pet.species] || PLACEHOLDER.other;
  const age = pet.age_years
    ? `${pet.age_years}yr${pet.age_years !== 1 ? 's' : ''}${pet.age_months ? ` ${pet.age_months}mo` : ''}`
    : pet.age_months ? `${pet.age_months}mo` : 'Unknown age';

  return (
    <Link
      to={createPageUrl(`PetDetail?id=${pet.id}`)}
      className="group bg-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden ring-1 ring-cyan-500/20 hover:ring-cyan-500/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={photo}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {pet.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" /> Featured
          </div>
        )}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold ${
          pet.status === 'available' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white' :
          pet.status === 'pending' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' :
          'bg-slate-600 text-white'
        }`}>
          {pet.status === 'available' ? 'Available' : pet.status === 'pending' ? 'Pending' : pet.status}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{pet.name}</h3>
          <Heart className="w-5 h-5 text-slate-500 group-hover:text-fuchsia-400 transition-colors flex-shrink-0 mt-0.5" />
        </div>
        <p className="text-sm text-slate-400 mb-3">
          {pet.breed || pet.species?.charAt(0).toUpperCase() + pet.species?.slice(1)} &bull; {age} &bull; {pet.sex}
        </p>
        {pet.description && (
          <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed">{pet.description}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {pet.vaccinated && <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-0.5 rounded-full font-medium">Vaccinated</span>}
          {pet.spayed_neutered && <span className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full font-medium">Fixed</span>}
          {pet.good_with_kids && <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full font-medium">Good w/ kids</span>}
          {pet.special_needs && <span className="bg-fuchsia-500/20 text-fuchsia-300 text-xs px-2 py-0.5 rounded-full font-medium">Special needs</span>}
        </div>
      </div>
    </Link>
  );
}