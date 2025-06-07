"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";

export function Testimonials() {
  return (
    <div className="w-full max-w-7xl mx-auto my-20 py-20 px-4 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Title Section - 40% */}
        <div className="w-full lg:w-[40%]">
          <div className="sticky top-20">
            <h2
              className={cn(
                "text-3xl text-center lg:text-left md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)]",
                "bg-clip-text text-transparent leading-tight"
              )}
            >
              What our customers <br />
              say about Yari
            </h2>
            <p className="text-sm text-center lg:text-left mx-auto lg:mx-0 text-neutral-400 mt-6 max-w-sm">
              See how businesses are transforming their operations with AI agents that work 24/7 to boost productivity and growth.
            </p>
          </div>
        </div>

        {/* Right Testimonials Section - 60% */}
        <div className="w-full grid gap-8 grid-cols-1 lg:grid-cols-2 md:w-[60%] mx-auto">
          <TestimonialCard
            name="Sarah Johnson"
            role="Small Business Owner"
            quote="Yari's AI agents have revolutionized how I handle customer inquiries. They work around the clock and handle 90% of questions automatically."
          />
          <TestimonialCard
            name="Michael Chen"
            role="Marketing Director"
            quote="The ability to connect to thousands of MCP servers means our agents can access any tool we need. It's like having a digital workforce."
            className="lg:mt-[50px]"
          />
          <TestimonialCard
            name="Emma Davis"
            role="Operations Manager"
            quote="Setting up agents is incredibly easy. In minutes, I had an agent that could research competitors, draft proposals, and manage our social media."
            className="lg:mt-[-50px]"
          />
          <TestimonialCard
            name="David Rodriguez"
            role="Tech Startup Founder"
            quote="Yari agents don't just chat - they actually perform tasks. They've automated our entire lead qualification process and increased conversions by 40%."
          />
        </div>
      </div>
    </div>
  );
}

const TestimonialCard = ({
  name,
  role,
  quote,
  className,
}: {
  name: string;
  role: string;
  quote: string;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "flex flex-col h-96 p-8 rounded-[17px]",
        "border border-[#474747]",
        "bg-white bg-[linear-gradient(178deg,#2E2E2E_0.37%,#0B0B0B_38.61%),linear-gradient(180deg,#4C4C4C_0%,#151515_100%),linear-gradient(180deg,#2E2E2E_0%,#0B0B0B_100%)]",
        "relative isolate hover:border-yellow-400/50 transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-neutral-700 flex items-center justify-center">
          <span className="text-white font-semibold text-lg">
            {name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{name}</h3>
          <p className="text-sm text-neutral-400">{role}</p>
        </div>
      </div>
      <p className="text-lg text-neutral-300 leading-relaxed">
        &quot;{quote}&quot;
      </p>
    </motion.div>
  );
}; 