"use client";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { Button } from "./button";
import { Logo } from "./logo";
import { ThemeToggle } from "@/components/home/theme-toggle";

interface NavbarProps {
  navItems: {
    name: string;
    link: string;
  }[];
  visible: boolean;
}

export const Navbar = () => {
  const navItems = [
    {
      name: "Home",
      link: "/#home",
    },
    {
      name: "Features",
      link: "/#features",
    },
    {
      name: "Pricing",
      link: "/#pricing",
    },
  ];

  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div ref={ref} className="w-full fixed top-2 inset-x-0 z-[100]">
      <DesktopNav visible={visible} navItems={navItems} />
      <MobileNav visible={visible} navItems={navItems} />
    </motion.div>
  );
};

const DesktopNav = ({ navItems, visible }: NavbarProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHoveredIndex(null)}
      animate={{
        backdropFilter: "blur(16px)",
        width: visible ? "42%" : "80%",
        height: visible ? "48px" : "64px",
        y: visible ? 8 : 0,
      }}
      initial={{
        width: "80%",
        height: "64px",
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className={cn(
        "hidden lg:flex flex-row self-center items-center justify-between py-2 mx-auto px-6 rounded-full relative z-[110] backdrop-saturate-[1.8] border border-gray-200/50 dark:border-white/20 transition-colors duration-300",
        "bg-white/90 dark:bg-black/80"
      )}
    >
      <Logo />
      <motion.div
        className="lg:flex flex-row flex-1 items-center justify-center space-x-1 text-sm"
        animate={{
          scale: visible ? 0.9 : 1,
          justifyContent: visible ? "flex-end" : "center",
        }}
      >
        {navItems.map((navItem, idx) => (
          <motion.div
            key={`nav-item-${idx}`}
            onHoverStart={() => setHoveredIndex(idx)}
            className="relative"
          >
            <Link
              className="text-gray-800 dark:text-white/90 relative px-3 py-1.5 transition-colors duration-300"
              href={navItem.link}
            >
              <span className="relative z-10">{navItem.name}</span>
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="menu-hover"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-200/50 to-gray-300/50 dark:from-white/10 dark:to-white/20 transition-colors duration-300"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1.1,
                    background:
                      "radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: {
                      duration: 0.2,
                    },
                  }}
                  transition={{
                    type: "spring",
                    bounce: 0.4,
                    duration: 0.4,
                  }}
                />
              )}
            </Link>
          </motion.div>
        ))}
      </motion.div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <AnimatePresence mode="popLayout" initial={false}>
          {!visible && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                },
              }}
              exit={{
                scale: 0.8,
                opacity: 0,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <Button
                as={Link}
                href="/auth"
                variant="yellow"
                className="hidden md:block relative z-[120]"
              >
                Get Started
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const MobileNav = ({ navItems, visible }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <motion.div
        animate={{
          backdropFilter: "blur(16px)",
          width: visible ? "80%" : "90%",
          y: visible ? 0 : 8,
          borderRadius: open ? "24px" : "full",
          padding: "8px 16px",
        }}
        initial={{
          width: "80%",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className={cn(
          "flex relative flex-col lg:hidden w-full justify-between items-center max-w-[calc(100vw-2rem)] mx-auto z-[110] backdrop-saturate-[1.8] border border-solid border-gray-200/50 dark:border-white/40 rounded-full transition-colors duration-300",
          "bg-white/90 dark:bg-black/80"
        )}
      >
        <div className="flex flex-row justify-between items-center w-full">
          <Logo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {open ? (
              <X className="text-gray-800 dark:text-white/90 transition-colors duration-300" onClick={() => setOpen(!open)} />
            ) : (
              <Menu
                className="text-gray-800 dark:text-white/90 transition-colors duration-300"
                onClick={() => setOpen(!open)}
              />
            )}
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: -20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -20,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
              className="flex rounded-3xl absolute top-16 bg-white/95 dark:bg-black/80 backdrop-blur-xl backdrop-saturate-[1.8] inset-x-0 z-50 flex-col items-start justify-start gap-4 w-full px-6 py-8 border border-gray-200/50 dark:border-white/20 transition-colors duration-300"
            >
              {navItems.map(
                (navItem: { link: string; name: string }, idx: number) => (
                  <Link
                    key={`link=${idx}`}
                    href={navItem.link}
                    onClick={() => setOpen(false)}
                    className="relative text-gray-800 dark:text-white/90 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
                  >
                    <motion.span className="block">{navItem.name}</motion.span>
                  </Link>
                )
              )}
              <Button
                as={Link}
                href="/auth"
                className="w-full mt-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-300 hover:to-orange-400 shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                Get Started
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}; 