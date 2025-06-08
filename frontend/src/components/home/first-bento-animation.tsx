/* eslint-disable @next/next/no-img-element */
'use client';

import { Icons } from '@/components/home/icons';
import {
  Reasoning,
  ReasoningContent,
  ReasoningResponse,
} from '@/components/home/ui/reasoning';
import { AnimatePresence, motion, useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export function ReasoningBasic() {
  const reasoningText = `Based on your calendar patterns and preferences, I recommend scheduling the team meeting for Tuesday at 2pm. This time slot has historically had the highest attendance rate, and it avoids conflicts with other recurring meetings.`;

  return (
    <Reasoning>
      <ReasoningContent className="">
        <ReasoningResponse text={reasoningText} />
      </ReasoningContent>
    </Reasoning>
  );
}

export function FirstBentoAnimation() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isInView) {
      timeoutId = setTimeout(() => {
        setShouldAnimate(true);
      }, 1000);
    } else {
      setShouldAnimate(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="w-full h-full p-4 flex flex-col items-center justify-center gap-5 bg-gray-50/30 dark:bg-transparent transition-colors duration-300"
    >
      <div className="pointer-events-none absolute bottom-0 left-0 h-20 w-full bg-gradient-to-t from-white dark:from-gray-900 to-transparent z-20 transition-colors duration-300"></div>
      <motion.div
        className="max-w-md mx-auto w-full flex flex-col gap-2"
        animate={{
          y: shouldAnimate ? -75 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      >
        <div className="flex items-end justify-end gap-3">
          <motion.div
            className="max-w-[280px] bg-gray-600 dark:bg-secondary text-white p-4 rounded-2xl ml-auto shadow-lg transition-colors duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            <p className="text-sm">
              Hey, I need help scheduling a team meeting that works well for
              everyone. Any suggestions for finding an optimal time slot?
            </p>
          </motion.div>
          <div className="flex items-center bg-white dark:bg-background rounded-full w-fit border border-gray-200 dark:border-border flex-shrink-0 transition-colors duration-300">
            <img
              src="https://randomuser.me/api/portraits/women/79.jpg"
              alt="User Avatar"
              className="size-8 rounded-full flex-shrink-0"
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <div className="flex items-center bg-white dark:bg-background rounded-full size-10 flex-shrink-0 justify-center shadow-lg border border-gray-200 dark:border-border transition-colors duration-300">
            <Icons.logo className="size-4" />
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {!shouldAnimate ? (
                <motion.div
                  key="dots"
                  className="absolute left-0 top-0 bg-white dark:bg-background p-4 rounded-2xl border border-gray-200 dark:border-border shadow-lg transition-colors duration-300"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{
                    duration: 0.2,
                    ease: 'easeOut',
                  }}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((index) => (
                      <motion.div
                        key={index}
                        className="w-2 h-2 bg-gray-400 dark:bg-primary/50 rounded-full transition-colors duration-300"
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: index * 0.2,
                          ease: 'easeInOut',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="response"
                  layout
                  className="absolute left-0 top-0 md:min-w-[300px] min-w-[220px] p-4 bg-gray-100 dark:bg-accent border border-gray-200 dark:border-border rounded-xl shadow-lg transition-colors duration-300"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.3,
                    ease: 'easeOut',
                  }}
                >
                  <ReasoningBasic />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
