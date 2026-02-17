import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Sparkles } from 'lucide-react';

export default function PetForm({ pet, onClose, onSaved }) {
  const [form, setForm] = useState(pet || {
    name: '', species: 'dog', sex: 'male', status: 'available',
    featured: false, vaccinated: false, spayed_neutered: false,
    microchipped: false, good_with_kids: false, good_with_dogs: false,
    good_with_cats: false, special_needs: false
  });
  const [photo, setPhoto] = useState(null);
  const [generatingBio, setGeneratingBio] = useState(false);
  const queryClient = useQueryClient();

  const handleGenerateBio = async () => {
    setGeneratingBio(true);
    const res = await base44.functions.invoke('generatePetBio', {
      name: form.name, species: form.species, breed: form.breed,
      age_years: form.age_years, age_months: form.age_months, sex: form.sex,
      size: form.size, color: form.color, temperament: form.temperament,
      good_with_kids: form.good_with_kids, good_with_dogs: form.good_with_dogs,
      good_with_cats: form.good_with_cats, vaccinated: form.vaccinated,
      spayed_neutered: form.spayed_neutered, microchipped: form.microchipped,
      special_needs: form.special_needs, special_needs_description: form.special_needs_description,
    });
    if (res.data?.bio) set('description', res.data.bio);
    setGeneratingBio(false);
  };

  const mutation = useMutation({
    mutationFn: async (data) => {
      let photo_url = form.photo_url || '';
      if (photo) {
        const res = await base44.integrations.Core.UploadFile({ file: photo });
        photo_url = res.file_url;
      }
      const payload = { ...data, photo_url };
      return pet?.id ? base44.entities.Pet.update(pet.id, payload) : base44.entities.Pet.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pets'] });
      onSaved();
      onClose();
    },
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-black">{pet ? 'Edit Pet' : 'Add New Pet'}</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Species *</label>
              <select value={form.species} onChange={e => set('species', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                {['dog','cat','rabbit','bird','other'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Sex</label>
              <select value={form.sex} onChange={e => set('sex', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                <option value="male">Male</option><option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Size</label>
              <select value={form.size || ''} onChange={e => set('size', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                <option value="">Unknown</option>
                {['small','medium','large','extra_large'].map(s => <option key={s} value={s}>{s.replace('_',' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
                {['available','pending','adopted','foster'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Breed</label>
              <input value={form.breed || ''} onChange={e => set('breed', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Adoption Fee ($)</label>
              <input type="number" value={form.adoption_fee || ''} onChange={e => set('adoption_fee', parseFloat(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Age (years)</label>
              <input type="number" min="0" value={form.age_years || ''} onChange={e => set('age_years', parseFloat(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Age (months)</label>
              <input type="number" min="0" max="11" value={form.age_months || ''} onChange={e => set('age_months', parseFloat(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
            <textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Temperament / Personality</label>
            <input value={form.temperament || ''} onChange={e => set('temperament', e.target.value)} placeholder="e.g. Playful, loves cuddles, great with kids" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Photo</label>
            <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-xl" />
          </div>
          <div className="flex flex-wrap gap-4">
            {[['featured','Featured'],['vaccinated','Vaccinated'],['spayed_neutered','Spayed/Neutered'],['microchipped','Microchipped'],['good_with_kids','Good w/ Kids'],['good_with_dogs','Good w/ Dogs'],['good_with_cats','Good w/ Cats'],['special_needs','Special Needs']].map(([k, l]) => (
              <label key={k} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={!!form[k]} onChange={e => set(k, e.target.checked)} className="accent-green-700 w-4 h-4" /> {l}
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 border border-gray-200 rounded-full font-semibold text-sm text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button type="submit" disabled={mutation.isPending} className="flex-1 bg-green-700 hover:bg-green-600 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors text-sm">
              {mutation.isPending ? 'Saving…' : (pet ? 'Save Changes' : 'Add Pet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}