import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { PawPrint, Search, MessageSquare, Heart } from 'lucide-react';
import PetListingsTab from '../components/admin/PetListingsTab';
import MessagesTab from '../components/admin/MessagesTab';
import LostFoundTab from '../components/admin/LostFoundTab';

const TABS = [
  { id: 'pets', label: 'Pet Listings', icon: PawPrint },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'donations', label: 'Donations', icon: Heart },
  { id: 'lostfound', label: 'Lost & Found', icon: Search },
];

export default function Admin() {
  const [tab, setTab] = useState('pets');
  const { data: user } = useQuery({ queryKey: ['auth'], queryFn: () => base44.auth.me() });
  const { data: pets = [] } = useQuery({ queryKey: ['admin-pets'], queryFn: () => base44.entities.Pet.list('-created_date', 200) });
  const { data: messages = [] } = useQuery({ queryKey: ['admin-messages'], queryFn: () => base44.entities.ContactMessage.list('-created_date', 200) });
  const { data: donations = [] } = useQuery({ queryKey: ['admin-donations'], queryFn: () => base44.entities.Donation.list('-created_date', 100) });
  const { data: reports = [] } = useQuery({ queryKey: ['admin-lf'], queryFn: () => base44.entities.LostFoundReport.list('-created_date', 200) });

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

        {tab === 'pets' && <PetListingsTab />}

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

    </div>
  );
}