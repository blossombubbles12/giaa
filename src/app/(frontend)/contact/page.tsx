'use client';

import { Mail, Phone, MapPin, Clock, MessageSquare, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-slate-950 pb-32 transition-colors duration-500">
      <PageHeader
        title="Contact Us"
        description="Ready to strengthen your governance and compliance? Get in touch with our team of experts."
        breadcrumbs={[{ name: 'Contact' }]}
      />

      <section className="container py-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Card */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-950 p-10 md:p-16 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-black text-primary-blue dark:text-white uppercase tracking-tighter">Request a Consultation</h2>
              <p className="text-slate-500 font-medium">Fill out the form below and our team will respond within 24 hours.</p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Company *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50" placeholder="Company name" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email *</label>
                  <input type="email" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50" placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50" placeholder="+234 XXX XXX XXXX" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Service Interested In</label>
                <select className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50">
                  <option value="">Select a service...</option>
                  <option>ISO Implementation & Certification</option>
                  <option>Audit, Assurance & Financial Control</option>
                  <option>Tax Advisory & Compliance</option>
                  <option>Risk Management & Compliance</option>
                  <option>Business Strategy & Transformation</option>
                  <option>ESG & Sustainability Advisory</option>
                  <option>HR & Organizational Development</option>
                  <option>IT & Cybersecurity Advisory</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Message *</label>
                <textarea rows={5} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 resize-none" placeholder="Tell us about your needs..." />
              </div>
              <Button className="bg-brand hover:bg-brand-dark text-primary-blue font-bold rounded-full h-14 px-10 shadow-xl active:scale-95 transition-all w-full md:w-auto">
                Send Message <Send className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* Info Side */}
          <div className="space-y-8">
            <div className="bg-primary-blue text-white p-12 rounded-[3.5rem] shadow-2xl space-y-8 h-full flex flex-col">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Quick Info</h3>

              <div className="space-y-8 flex-1">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                    <p className="font-bold">+234 XXX XXX XXXX</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                    <p className="font-bold">info@giaadvisory.com</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-brand shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</p>
                    <p className="font-bold">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex items-center gap-4">
                <Clock size={12} className="text-brand" />
                <span className="text-[10px] font-black uppercase tracking-[.2em] text-slate-400">Response time: &lt; 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}