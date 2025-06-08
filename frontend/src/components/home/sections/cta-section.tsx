import Image from 'next/image';
import { siteConfig } from '@/lib/home';
import Link from 'next/link';

export function CTASection() {
  const { ctaSection } = siteConfig;

  return (
    <section
      id="cta"
      className="flex flex-col items-center justify-center w-full pt-12 pb-12 bg-white dark:bg-transparent"
    >
      <div className="w-full max-w-6xl mx-auto px-6">
        <div className="h-[400px] md:h-[400px] overflow-hidden shadow-xl w-full border border-border rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-black dark:from-secondary dark:via-secondary/80 dark:to-secondary/60 relative z-20">
          {/* <Image
            src={ctaSection.backgroundImage}
            alt="Agent CTA Background"
            className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
            fill
            priority
          /> */}
          <div className="absolute inset-0 -top-32 md:-top-40 flex flex-col items-center justify-center">
            <h1 className="text-white text-4xl md:text-7xl font-medium tracking-tighter max-w-xs md:max-w-xl text-center">
              {ctaSection.title}
            </h1>
            <div className="absolute bottom-10 flex flex-col items-center justify-center gap-2">
              <Link
                href={ctaSection.button.href}
                className="bg-white dark:bg-white text-black dark:text-black font-semibold text-sm h-10 w-fit px-4 rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 dark:hover:bg-gray-100 transition-colors"
              >
                {ctaSection.button.text}
              </Link>
              <span className="text-white text-sm">{ctaSection.subtext}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
