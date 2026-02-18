import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Heart, CheckCircle, Utensils, Syringe, Home, Shield } from 'lucide-react';

const AMOUNTS = [25, 50, 100, 250, 500];
const PURPOSES = [
  { value: 'general', label: 'Where Needed Most' },
  { value: 'medical', label: 'Medical Care' },
  { value: 'spay_neuter', label: 'Spay & Neuter Program' },
  { value: 'emergency', label: 'Emergency Fund' },
  { value: 'food_supplies', label: 'Food & Supplies' },
];
const IMPACT = [
  { icon: Utensils, amount: '$25', label: 'feeds one animal for a full month' },
  { icon: Syringe, amount: '$50', label: 'covers a full set of core vaccinations' },
  { icon: Heart, amount: '$100', label: 'funds a spay or neuter surgery' },
  { icon: Home, amount: '$250', label: 'sponsors a complete rescue and adoption' },
];

export default function Donate() {
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState('');
  const [purpose, setPurpose] = useState('general');
  const [form, setForm] = useState({ donor_name: '', donor_email: '', message: '', anonymous: false });
  const [sent, setSent] = useState(false);

  const finalAmount = custom ? parseFloat(custom) : amount;

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.Donation.create(data),
    onSuccess: () => setSent(true),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!finalAmount || finalAmount < 1) return;
    mutation.mutate({ ...form, amount: finalAmount, purpose });
  };

  if (sent) return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center px-4">
      <div className="bg-slate-700/40 backdrop-blur-md rounded-3xl shadow-xl p-12 max-w-md w-full text-center border border-cyan-500/20">
        <div className="w-20 h-20 bg-fuchsia-500/20 rounded-full flex items-center justify-center mx-auto mb-5 border border-fuchsia-500/30">
          <Heart className="w-10 h-10 text-fuchsia-400" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Thank You!</h2>
        <p className="text-slate-300 mb-2">Your generous donation of <strong>${finalAmount}</strong> will make a real difference for the animals of Caswell County.</p>
        <p className="text-slate-400 text-sm">We'll be in touch at {form.donor_email} with a confirmation.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <div
        className="relative py-20 px-4 text-white"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/50" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-fuchsia-400" />
          <h1 className="text-5xl font-black mb-4">Your Donation Saves Lives</h1>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Every dollar you give goes directly to feeding, healing, and rehoming animals in Caswell County. No animal turned away. No contribution too small.
          </p>
        </div>
      </div>

      {/* Impact */}
      <section className="bg-slate-700/20 backdrop-blur-md border-b border-cyan-500/20 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-2xl font-black text-white mb-8">Your Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {IMPACT.map(({ icon: Icon, amount: a, label }) => (
              <div key={a} className="text-center p-5 bg-slate-700/30 backdrop-blur-md rounded-2xl border border-cyan-500/20">
                <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-black text-white">{a}</div>
                <p className="text-xs text-slate-300 mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-slate-700/30 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-cyan-500/20">
            <h2 className="text-2xl font-black text-white mb-6">Make a Donation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-3">Select Amount</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                  {AMOUNTS.map(a => (
                    <button
                      type="button"
                      key={a}
                      onClick={() => { setAmount(a); setCustom(''); }}
                      className={`py-2.5 rounded-xl font-bold text-sm transition-all ${!custom && amount === a ? 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-lg shadow-fuchsia-500/50' : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'}`}
                    >
                      ${a}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom amount"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setAmount(null); }}
                    className="w-full pl-8 pr-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Designate Your Gift</label>
                <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                  {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>

              {/* Donor Info */}
              <div className="space-y-3">
                <input required value={form.donor_name} onChange={e => setForm(p => ({ ...p, donor_name: e.target.value }))} placeholder="Your full name *" className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-400" />
                <input required type="email" value={form.donor_email} onChange={e => setForm(p => ({ ...p, donor_email: e.target.value }))} placeholder="Your email address *" className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-400" />
                <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Leave a message (optional)" rows={3} className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none placeholder-slate-400" />
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.anonymous} onChange={e => setForm(p => ({ ...p, anonymous: e.target.checked }))} className="w-4 h-4" />
                  <span className="text-sm text-slate-300">Make this donation anonymous</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={mutation.isPending || !finalAmount || finalAmount < 1}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:shadow-lg hover:shadow-fuchsia-500/50 disabled:opacity-60 text-white font-black text-lg py-4 rounded-full transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                {mutation.isPending ? 'Processing…' : `Donate $${finalAmount || '—'}`}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <Shield className="w-3.5 h-3.5" /> Your information is safe and secure
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}