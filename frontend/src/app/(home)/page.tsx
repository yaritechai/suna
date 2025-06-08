'use client';

import { Hero } from '@/components/landingui/hero';
import { Features } from '@/components/landingui/features';
import { Testimonials } from '@/components/landingui/testimonials';
import { Pricing } from '@/components/landingui/pricing';
import { FrequentlyAskedQuestions } from '@/components/landingui/faq';
import CTA from '@/components/landingui/cta';
import { Footer } from '@/components/landingui/footer';

export default function Home() {
  return (
    <main className="w-full bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <FrequentlyAskedQuestions />
      <CTA />
      <Footer />
    </main>
  );
}
