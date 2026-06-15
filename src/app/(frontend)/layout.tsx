import { Navbar } from '@/components/frontend/layout/Navbar';
import { Footer } from '@/components/frontend/layout/Footer';
import { PageWrapper } from '@/components/frontend/layout/PageWrapper';

export default async function FrontendLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <PageWrapper>
                {children}
            </PageWrapper>
            <Footer />
        </div>
    );
}