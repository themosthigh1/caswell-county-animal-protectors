import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PetCard from '../components/pets/PetCard';
import { PawPrint, Search, SlidersHorizontal } from 'lucide-react';

const SPECIES = ['all', 'dog', 'cat', 'rabbit', 'bird', 'other'];
const SIZES = ['all', 'small', 'medium', 'large', 'extra_large'];

export default function Adopt() {
  const [species, setSpecies] = useState('all');
  const [size, setSize] = useState('all');
  const [search, setSearch] = useState('');


  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets-adopt'],
    queryFn: () => base44.entities.Pet.filter({ status: 'available' }, '-created_date', 100),
  });

  const filtered = pets.filter(p => {
    const matchSpecies = species === 'all' || p.species === species;
    const matchSize = size === 'all' || p.size === size;
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.breed?.toLowerCase().includes(search.toLowerCase());
    return matchSpecies && matchSize && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16 px-4 border-b border-cyan-500/20">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm font-semibold mb-3">
            <PawPrint className="w-4 h-4" /> ADOPTION CENTER
          </div>
          <h1 className="text-5xl font-black mb-4">Find Your New Best Friend</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Every animal in our shelter has a story. Be the next chapter. Browse available pets and find the one who speaks to your heart.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-700/20 backdrop-blur-md border-b border-cyan-500/20 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or breed…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/50 border border-cyan-500/30 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            {SPECIES.map(s => (
              <button
                key={s}
                onClick={() => setSpecies(s)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  species === s ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/50' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700/50'
                }`}
              >
                {s === 'all' ? 'All Animals' : s.charAt(0).toUpperCase() + s.slice(1) + 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-slate-700/20 rounded-2xl overflow-hidden animate-pulse backdrop-blur-md">
                <div className="h-56 bg-slate-600/30" />
                <div className="p-4 space-y-3"><div className="h-5 bg-slate-700/50 rounded w-1/2" /><div className="h-4 bg-slate-700/30 rounded w-3/4" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-slate-400 mb-6">{filtered.length} animal{filtered.length !== 1 ? 's' : ''} available</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(pet => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 text-slate-500">
            <PawPrint className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-semibold mb-2">No matches found</h3>
            <p>Try adjusting your filters or check back soon — new animals arrive frequently!</p>
          </div>
        )}
      </div>

      {/* Adoption Info */}
      <div className="bg-slate-700/20 backdrop-blur-md border-t border-cyan-500/20 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to Adopt?</h2>
          <p className="text-slate-300 mb-6 leading-relaxed max-w-2xl mx-auto">
            Visit us during shelter hours to meet your potential new companion. Bring valid ID and be prepared to discuss your living situation and pet experience. Adoption fees help cover vaccination, spay/neuter, and microchipping costs.
          </p>
          <div className="inline-block bg-slate-700/30 backdrop-blur-md rounded-2xl p-5 text-left shadow-sm text-sm text-slate-300 border border-cyan-500/20">
            <strong className="block mb-1 text-white">Shelter Hours</strong>
            Mon, Tue, Thu, Fri: 12pm – 4pm &nbsp;•&nbsp; Saturday: 10am – 2pm &nbsp;•&nbsp; Wed & Sun: Closed<br />
            <a href="tel:3366944921" className="font-bold text-cyan-400 hover:text-cyan-300">(336) 694-4921</a> &nbsp;•&nbsp; 836 County Home Road, Yanceyville, NC 27379
          </div>
        </div>
      </div>

    </div>
  );
}