import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Heart, Search, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1920&q=80)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24">
        <div className="max-w-2xl text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Animal Protection Society of Caswell County
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-none mb-6 tracking-tight">
            Give Them<br />
            Their <span className="text-amber-400">Forever</span><br />
            Home.
          </h1>

          <p className="text-lg sm:text-xl text-white/85 leading-relaxed mb-10 max-w-lg">
            Loving dogs, cats, and small animals in Yanceyville, NC are waiting for a family just like yours. Your next best friend is here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              to={createPageUrl('Adopt')}
              className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-xl"
            >
              Meet Our Animals <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to={createPageUrl('Donate')}
              className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-xl"
            >
              <Heart className="w-5 h-5" /> Donate Now
            </Link>
          </div>

          <Link
            to={createPageUrl('LostFound')}
            className="inline-flex items-center gap-2 text-white/70 hover:text-amber-400 text-sm transition-colors"
          >
            <Search className="w-4 h-4" /> Lost your pet? Report it here →
          </Link>
        </div>
      </div>
    </section>
  );
}