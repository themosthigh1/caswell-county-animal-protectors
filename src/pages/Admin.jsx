import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PawPrint, Search, MessageSquare, Heart, CheckCircle } from 'lucide-react';
import PetListingsTab from '../components/admin/PetListingsTab';

const TABS = [
  { id: 'pets', label: 'Pet Listings', icon: PawPrint },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'donations', label: 'Donations', icon: Heart },
  { id: 'lostfound', label: 'Lost & Found', icon: Search },
];

function PetForm({ pet, onClose, onSaved }) {
  const [form, setForm] = useState(pet || { name: '', species: 'dog', sex: 'male', status: 'available', featured: false, vaccinated: false, spayed_neutered: false, microchipped: false, good_with_kids: false, good_with_dogs: false, good_with_cats: false, special_needs: false });
  const [photo, setPhoto] = useState(null);
  const queryClient = useQueryClient();

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
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-pets'] }); onSaved(); onClose(); },
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
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Name *</label><input required value={form.name} onChange={e => set('name', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Species *</label><select value={form.species} onChange={e => set('species', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300">{['dog','cat','rabbit','bird','other'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Sex</label><select value={form.sex} onChange={e => set('sex', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"><option value="male">Male</option><option value="female">Female</option></select></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Size</label><select value={form.size || ''} onChange={e => set('size', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"><option value="">Unknown</option>{['small','medium','large','extra_large'].map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</select></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Status</label><select value={form.status} onChange={e => set('status', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300">{['available','pending','adopted','foster'].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Breed</label><input value={form.breed || ''} onChange={e => set('breed', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Adoption Fee ($)</label><input type="number" value={form.adoption_fee || ''} onChange={e => set('adoption_fee', parseFloat(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Age (years)</label><input type="number" min="0" value={form.age_years || ''} onChange={e => set('age_years', parseFloat(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
            <div><label className="block text-xs font-semibold text-gray-600 mb-1">Age (months)</label><input type="number" min="0" max="11" value={form.age_months || ''} onChange={e => set('age_months', parseFloat(e.target.value))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
          </div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Description</label><textarea value={form.description || ''} onChange={e => set('description', e.target.value)} rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Temperament / Personality</label><input value={form.temperament || ''} onChange={e => set('temperament', e.target.value)} placeholder="e.g. Playful, loves cuddles, great with kids" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" /></div>
          <div><label className="block text-xs font-semibold text-gray-600 mb-1">Photo</label><input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-xl" /></div>
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

export default function Admin() {
  const [tab, setTab] = useState('pets');
  const [editPet, setEditPet] = useState(null);
  const [showPetForm, setShowPetForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({ queryKey: ['auth'], queryFn: () => base44.auth.me() });
  const { data: pets = [], isLoading: loadingPets } = useQuery({ queryKey: ['admin-pets'], queryFn: () => base44.entities.Pet.list('-created_date', 200) });
  const { data: messages = [], isLoading: loadingMsgs } = useQuery({ queryKey: ['admin-messages'], queryFn: () => base44.entities.ContactMessage.list('-created_date', 100) });
  const { data: donations = [] } = useQuery({ queryKey: ['admin-donations'], queryFn: () => base44.entities.Donation.list('-created_date', 100) });
  const { data: reports = [] } = useQuery({ queryKey: ['admin-lf'], queryFn: () => base44.entities.LostFoundReport.list('-created_date', 100) });

  const deletePet = useMutation({
    mutationFn: (id) => base44.entities.Pet.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pets'] }),
  });

  const updateMsg = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ContactMessage.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-messages'] }),
  });

  const resolveReport = useMutation({
    mutationFn: (id) => base44.entities.LostFoundReport.update(id, { status: 'resolved' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-lf'] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }) => base44.entities.Pet.update(id, { featured }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-pets'] }),
  });

  if (!user || user.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Access denied. Admins only.</div>;
  }

  const totalDonations = donations.reduce((s, d) => s + (d.amount || 0), 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-green-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black">Admin Dashboard</h1>
          <p className="text-green-300 text-sm mt-1">Animal Protection Society of Caswell County</p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { label: 'Pets Available', value: pets.filter(p => p.status === 'available').length },
              { label: 'Unread Messages', value: messages.filter(m => m.status === 'new').length },
              { label: 'Total Donations', value: `$${totalDonations.toLocaleString()}` },
              { label: 'Active Lost/Found', value: reports.filter(r => r.status === 'active').length },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl px-5 py-3 text-center">
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-xs text-green-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-gray-200 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${tab === id ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {tab === 'pets' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-black text-gray-900">Pet Listings ({pets.length})</h2>
              <button onClick={() => { setEditPet(null); setShowPetForm(true); }} className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
                <Plus className="w-4 h-4" /> Add Pet
              </button>
            </div>
            {loadingPets ? <div className="text-center py-12 text-gray-400">Loading…</div> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map(pet => (
                  <div key={pet.id} className="bg-white rounded-xl overflow-hidden shadow-sm ring-1 ring-gray-100">
                    <div className="relative">
                      <img src={pet.photo_url || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=60'} alt={pet.name} className="w-full h-36 object-cover" />
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white ${pet.status === 'available' ? 'bg-green-600' : pet.status === 'adopted' ? 'bg-gray-500' : 'bg-amber-500'}`}>{pet.status}</div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">{pet.name}</h3>
                          <p className="text-xs text-gray-500">{pet.breed || pet.species} • {pet.sex}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => toggleFeatured.mutate({ id: pet.id, featured: !pet.featured })} className={`p-1.5 rounded-lg transition-colors ${pet.featured ? 'text-amber-500 bg-amber-50' : 'text-gray-300 hover:text-amber-400'}`} title="Toggle featured">
                            {pet.featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setEditPet(pet); setShowPetForm(true); }} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => { if (confirm(`Delete ${pet.name}?`)) deletePet.mutate(pet.id); }} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'messages' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-5">Messages ({messages.length})</h2>
            {loadingMsgs ? <div className="text-center py-12 text-gray-400">Loading…</div> : (
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`bg-white rounded-xl p-5 shadow-sm ring-1 ${msg.status === 'new' ? 'ring-green-200 border-l-4 border-l-green-500' : 'ring-gray-100'}`}>
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-gray-800">{msg.name}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{msg.inquiry_type?.replace('_', ' ')}</span>
                          {msg.status === 'new' && <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">NEW</span>}
                        </div>
                        <p className="text-sm text-gray-500">{msg.email} {msg.phone && `• ${msg.phone}`}</p>
                        {msg.subject && <p className="text-sm font-semibold text-gray-700 mt-1">{msg.subject}</p>}
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{msg.message}</p>
                      </div>
                      <div className="flex gap-2">
                        {msg.status === 'new' && (
                          <button onClick={() => updateMsg.mutate({ id: msg.id, data: { status: 'read' } })} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-full transition-colors">
                            <CheckCircle className="w-3.5 h-3.5" /> Mark Read
                          </button>
                        )}
                        <a href={`mailto:${msg.email}`} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full transition-colors">Reply</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'donations' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Donations</h2>
            <p className="text-green-700 font-bold text-lg mb-5">Total Received: ${totalDonations.toLocaleString()}</p>
            <div className="space-y-2">
              {donations.map(d => (
                <div key={d.id} className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-100 flex justify-between items-center gap-4 flex-wrap">
                  <div>
                    <span className="font-bold text-gray-800">{d.anonymous ? 'Anonymous Donor' : d.donor_name}</span>
                    {!d.anonymous && <span className="text-sm text-gray-500 ml-2">{d.donor_email}</span>}
                    <div className="text-xs text-gray-400 mt-0.5">{d.purpose?.replace('_', ' ')} {d.message && `• "${d.message}"`}</div>
                  </div>
                  <span className="text-xl font-black text-green-700">${d.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'lostfound' && (
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-5">Lost & Found Reports ({reports.length})</h2>
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className={`bg-white rounded-xl p-4 shadow-sm ring-1 flex justify-between items-start gap-4 flex-wrap ${r.type === 'lost' ? 'ring-rose-100' : 'ring-amber-100'}`}>
                  <div className="flex gap-4">
                    {r.photo_url && <img src={r.photo_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${r.type === 'lost' ? 'bg-rose-600' : 'bg-amber-600'}`}>{r.type?.toUpperCase()}</span>
                        <span className="font-bold text-gray-800">{r.pet_name || `${r.species} (unnamed)`}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{r.status}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{r.location} • {r.contact_name} • {r.contact_phone}</p>
                    </div>
                  </div>
                  {r.status === 'active' && (
                    <button onClick={() => resolveReport.mutate(r.id)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 rounded-full transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showPetForm && (
        <PetForm pet={editPet} onClose={() => { setShowPetForm(false); setEditPet(null); }} onSaved={() => {}} />
      )}
    </div>
  );
}