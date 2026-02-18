import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, CheckCircle, MapPin, Phone, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&q=80';

function ReportForm({ onClose, type }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ type, species: 'dog', date_occurred: '', location: '', contact_name: '', contact_phone: '', contact_email: '', color_markings: '', breed: '', description: '', pet_name: '' });
  const [photo, setPhoto] = useState(null);
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      let photo_url = '';
      if (photo) {
        const res = await base44.integrations.Core.UploadFile({ file: photo });
        photo_url = res.file_url;
      }
      return base44.entities.LostFoundReport.create({ ...data, photo_url });
    },
    onSuccess: () => { setSent(true); queryClient.invalidateQueries({ queryKey: ['lost-found'] }); },
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  if (sent) return (
    <div className="text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold mb-2">Report Submitted!</h3>
      <p className="text-gray-500 mb-6 text-sm">Your report is now live. We hope {type === 'lost' ? 'your pet finds their way home' : 'the owner sees this'} soon.</p>
      <button onClick={onClose} className="bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition-colors">Done</button>
    </div>
  );

  return (
    <form onSubmit={e => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Pet Name {type === 'found' && <span className="text-gray-400">(if known)</span>}</label>
          <input value={form.pet_name} onChange={e => set('pet_name', e.target.value)} placeholder="e.g. Max" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Species *</label>
          <select required value={form.species} onChange={e => set('species', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300">
            {['dog','cat','rabbit','bird','other','unknown'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Breed / Description</label>
          <input value={form.breed} onChange={e => set('breed', e.target.value)} placeholder="e.g. Labrador mix" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Color & Markings</label>
          <input value={form.color_markings} onChange={e => set('color_markings', e.target.value)} placeholder="e.g. Black w/ white chest" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Last Seen / Found Location *</label>
        <input required value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Near Main St & Oak Ave, Yanceyville" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Date {type === 'lost' ? 'Lost' : 'Found'} *</label>
          <input required type="date" value={form.date_occurred} onChange={e => set('date_occurred', e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Photo</label>
          <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files[0])} className="w-full text-xs px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none" />
        </div>
      </div>
      <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Any other details (collar, tags, microchip, behavior...)..." rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input required value={form.contact_name} onChange={e => set('contact_name', e.target.value)} placeholder="Your name *" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
        <input required value={form.contact_phone} onChange={e => set('contact_phone', e.target.value)} placeholder="Your phone *" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
        <input type="email" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} placeholder="Your email (optional)" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300" />
      </div>
      <button type="submit" disabled={mutation.isPending} className={`w-full font-bold py-3 rounded-full text-white transition-colors ${type === 'lost' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'} disabled:opacity-60`}>
        {mutation.isPending ? 'Submitting…' : `Submit ${type === 'lost' ? 'Lost' : 'Found'} Pet Report`}
      </button>
    </form>
  );
}

function ReportCard({ report }) {
  const photo = report.photo_url || PLACEHOLDER;
  const date = report.date_occurred ? format(new Date(report.date_occurred), 'MMM d, yyyy') : '';
  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm ring-1 ${report.type === 'lost' ? 'ring-rose-100' : 'ring-amber-100'}`}>
      <div className="relative">
        <img src={photo} alt={report.pet_name || 'Pet'} className="w-full h-44 object-cover" />
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${report.type === 'lost' ? 'bg-rose-600' : 'bg-amber-600'}`}>
          {report.type === 'lost' ? '🔍 LOST' : '🐾 FOUND'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900">{report.pet_name || `${report.species?.charAt(0).toUpperCase()}${report.species?.slice(1)} (Unknown Name)`}</h3>
        <p className="text-sm text-gray-500 mb-2">{[report.breed, report.color_markings].filter(Boolean).join(' • ')}</p>
        {report.location && <p className="text-xs text-gray-600 flex items-center gap-1 mb-1"><MapPin className="w-3 h-3 text-gray-400" /> {report.location}</p>}
        {date && <p className="text-xs text-gray-500 flex items-center gap-1 mb-2"><Calendar className="w-3 h-3 text-gray-400" /> {report.type === 'lost' ? 'Lost' : 'Found'} {date}</p>}
        {report.description && <p className="text-xs text-gray-600 line-clamp-2 mb-3">{report.description}</p>}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-700">{report.contact_name}</p>
          <a href={`tel:${report.contact_phone}`} className="text-xs text-green-700 font-bold hover:underline flex items-center gap-1 mt-0.5">
            <Phone className="w-3 h-3" /> {report.contact_phone}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function LostFound() {
  const [tab, setTab] = useState('lost');
  const [showForm, setShowForm] = useState(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ['lost-found'],
    queryFn: () => base44.entities.LostFoundReport.filter({ status: 'active' }, '-created_date', 100),
  });

  const lost = reports.filter(r => r.type === 'lost');
  const found = reports.filter(r => r.type === 'found');
  const current = tab === 'lost' ? lost : found;

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white py-16 px-4 border-b border-cyan-500/20">
        <div className="max-w-5xl mx-auto text-center">
          <Search className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
          <h1 className="text-5xl font-black mb-4">Lost & Found Pets</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Lost your pet? Found a stray in Caswell County? Post a report and help reunite animals with their families.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <button onClick={() => setShowForm('lost')} className="bg-gradient-to-r from-rose-600 to-pink-600 hover:shadow-lg hover:shadow-rose-500/50 text-white font-bold px-8 py-3.5 rounded-full transition-colors">
              🔍 Report a Lost Pet
            </button>
            <button onClick={() => setShowForm('found')} className="bg-gradient-to-r from-amber-600 to-orange-600 hover:shadow-lg hover:shadow-amber-500/50 text-white font-bold px-8 py-3.5 rounded-full transition-colors">
              🐾 Report a Found Pet
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-4 mb-8 border-b border-cyan-500/20">
          {[['lost', `Lost (${lost.length})`], ['found', `Found (${found.length})`]].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setTab(val)}
              className={`pb-3 font-bold text-sm transition-all border-b-2 -mb-px ${tab === val ? (val === 'lost' ? 'border-rose-500 text-rose-400' : 'border-amber-500 text-amber-400') : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <div key={i} className="bg-slate-800/40 backdrop-blur-md rounded-2xl h-72 animate-pulse border border-cyan-500/20" />)}
          </div>
        ) : current.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {current.map(r => <ReportCard key={r.id} report={r} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500">
            <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No {tab} pet reports at this time.</p>
            <p className="text-sm mt-1">Be the first to help — post a report above.</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(null)}>
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl w-full max-w-xl max-h-[95vh] overflow-y-auto shadow-2xl p-6 sm:p-8 border border-cyan-500/20" onClick={e => e.stopPropagation()}>
            <h2 className={`text-2xl font-black mb-6 ${showForm === 'lost' ? 'text-rose-400' : 'text-amber-400'}`}>
              {showForm === 'lost' ? '🔍 Report a Lost Pet' : '🐾 Report a Found Pet'}
            </h2>
            <ReportForm type={showForm} onClose={() => setShowForm(null)} />
          </div>
        </div>
      )}
    </div>
  );
}