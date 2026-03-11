import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Phone, MapPin, Clock, Mail, CheckCircle, MessageSquare } from 'lucide-react';

const INQUIRY_TYPES = [
  { value: 'general', label: 'General Question' },
  { value: 'adoption', label: 'Adoption Inquiry' },
  { value: 'volunteer', label: 'Volunteer Opportunities' },
  { value: 'spay_neuter', label: 'Spay/Neuter Services' },
  { value: 'donation', label: 'Donation Question' },
  { value: 'lost_found', label: 'Lost or Found Pet' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', inquiry_type: 'general' });
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.ContactMessage.create(data),
    onSuccess: () => setSent(true),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
          <h1 className="text-5xl font-black mb-4">Contact Us</h1>
          <p className="text-white text-xl max-w-xl mx-auto font-semibold">
            Have a question about adoption, services, or volunteering? We'd love to hear from you.
          </p>
        </div>
      </div>

      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Info */}
          <div className="space-y-6">
            <div className="bg-white backdrop-blur-md rounded-2xl p-6 shadow-sm ring-1 ring-cyan-200">
              <div className="flex items-center gap-3 mb-1">
                <Phone className="w-5 h-5 text-cyan-600" />
                <h3 className="font-black text-gray-900">Phone</h3>
              </div>
              <a href="tel:3366944921" className="text-2xl font-black text-cyan-700 hover:text-cyan-800 transition-colors">(336) 694-4921</a>
              <p className="text-sm text-gray-700 mt-1 font-medium">Call during shelter hours</p>
            </div>

            <div className="bg-white backdrop-blur-md rounded-2xl p-6 shadow-sm ring-1 ring-cyan-200">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-cyan-600" />
                <h3 className="font-black text-gray-900">Location</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed font-medium">
                836 County Home Road<br />Yanceyville, NC 27379
              </p>
              <a
                href="https://maps.google.com/?q=836+County+Home+Road+Yanceyville+NC"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cyan-700 font-black hover:text-cyan-800 mt-2 block"
              >
                Get Directions →
              </a>
            </div>

            <div className="bg-white backdrop-blur-md rounded-2xl p-6 shadow-sm ring-1 ring-cyan-200">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-cyan-600" />
                <h3 className="font-black text-gray-900">Hours</h3>
              </div>
              <table className="text-base w-full font-medium">
                <tbody className="space-y-1">
                  {[
                    ['Mon, Tue, Thu, Fri', '12pm – 4pm', false],
                    ['Saturday', '10am – 2pm', false],
                    ['Wednesday', 'Closed', true],
                    ['Sunday', 'Closed', true],
                  ].map(([day, hrs, closed]) => (
                    <tr key={day}>
                      <td className={`pr-3 py-1 font-semibold ${closed ? 'text-gray-600' : 'text-gray-700'}`}>{day}</td>
                      <td className={closed ? 'text-gray-600' : 'text-gray-700'}>{hrs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white backdrop-blur-md rounded-2xl p-8 shadow-sm ring-1 ring-cyan-200">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-16">
                <CheckCircle className="w-16 h-16 text-cyan-600 mb-5" />
                <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-700 max-w-sm font-medium">Thank you for reaching out. We'll respond as soon as possible during shelter hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-3xl font-black text-gray-900">Send Us a Message</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Your Name *</label>
                    <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jane Doe" className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                    <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jane@example.com" className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone (optional)</label>
                    <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(336) 555-0000" className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Inquiry Type</label>
                    <select value={form.inquiry_type} onChange={e => setForm(p => ({ ...p, inquiry_type: e.target.value }))} className="w-full px-4 py-3 bg-gray-100 border border-cyan-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                      {INQUIRY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                  <input value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} placeholder="What is this about?" className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-400" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Message *</label>
                  <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="Tell us how we can help you..." rows={5} className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none placeholder-gray-400" />
                </div>
                <button type="submit" disabled={mutation.isPending} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-60 text-white font-bold py-3.5 rounded-full transition-colors text-base">
                  {mutation.isPending ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}