import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Stethoscope, Scissors, Syringe, Heart, CheckCircle, Phone, MapPin, Clock, ChevronDown } from 'lucide-react';

const SERVICES = [
  {
    icon: Scissors,
    color: 'bg-green-600',
    title: 'Spay & Neuter',
    body: 'We offer low-cost spay and neuter services for cats and dogs to help reduce overpopulation in Caswell County. This safe, routine procedure improves your pet\'s health and quality of life while helping keep our community\'s stray population under control.',
    bullets: ['Reduces risk of certain cancers', 'Eliminates heat cycles and roaming', 'Decreases aggressive behavior', 'Available at reduced costs for qualifying residents'],
  },
  {
    icon: Syringe,
    color: 'bg-blue-600',
    title: 'Vaccinations',
    body: 'Routine vaccinations protect your pet from life-threatening diseases. We offer core vaccines for dogs and cats at affordable rates, ensuring every animal in Caswell County can receive proper preventive care regardless of financial situation.',
    bullets: ['Rabies (required by NC law)', 'Distemper/Parvo (dogs)', 'FVRCP (cats)', 'Bordetella (kennel cough)'],
  },
  {
    icon: Stethoscope,
    color: 'bg-purple-600',
    title: 'Basic Medical Care',
    body: 'Our team provides essential medical services for shelter animals and works with local veterinarians to ensure every pet in our care receives the treatment they need. We treat injuries, illness, and provide pre-adoption health checks.',
    bullets: ['Health assessments for all shelter animals', 'Wound treatment and recovery care', 'Parasite prevention and treatment', 'Pre-adoption medical clearance'],
  },
  {
    icon: Heart,
    color: 'bg-rose-600',
    title: 'Microchipping',
    body: 'A microchip is your pet\'s permanent ID and the best way to ensure they come home if they ever get lost. The quick, safe procedure takes only a few seconds and can mean the difference between a lost pet and a reunited family.',
    bullets: ['Permanent, pain-free identification', 'Registered in national database', 'Required for all shelter adoptions', 'Available for community pets at low cost'],
  },
];

const FAQS = [
  { q: 'Do I need an appointment for spay/neuter services?', a: 'Yes, please call us at (336) 694-4921 during shelter hours to schedule an appointment. We recommend calling at least a week in advance as slots fill up quickly.' },
  { q: 'Are services available to the general public or only shelter animals?', a: 'Many of our services, including spay/neuter and vaccinations, are available to Caswell County residents and their pets — not just shelter animals. Contact us to learn about eligibility and pricing.' },
  { q: 'What is the cost of spay/neuter services?', a: 'We offer services on a sliding scale based on need. Please call us to discuss your situation. Our goal is to make essential pet care accessible to everyone in our community.' },
  { q: 'What should I bring to an appointment?', a: 'Please bring any prior vaccination records, your pet on a leash or in a carrier, and arrive a few minutes early. Cats should be withheld from food the night before surgery.' },
];

export default function Services() {
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.ContactMessage.create(data),
    onSuccess: () => setSent(true),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ ...form, subject: 'Service Inquiry', inquiry_type: 'spay_neuter' });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white py-16 px-4 border-b border-cyan-500/20">
        <div className="max-w-5xl mx-auto text-center">
          <Stethoscope className="w-10 h-10 mx-auto mb-3 text-cyan-400" />
          <h1 className="text-5xl font-black mb-4">Our Services</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            From spay & neuter to vaccinations and microchipping — we provide essential medical services to keep Caswell County pets healthy and families together.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map(({ icon: Icon, color, title, body, bullets }) => (
              <div key={title} className="bg-slate-700/30 backdrop-blur-md rounded-2xl p-8 ring-1 ring-cyan-500/20 hover:ring-opacity-60 transition-all hover:bg-slate-700/40">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-5 text-white`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-white mb-3">{title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">{body}</p>
                <ul className="space-y-2">
                  {bullets.map(b => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Schedule */}
      <section className="py-20 px-4 bg-slate-700/20 backdrop-blur-md border-t border-cyan-500/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black text-white mb-4">Schedule an Appointment</h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Ready to schedule a service or have questions about what we offer? Fill out the form and we'll be in touch, or give us a call during shelter hours.
              </p>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-5 h-5 text-cyan-400" />
                  <a href="tel:3366944921" className="font-bold text-cyan-400 hover:text-cyan-300">(336) 694-4921</a>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span>836 County Home Road, Yanceyville, NC 27379</span>
                </div>
                <div className="flex items-start gap-3 text-slate-300">
                  <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div>Mon, Tue, Thu, Fri: 12pm – 4pm</div>
                    <div>Saturday: 10am – 2pm</div>
                    <div className="text-slate-500">Wed & Sunday: Closed</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-700/30 backdrop-blur-md rounded-2xl p-7 border border-cyan-500/20">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <CheckCircle className="w-14 h-14 text-cyan-400 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Message Received!</h3>
                  <p className="text-slate-300 text-sm">We'll be in touch soon to help with your service needs.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-bold text-white text-lg">Request Information</h3>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your name *" className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-500" />
                  <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Your email *" className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-500" />
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="Your phone" className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-slate-500" />
                  <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} placeholder="What service are you interested in? Tell us about your pet..." rows={4} className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 text-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none placeholder-slate-500" />
                  <button type="submit" disabled={mutation.isPending} className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-60 text-white font-bold py-3 rounded-full transition-colors">
                    {mutation.isPending ? 'Sending…' : 'Send Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-slate-700/20 backdrop-blur-md border-t border-cyan-500/20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-white mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-slate-700/30 backdrop-blur-md rounded-xl overflow-hidden ring-1 ring-cyan-500/20">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex justify-between items-center font-semibold text-white hover:bg-slate-800/60 transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-sm text-slate-300 leading-relaxed border-t border-cyan-500/20 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}