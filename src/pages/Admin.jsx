import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { PawPrint, Search, MessageSquare, Heart } from 'lucide-react';
import PetListingsTab from '../components/admin/PetListingsTab';
import MessagesTab from '../components/admin/MessagesTab';
import LostFoundTab from '../components/admin/LostFoundTab';
import EventsTab from '../components/admin/EventsTab';
import { Calendar } from 'lucide-react';

const TABS = [
  { id: 'pets', label: 'Pet Listings', icon: PawPrint },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'events', label: 'Events', icon: Calendar },
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
    <div className="min-h-screen bg-slate-900">
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white px-6 py-8 border-b border-cyan-500/20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-black">Admin Dashboard</h1>
          <p className="text-cyan-400 text-sm mt-1">Animal Protection Society of Caswell County</p>
          <div className="flex flex-wrap gap-4 mt-6">
            {[
              { label: 'Pets Available', value: pets.filter(p => p.status === 'available').length },
              { label: 'Unread Messages', value: messages.filter(m => m.status === 'new').length },
              { label: 'Total Donations', value: `$${totalDonations.toLocaleString()}` },
              { label: 'Active Lost/Found', value: reports.filter(r => r.status === 'active').length },
            ].map(s => (
              <div key={s.label} className="bg-cyan-500/10 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-cyan-500/20">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-cyan-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-2 mb-8 border-b border-cyan-500/20 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${tab === id ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {tab === 'pets' && <PetListingsTab />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'events' && <EventsTab />}
        {tab === 'lostfound' && <LostFoundTab />}

        {tab === 'donations' && (
          <div>
            <h2 className="text-xl font-black text-white mb-2">Donations</h2>
            <p className="text-cyan-400 font-bold text-lg mb-5">Total Received: ${totalDonations.toLocaleString()}</p>
            <div className="space-y-2">
              {donations.map(d => (
                <div key={d.id} className="bg-slate-800/40 backdrop-blur-md rounded-xl p-4 ring-1 ring-cyan-500/20 flex justify-between items-center gap-4 flex-wrap">
                  <div>
                    <span className="font-bold text-white">{d.anonymous ? 'Anonymous Donor' : d.donor_name}</span>
                    {!d.anonymous && <span className="text-sm text-slate-400 ml-2">{d.donor_email}</span>}
                    <div className="text-xs text-slate-500 mt-0.5">{d.purpose?.replace('_', ' ')} {d.message && `• "${d.message}"`}</div>
                  </div>
                  <span className="text-xl font-black text-cyan-400">${d.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}