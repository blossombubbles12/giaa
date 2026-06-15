import { MessageSquareQuote, Star } from 'lucide-react';
import { db } from '@/db';
import { testimonials } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

import { PageHeader } from '@/components/frontend/layout/PageHeader';

export default async function TestimonialsPage() {
    const allTestimonials = await db.query.testimonials.findMany({
        where: eq(testimonials.approved, true),
        orderBy: [desc(testimonials.createdAt)],
        with: {
            user: true
        }
    });

    return (
        <div className="bg-white dark:bg-[#020617] min-h-screen transition-colors duration-500">
            <PageHeader 
                title="Success Stories"
                description="Hear from the thousands of professionals and organizations whose careers and capabilities have been transformed by GIA Advisory."
                breadcrumbs={[
                    { name: 'Testimonials' }
                ]}
            />

            {/* Testimonials Grid */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
                <div className="container mx-auto px-4 md:px-6">
                    {allTestimonials.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {allTestimonials.map((review, i) => (
                                <div key={review.id} className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl hover:-translate-y-2 transition-transform duration-500 flex flex-col h-full">
                                    <div className="flex items-center gap-1 mb-6">
                                        {Array.from({ length: review.rating || 5 }).map((_, idx) => (
                                            <Star key={idx} size={18} className="text-amber-500 fill-amber-500" />
                                        ))}
                                    </div>
                                    <p className="text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic mb-8 flex-1">
                                        "{review.content}"
                                    </p>
                                    <div className="flex items-center gap-4 border-t border-slate-100 dark:border-slate-800/50 pt-6 mt-auto">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-500/10 border-2 border-emerald-500/20 shrink-0">
                                            {review.user?.image ? (
                                                <img src={review.user.image} alt={review.user.name || ''} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-black text-emerald-500 uppercase">
                                                    {review.user?.name?.[0] || 'A'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{review.user?.name || 'Anonymous Verified'}</h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Alumni</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter mb-4">No reviews yet</h3>
                            <p className="text-slate-500">Check back soon for new success stories.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
