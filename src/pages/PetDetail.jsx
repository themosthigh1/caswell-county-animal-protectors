import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import {
  ArrowLeft, MapPin, Phone, CheckCircle, Heart, Syringe,
  Calendar, Tag, Ruler, Palette, Star, AlertCircle
} from 'lucide-react';
import PetImageGallery from '../components/pets/PetImageGallery';
import PetImageManager from '../components/admin/PetImageManager';

const PLACEHOLDER = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80',
  bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80',
};

const STATUS_COLORS = {
  available: 'bg-green-600',
  pending: 'bg-amber-500',
  adopted: 'bg-gray-500',
  foster: 'bg-blue-500',
};

export default function PetDetail() {
  const params = new URLSearchParams(window.location.search);
  const petId = params.get('id');

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => base44.entities.Pet.get(petId),
    enabled: !!petId,
  });

  const { data: authData } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return { user, isAdmin: user?.role === 'admin' };
      } catch {
        return { user: null, isAdmin: false };
      }
    }
  });

  const isAdmin = authData?.isAdmin;

  const inquiryMutation = useMutation({
    mutationFn: (data) => base44.entities.ContactMessage.create(data),
    onSuccess: () => setSent(true),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    inquiryMutation.mutate({
      ...form,
      subject: `Adoption Inquiry: ${pet.name}`,
      inquiry_type: 'adoption',
      message: form.message || `I'm interested in adopting ${pet.name}.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading…</div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-xl font-semibold">Pet not found</p>
        <Link to={createPageUrl('Adopt')} className="text-green-700 hover:underline text-sm">← Back to listings</Link>
      </div>
    );
  }

  const age = pet.age_years
    ? `${pet.age_years} year${pet.age_years !== 1 ? 's' : ''}${pet.age_months ? ` ${pet.age_months} mo` : ''}`
    : pet.age_months ? `${pet.age_months} months` : 'Unknown age';

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
          <Link
            to={createPageUrl('Adopt')}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-green-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Adoptable Pets
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left: Gallery + Admin Image Manager */}
          <div className="space-y-5">
            <PetImageGallery pet={pet} />
            {isAdmin && <PetImageManager pet={pet} />}
          </div>

          {/* Right: Info + Inquiry */}
          <div className="space-y-6">
            {/* Name & Status */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900">{pet.name}</h1>
                <span className={`mt-1.5 px-3 py-1 rounded-full text-sm font-bold text-white flex-shrink-0 ${STATUS_COLORS[pet.status] || 'bg-gray-500'}`}>
                  {pet.status?.charAt(0).toUpperCase() + pet.status?.slice(1)}
                </span>
              </div>
              <p className="text-gray-500 text-lg">
                {pet.breed || pet.species?.charAt(0).toUpperCase() + pet.species?.slice(1)}
                {pet.featured && (
                  <span className="ml-2 inline-flex items-center gap-1 text-amber-500 text-sm font-semibold">
                    <Star className="w-4 h-4 fill-current" /> Featured
                  </span>
                )}
              </p>
              {pet.adoption_fee > 0 && (
                <p className="text-green-700 font-bold text-xl mt-1">${pet.adoption_fee} adoption fee</p>
              )}
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Tag, label: 'Age', value: age },
                { icon: Heart, label: 'Sex', value: pet.sex?.charAt(0).toUpperCase() + pet.sex?.slice(1) },
                { icon: Ruler, label: 'Size', value: pet.size?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) },
                { icon: Palette, label: 'Color', value: pet.color },
                { icon: Calendar, label: 'Intake', value: pet.intake_date },
                { icon: Tag, label: 'Species', value: pet.species?.charAt(0).toUpperCase() + pet.species?.slice(1) },
              ].filter(f => f.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl p-3 ring-1 ring-gray-100">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-0.5">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </div>
                  <div className="font-semibold text-gray-800 text-sm">{value}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {pet.vaccinated && <span className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1"><Syringe className="w-3 h-3" /> Vaccinated</span>}
              {pet.spayed_neutered && <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium">Spayed/Neutered</span>}
              {pet.microchipped && <span className="bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-full font-medium">Microchipped</span>}
              {pet.good_with_kids && <span className="bg-amber-50 text-amber-700 text-xs px-3 py-1.5 rounded-full font-medium">Good w/ kids</span>}
              {pet.good_with_dogs && <span className="bg-orange-50 text-orange-700 text-xs px-3 py-1.5 rounded-full font-medium">Good w/ dogs</span>}
              {pet.good_with_cats && <span className="bg-pink-50 text-pink-700 text-xs px-3 py-1.5 rounded-full font-medium">Good w/ cats</span>}
              {pet.special_needs && <span className="bg-rose-50 text-rose-700 text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Special needs</span>}
            </div>

            {/* Description */}
            {pet.description && (
              <div>
                <h2 className="font-bold text-gray-900 mb-2">About {pet.name}</h2>
                <p className="text-gray-600 leading-relaxed text-sm">{pet.description}</p>
              </div>
            )}

            {/* Temperament */}
            {pet.temperament && (
              <div className="bg-amber-50 rounded-xl p-4">
                <p className="text-amber-800 text-sm italic">"{pet.temperament}"</p>
              </div>
            )}

            {/* Special needs */}
            {pet.special_needs && pet.special_needs_description && (
              <div className="bg-rose-50 rounded-xl p-4">
                <h3 className="font-bold text-rose-800 text-sm mb-1 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> Special Needs
                </h3>
                <p className="text-rose-700 text-sm">{pet.special_needs_description}</p>
              </div>
            )}

            {/* Location */}
            <div className="bg-green-50 rounded-xl p-4 text-sm text-green-800">
              <strong className="flex items-center gap-1.5 mb-1"><MapPin className="w-4 h-4" /> Come meet {pet.name}</strong>
              836 County Home Road, Yanceyville, NC 27379<br />
              <a href="tel:3366944921" className="flex items-center gap-1.5 font-bold mt-1.5 hover:underline">
                <Phone className="w-3.5 h-3.5" /> (336) 694-4921
              </a>
            </div>

            {/* Inquiry Form */}
            {pet.status === 'available' && (
              <div className="bg-white rounded-2xl ring-1 ring-gray-100 shadow-sm p-6">
                {sent ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Inquiry Sent!</h3>
                    <p className="text-gray-500 text-sm">We'll be in touch soon about {pet.name}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
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
                      placeholder={`Tell us about yourself and why ${pet.name} is a great match…`}
                      rows={3}
                      value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={inquiryMutation.isPending}
                      className="w-full bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors"
                    >
                      {inquiryMutation.isPending ? 'Sending…' : `Inquire About ${pet.name}`}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}