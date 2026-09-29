import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { PawPrint, Search, MessageSquare, Heart } from 'lucide-react';
import PetListingsTab from '../components/admin/PetListingsTab';
import MessagesTab from '../components/admin/MessagesTab';
import LostFoundTab from '../components/admin/LostFoundTab';
import EventsTab from '../components/admin/EventsTab';
import { Calendar, DollarSign } from 'lucide-react';

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

  const STATS = [
    { label: 'Pets Available', value: pets.filter(p => p.status === 'available').length, icon: PawPrint, chip: 'bg-[#e7f7f6] text-[#158c91]' },
    { label: 'Unread Messages', value: messages.filter(m => m.status === 'new').length, icon: MessageSquare, chip: 'bg-[#eef2ff] text-[#5968bc]' },
    { label: 'Total Donations', value: `$${totalDonations.toLocaleString()}`, icon: DollarSign, chip: 'bg-[#fff3e6] text-[#c57c2e]' },
    { label: 'Active Lost/Found', value: reports.filter(r => r.status === 'active').length, icon: Heart, chip: 'bg-[#f1f5e9] text-[#6f8c43]' },
  ];

  return (
    <div className="min-h-screen bg-[#f7fafc] text-[#172b3a]">
      <header className="admin-rise relative overflow-hidden bg-white border-b-[3px] border-[#18a8b5] px-6 sm:px-[54px] pt-11 pb-9">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[34px] leading-[1.1] tracking-[-1.25px] font-extrabold text-[#202b37]">Admin Dashboard</h1>
          <p className="text-[15px] leading-normal text-[#687782] mt-2">Animal Protection Society of Caswell County</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[14px] mt-7">
            {STATS.map(({ label, value, icon: Icon, chip }, i) => (
              <div key={label} style={{ animationDelay: `${i * 0.07}s` }} className="admin-rise min-h-[108px] bg-white border border-[#dce4e8] rounded-xl px-[18px] py-[17px] shadow-[0_5px_16px_rgba(35,57,69,.055)] flex items-center gap-[14px] transition-all duration-[180ms] hover:border-[#a9d8dc] hover:shadow-[0_9px_22px_rgba(35,57,69,.1)] hover:-translate-y-0.5">
                <span className={`w-[39px] h-[39px] flex-none rounded-[11px] grid place-items-center ${chip}`}><Icon className="w-5 h-5" strokeWidth={1.8} /></span>
                <div>
                  <div className="text-2xl leading-[1.15] font-extrabold tracking-[-.5px] text-[#17394b]">{value}</div>
                  <div className="text-xs leading-[1.35] font-semibold text-[#52616c] mt-[5px]">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-12 pt-[27px] pb-[60px]">
        <nav className="flex gap-[5px] mb-[26px] border-b border-[#d7e5e9] flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`admin-tab flex items-center gap-2 px-[15px] pt-[14px] pb-[13px] text-[13px] font-semibold whitespace-nowrap border-b-2 -mb-px hover:text-[#23839c] hover:bg-[#edf8fa] active:bg-[#dff1f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#38a5bd] focus-visible:outline-offset-2 focus-visible:rounded-[5px] ${tab === id ? 'border-[#319bb3] text-[#24839c]' : 'border-transparent text-[#71838a]'}`}
            >
              <Icon className="w-4 h-4" strokeWidth={1.8} /> {label}
            </button>
          ))}
        </nav>

        <section className="admin-rise relative overflow-hidden min-h-[570px] rounded-[17px] border border-[#dfe9ec] bg-gradient-to-br from-white to-[#fbfdfe] shadow-[0_8px_24px_rgba(27,76,92,.045)] p-6" style={{ animationDelay: '.18s' }}>
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#43a8bc] via-[#acdce4] to-[#edf8fa]" />

        {tab === 'pets' && <PetListingsTab />}
        {tab === 'messages' && <MessagesTab />}
        {tab === 'events' && <EventsTab />}
        {tab === 'lostfound' && <LostFoundTab />}

        {tab === 'donations' && (
          <div>
            <h2 className="text-xl font-black text-[#17394b] mb-2">Donations</h2>
            <p className="text-[#24839c] font-bold text-lg mb-5">Total Received: ${totalDonations.toLocaleString()}</p>
            <div className="space-y-2">
              {donations.map(d => (
                <div key={d.id} className="bg-white backdrop-blur-md rounded-xl p-4 ring-1 ring-cyan-200 flex justify-between items-center gap-4 flex-wrap">
                  <div>
                    <span className="font-bold text-gray-900">{d.anonymous ? 'Anonymous Donor' : d.donor_name}</span>
                    {!d.anonymous && <span className="text-sm text-gray-600 ml-2">{d.donor_email}</span>}
                    <div className="text-xs text-gray-600 mt-0.5">{d.purpose?.replace('_', ' ')} {d.message && `• "${d.message}"`}</div>
                  </div>
                  <span className="text-xl font-black text-cyan-600">${d.amount?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        </section>
      </div>

    </div>
  );
}