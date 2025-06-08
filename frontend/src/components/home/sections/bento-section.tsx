'use client';

import { SectionHeader } from '@/components/home/section-header';
import { siteConfig } from '@/lib/home';

export function BentoSection() {
  const { title, description, items } = siteConfig.bentoSection;

  return (
    <section
      id="bento"
      className="flex flex-col items-center justify-center w-full relative bg-white dark:bg-transparent transition-colors duration-300"
    >
      <div className="border-x border-gray-200 dark:border-gray-800 mx-auto relative w-full max-w-6xl px-6 transition-colors duration-300">
        <SectionHeader>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-center text-balance pb-1 text-gray-900 dark:text-white transition-colors duration-300">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center text-balance font-medium transition-colors duration-300">
            {description}
          </p>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-start justify-end min-h-[600px] md:min-h-[500px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-gray-200 dark:before:bg-gray-800 before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-gray-200 dark:after:bg-gray-800 after:content-[''] group cursor-pointer max-h-[400px] group transition-colors duration-300"
            >
              <div className="relative flex size-full items-center justify-center h-full overflow-hidden bg-gray-50/50 dark:bg-transparent rounded-lg transition-colors duration-300">
                {item.content}
              </div>
              <div className="flex-1 flex-col gap-2 p-6 bg-white dark:bg-transparent transition-colors duration-300">
                <h3 className="text-lg tracking-tighter font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
