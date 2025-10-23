import PageTransition from '@/components/layout/PageTransition';
import HomeSection from '@/components/sections/HomeSection';

// Server component that renders the simplified home page
export default async function HomePage() {
  return (
    <PageTransition>
      <div className="space-y-16">
        <HomeSection />
      </div>
    </PageTransition>
  );
}