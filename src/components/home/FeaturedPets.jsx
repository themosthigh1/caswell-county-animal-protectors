import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import PetCard from '../pets/PetCard';
import { ArrowRight, PawPrint } from 'lucide-react';

export default function FeaturedPets() {
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['featured-pets'],
    queryFn: () => base44.entities.Pet.filter({ status: 'available', featured: true }, '-created_date', 6),
  });

  const { data: allAvailable = [], isLoading: loadingAll } = useQuery({
    queryKey: ['available-pets-count'],
    queryFn: () => base44.entities.Pet.filter({ status: 'available' }),
    enabled: pets.length === 0 && !isLoading,
  });

  const displayPets = pets.length > 0 ? pets : allAvailable.slice(0, 6);
  const loading = isLoading || (pets.length === 0 && loadingAll);

  return (
    <section className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm mb-2">
              <PawPrint className="w-4 h-4" /> FIND YOUR MATCH
            </div>
            <h2 className="text-4xl font-black text-gray-900">Meet Our Animals</h2>
            <p className="text-gray-500 mt-2 text-lg">Every one of them is waiting for someone just like you.</p>
          </div>
          <Link
            to={createPageUrl('Adopt')}
            className="inline-flex items-center gap-2 text-green-700 font-bold hover:text-green-800 transition-colors group whitespace-nowrap"
          >
            View All Animals <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow animate-pulse">
                <div className="h-56 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : displayPets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPets.map(pet => <PetCard key={pet.id} pet={pet} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <PawPrint className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Check back soon — new animals arrive frequently!</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to={createPageUrl('Adopt')}
            className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-lg"
          >
            See All Adoptable Animals <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}