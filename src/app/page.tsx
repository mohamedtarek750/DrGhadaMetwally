import { About } from '@/components/about/About';
import { Appointment } from '@/components/appointment/Appointment';
import { MobileBookBar } from '@/components/appointment/MobileBookBar';
import { Footer } from '@/components/footer/Footer';
import { Hero } from '@/components/hero/Hero';
import { Approach } from '@/components/intro/Approach';
import { SiteHeader } from '@/components/navigation/SiteHeader';
import { InstagramSection } from '@/components/social/InstagramSection';
import { Treatments } from '@/components/treatments/Treatments';

/**
 * One page, one journey: meet her (hero, approach), see what she does
 * (treatments), trust her (about, Instagram), then book (appointment).
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Approach />
        <Treatments />
        <About />
        <InstagramSection />
        <Appointment />
      </main>
      <Footer />
      <MobileBookBar />
    </>
  );
}
