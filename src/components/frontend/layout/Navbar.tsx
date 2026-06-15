'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronRight, ChevronDown, Phone, Mail, Shield, FileCheck, Scale, BarChart3, Users, Globe, Lock, Building2, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

const services = [
  { name: 'ISO Implementation & Certification Advisory', href: '/services/iso', icon: Shield },
  { name: 'Audit, Assurance & Financial Control Services', href: '/services/audit', icon: FileCheck },
  { name: 'Tax Advisory & Compliance Services', href: '/services/tax', icon: Scale },
  { name: 'Risk Management & Compliance Advisory', href: '/services/risk', icon: BarChart3 },
  { name: 'Business Strategy & Transformation Consulting', href: '/services/strategy', icon: LineChart },
  { name: 'ESG & Sustainability Advisory', href: '/services/esg', icon: Globe },
  { name: 'HR & Organizational Development', href: '/services/hr', icon: Users },
  { name: 'IT & Cybersecurity Advisory', href: '/services/it', icon: Lock },
];

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About Us', href: '/about' },
  { name: 'Services', href: '/services', hasMega: true },
  { name: 'Industries', href: '/industries' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Insights', href: '/insights' },
  { name: 'Contact', href: '/contact' },
];

interface NavbarProps {
  categories?: { id: string; name: string; slug: string }[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setActiveDropdown(null), 200);
  };

  return (
    <>
      {/* Top Bar (Hidden on Mobile) */}
      <div className="hidden lg:block bg-primary-blue dark:bg-slate-950 relative z-50">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between text-slate-300 text-xs font-semibold py-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2"><Phone size={12} className="text-brand" /> +234 XXX XXX XXXX</span>
            <span className="flex items-center gap-2"><Mail size={12} className="text-brand" /> info@giaadvisory.com</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-brand font-bold text-[10px] uppercase tracking-widest">Governance. Compliance. Performance.</span>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-2'
            : 'bg-transparent py-3'
        )}
      >
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/gialogo.png"
              alt="GIA Advisory Consulting Services"
              width={100}
              height={28}
              style={{ height: 'auto', width: 'auto' }}
              className="h-6 md:h-7 w-auto hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 rounded-full px-2 py-1.5 shadow-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/services' && pathname.startsWith('/services'));

              if (link.hasMega) {
                return (
                  <div
                    key={link.href}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(link.name)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        'px-5 py-2 text-sm font-semibold rounded-full transition-all relative flex items-center gap-1',
                        isActive
                          ? 'text-white'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          className="absolute inset-0 bg-primary-blue rounded-full shadow-lg shadow-primary-blue/20"
                          transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                      <ChevronDown size={14} className={cn("relative z-10 transition-transform", activeDropdown === link.name && "rotate-180")} />
                    </Link>

                    {/* Mega Menu - Services */}
                    <AnimatePresence>
                      {activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[720px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-8 z-50"
                        >
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-950 border-l border-t border-slate-200 dark:border-slate-800 rotate-45" />

                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-5">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Our Services</h3>
                              <Link href="/services" onClick={() => setActiveDropdown(null)} className="text-xs font-semibold text-brand hover:underline">
                                View All Services →
                              </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {services.map((svc) => (
                                <Link
                                  key={svc.name}
                                  href={svc.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                                >
                                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand group-hover:bg-primary-blue group-hover:text-white transition-colors shrink-0">
                                    <svc.icon size={18} />
                                  </div>
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-primary-blue dark:group-hover:text-white transition-colors leading-tight">
                                    {svc.name}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-5 py-2 text-sm font-semibold rounded-full transition-all relative',
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-primary-blue rounded-full shadow-lg shadow-primary-blue/20"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link href="/contact">
              <Button className="hidden lg:inline-flex bg-brand hover:bg-brand-dark text-primary-blue font-bold rounded-full px-6 shadow-lg active:scale-95 transition-all text-xs">
                Request Consultation
              </Button>
            </Link>
            <ThemeToggle />

            {/* Mobile Menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-xl">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] border-slate-800 bg-white dark:bg-slate-950 p-6 overflow-y-auto">
                  <SheetHeader className="text-left mb-8">
                    <div className="flex items-center gap-3">
                      <Image src="/gialogo.png" alt="GIA Advisory" width={140} height={40} className="h-10 w-auto" />
                      <SheetTitle className="sr-only">GIA Menu</SheetTitle>
                    </div>
                  </SheetHeader>
                  <div className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <div key={link.href}>
                        <Link
                          href={link.href}
                          className="text-lg font-bold text-slate-900 dark:text-white hover:text-brand transition-colors flex items-center justify-between group py-1"
                        >
                          {link.name}
                          <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                        {link.hasMega && (
                          <div className="ml-4 mt-2 space-y-2 border-l-2 border-brand/20 pl-4">
                            {services.map((svc) => (
                              <Link
                                key={svc.name}
                                href={svc.href}
                                className="block text-sm font-medium text-slate-500 hover:text-brand transition-colors py-0.5"
                              >
                                {svc.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <hr className="border-slate-100 dark:border-slate-800 my-2" />
                    <Link href="/contact">
                      <Button className="w-full rounded-2xl h-12 font-bold justify-start px-6 bg-brand text-primary-blue hover:bg-brand-dark">
                        Request Consultation
                      </Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}