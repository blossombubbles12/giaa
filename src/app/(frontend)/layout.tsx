import { Navbar } from '@/components/frontend/layout/Navbar';
import { Footer } from '@/components/frontend/layout/Footer';
import { PageWrapper } from '@/components/frontend/layout/PageWrapper';

export default async function FrontendLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
            <div className="w-full max-w-[1280px] mx-auto bg-white dark:bg-slate-950 shadow-sm">
                <Navbar />
                <PageWrapper>
                    {children}
                </PageWrapper>
                <Footer />
            </div>
        </div>
    );
}