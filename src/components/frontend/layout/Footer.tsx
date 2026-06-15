import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Shield, FileCheck, Scale, BarChart3, Users, Globe, Lock, Building2, LineChart } from 'lucide-react';

const services = [
  { name: 'ISO Implementation & Certification', href: '/services#iso' },
  { name: 'Audit, Assurance & Financial Control', href: '/services#audit' },
  { name: 'Tax Advisory & Compliance', href: '/services#tax' },
  { name: 'Risk Management & Compliance', href: '/services#risk' },
  { name: 'Business Strategy & Transformation', href: '/services#strategy' },
  { name: 'ESG & Sustainability Advisory', href: '/services#esg' },
  { name: 'HR & Organizational Development', href: '/services#hr' },
  { name: 'IT & Cybersecurity Advisory', href: '/services#it' },
];

export function Footer() {
  return (
    <footer className="bg-primary-blue text-white pt-20 pb-10">
            <div className="px-5 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">

          {/* Brand */}
          <div className="space-y-8 lg:col-span-4">
            <Link href="/" className="flex items-center group">
              <Image
                src="/gialogo.png"
                alt="GIA Advisory Consulting Services"
                width={180}
                height={56}
                className="h-14 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed">
              We are a professional consulting firm helping organizations strengthen governance systems, 
              achieve regulatory compliance, and improve operational performance across finance, audit, 
              risk, taxation, and business strategy.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-slate-300 hover:bg-brand hover:text-primary-blue hover:border-brand transition-all">
                  <Icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-brand">Our Services</h4>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-300 hover:text-brand transition-colors flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-brand" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-brand">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Industries', href: '/industries' },
                { name: 'Case Studies', href: '/case-studies' },
                { name: 'Insights', href: '/insights' },
                { name: 'Contact', href: '/contact' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'Terms & Conditions', href: '/terms-conditions' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-300 hover:text-brand transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-brand">Get in Touch</h4>
            <div className="space-y-4">
              <a href="tel:+234XXXXXXXXXX" className="flex items-center gap-3 text-slate-300 hover:text-brand transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-brand" />
                </div>
                <span className="text-sm font-bold">+234 XXX XXX XXXX</span>
              </a>
              <a href="mailto:info@giaadvisory.com" className="flex items-center gap-3 text-slate-300 hover:text-brand transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-brand" />
                </div>
                <span className="text-sm font-bold">info@giaadvisory.com</span>
              </a>
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-bold text-white mb-1">Lagos, Nigeria</p>
                  <p>Head Office</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-medium text-slate-400">
            &copy; {new Date().getFullYear()} GIA Advisory Consulting Services. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/privacy-policy" className="hover:text-brand transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="hover:text-brand transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}