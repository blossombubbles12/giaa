'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ServiceCardData {
  id: string;
  title: string;
  desc: string;
  image: string;
  icon: LucideIcon;
}

interface ServiceCardProps {
  service: ServiceCardData;
  index?: number;
}

export function ServiceCard({ service, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/services/${service.id}`} className="block group">
        <div className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-brand/40 hover:shadow-xl transition-all duration-500">
          {/* Image */}
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

          {/* Icon badge */}
          <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-white shadow-lg">
            <service.icon size={20} />
          </div>

          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
            <h3 className="text-base font-black text-white leading-snug group-hover:text-brand transition-colors">
              {service.title}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
              {service.desc}
            </p>
            <span className="text-xs font-black text-brand uppercase tracking-widest flex items-center gap-1 pt-1">
              Explore <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
