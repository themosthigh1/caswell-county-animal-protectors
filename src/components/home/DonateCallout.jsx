import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../../utils';
import { Heart, Syringe, Utensils, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const IMPACT = [
  { icon: Utensils, label: '$25 feeds an animal for a month' },
  { icon: Syringe, label: '$50 covers vaccinations' },
  { icon: Heart, label: '$100 funds spay or neuter surgery' },
  { icon: Home, label: '$250 sponsors a full rescue & adoption' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function DonateCallout() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ backgroundImage: `url(https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" 
      />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm"
        >
          <Heart className="w-4 h-4 text-fuchsia-400" /> Every Dollar Makes a Difference
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black mb-5 leading-tight"
        >
          Your Donation Saves Lives
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          The Animal Protection Society of Caswell County runs entirely on the generosity of donors like you.
          Your support pays for food, medical care, and second chances for animals in need.
        </motion.p>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        >
          {IMPACT.map(({ icon: Icon, label }) => (
            <motion.div 
              key={label}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-slate-800/40 backdrop-blur rounded-xl p-4 border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
            >
              <Icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs text-slate-300 leading-snug">{label}</p>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to={createPageUrl('Donate')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:shadow-lg hover:shadow-fuchsia-500/50 text-white font-black text-xl px-12 py-5 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            <Heart className="w-6 h-6" /> Donate Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
