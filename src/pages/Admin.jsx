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
        {tab === 'messages' && <MessagesTab />}
        {tab === 'lostfound' && <LostFoundTab />}

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
      </div>

    </div>
  );
}