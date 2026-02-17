import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { X, Phone, MapPin, CheckCircle, Heart, Syringe, Dog } from 'lucide-react';

const PLACEHOLDER = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80',
  bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80',
};

export default function PetDetailModal({ pet, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const photo = pet.photo_url || PLACEHOLDER[pet.species] || PLACEHOLDER.other;
  const age = pet.age_years
    ? `${pet.age_years} year${pet.age_years !== 1 ? 's' : ''}${pet.age_months ? ` ${pet.age_months} months` : ''}`
    : pet.age_months ? `${pet.age_months} months` : 'Unknown age';

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.ContactMessage.create(data),
    onSuccess: () => setSent(true),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      ...form,
      subject: `Adoption Inquiry: ${pet.name}`,
      inquiry_type: 'adoption',
      message: form.message || `I'm interested in adopting ${pet.name}.`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-3xl sm:rounded-2xl overflow-hidden max-h-[95vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <img src={photo} alt={pet.name} className="w-full h-64 sm:h-80 object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors">
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <div className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-bold ${pet.status === 'available' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>
            {pet.status === 'available' ? '✓ Available' : pet.status}
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-1">{pet.name}</h2>
            <p className="text-gray-500 mb-5">
              {pet.breed || pet.species} &bull; {age} &bull; {pet.sex}
              {pet.adoption_fee ? ` &bull; $${pet.adoption_fee} adoption fee` : ''}
            </p>

            {pet.description && (
              <p className="text-gray-700 leading-relaxed mb-6 text-sm">{pet.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {pet.vaccinated && <span className="bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1"><Syringe className="w-3 h-3" /> Vaccinated</span>}
              {pet.spayed_neutered && <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">Fixed</span>}
              {pet.microchipped && <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">Microchipped</span>}
              {pet.good_with_kids && <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">Good w/ kids</span>}
              {pet.good_with_dogs && <span className="bg-orange-50 text-orange-700 text-xs px-3 py-1 rounded-full font-medium">Good w/ dogs</span>}
              {pet.good_with_cats && <span className="bg-pink-50 text-pink-700 text-xs px-3 py-1 rounded-full font-medium">Good w/ cats</span>}
            </div>

            {pet.temperament && (
              <p className="text-sm text-gray-600 italic">"{pet.temperament}"</p>
            )}

            <div className="mt-6 p-4 bg-green-50 rounded-xl text-sm text-green-800">
              <strong className="flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5" /> Come meet {pet.name}</strong>
              836 County Home Road, Yanceyville, NC<br />
              <a href="tel:3366944921" className="flex items-center gap-1 font-bold mt-1 hover:underline"><Phone className="w-3.5 h-3.5" /> (336) 694-4921</a>
            </div>
          </div>

          <div>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Inquiry Sent!</h3>
                <p className="text-gray-500 text-sm">We'll be in touch soon about {pet.name}. Feel free to call us too at (336) 694-4921.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" /> Interested in {pet.name}?
                </h3>
                <p className="text-sm text-gray-500">Send us a message and we'll reach out to arrange a visit.</p>
                {['name', 'email', 'phone'].map(field => (
                  <input
                    key={field}
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={field === 'name' ? 'Your name *' : field === 'email' ? 'Your email *' : 'Your phone (optional)'}
                    required={field !== 'phone'}
                    value={form[field]}
                    onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                ))}
                <textarea
                  placeholder={`Tell us about yourself and why ${pet.name} is a great match...`}
                  rows={4}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                />
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors"
                >
                  {mutation.isPending ? 'Sending…' : `Inquire About ${pet.name}`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}