"use client";
import React from "react";
import { Check, X, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import Link from "next/link";

import { useEffect, useState } from "react";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export enum planType {
  basic = "basic",
  pro = "pro",
  enterprise = "enterprise",
}

export type Plan = {
  id: string;
  name: string;
  shortDescription: string;
  badge?: string;
  price: number;
  originalPrice?: number;
  period: string;
  features: {
    text: string;
    included: boolean;
  }[];
  buttonText: string;
  subText?: string | React.ReactNode;
  onClick: () => void;
};

const plans: Array<Plan> = [
  {
    id: planType.basic,
    name: "Starter",
    shortDescription: "Perfect for trying out",
    badge: "",
    price: 0,
    period: "forever",
    features: [
      { text: "3 AI agents", included: true },
      { text: "Basic web search & task automation", included: true },
      { text: "Community support", included: true },
      { text: "Access to 50+ MCP servers", included: false },
      { text: "Custom agent styling", included: false },
      { text: "Advanced integrations", included: false },
    ],
    buttonText: "Get Started",
    subText: "No credit card required",
    onClick: () => {
              window.location.href = "/auth";
    },
  },
  {
    id: planType.pro,
    name: "Pro",
    shortDescription: "Best for growing businesses",
    badge: "MOST POPULAR",
    price: 29,
    originalPrice: 49,
    period: "per month",
    features: [
      { text: "Unlimited AI agents", included: true },
      { text: "Advanced web search & task automation", included: true },
      { text: "Connect to 1000+ MCP servers", included: true },
      { text: "Custom agent styling & branding", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: true },
    ],
    buttonText: "Get Started",
    subText: (
      <div className="flex gap-1 justify-center items-center">
        <Gift className="w-4 h-4" />
        40% off for first 100 customers (73 left)
      </div>
    ),
    onClick: () => {
              window.location.href = "/auth?plan=pro";
    },
  },
  {
    id: planType.enterprise,
    name: "Enterprise",
    shortDescription: "For large organizations",
    price: 99,
    originalPrice: 149,
    period: "per month",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "White-label solution", included: true },
      { text: "Custom MCP server development", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SLA guarantee", included: true },
      { text: "On-premise deployment", included: true },
    ],
    buttonText: "Contact Sales",
    subText: "Custom pricing for teams 50+",
    onClick: () => {
      window.location.href = "/contact";
    },
  },
];

// Mobile Card Component
const MobileCard = ({ plan }: { plan: Plan }) => {
  return (
    <div className="mb-4 last:mb-0">
      <div className="bg-neutral-900 rounded-xl p-4 border border-neutral-700">
        {plan.badge && (
          <div className="text-center -mt-8 mb-4">
            <span className="text-yellow-400 text-xs px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
              {plan.badge}
            </span>
          </div>
        )}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-semibold">{plan.name}</h3>
            <p className="text-sm text-neutral-400">{plan.shortDescription}</p>
          </div>
          <div className="text-right">
            {plan.originalPrice && (
              <div className="text-xs text-neutral-500 line-through">
                ${plan.originalPrice}
              </div>
            )}
            <div className="text-xl font-bold text-white">${plan.price}</div>
            <div className="text-xs text-neutral-400">{plan.period}</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {feature.included ? (
                <Check className="h-4 w-4 text-yellow-400" />
              ) : (
                <X className="h-4 w-4 text-neutral-600" />
              )}
              <span
                className={cn(
                  "text-xs",
                  feature.included ? "text-neutral-300" : "text-neutral-500"
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <Button
          onClick={plan.onClick}
          className={cn(
            "w-full py-2 text-sm rounded-lg border-0",
            plan.id === planType.pro
              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-300 hover:to-orange-400 shadow-lg hover:shadow-xl transition-all duration-200"
              : "bg-gradient-to-b from-neutral-700 to-neutral-800 hover:from-neutral-600 hover:to-neutral-700 text-white"
          )}
        >
          {plan.buttonText}
        </Button>

        {plan.subText && (
          <p className="text-xs text-neutral-500 text-center mt-2">
            {plan.subText}
          </p>
        )}
      </div>
    </div>
  );
};

// Desktop Card Component
const DesktopCard = ({ plan }: { plan: Plan }) => {
  return (
    <div
      className={cn(
        "rounded-3xl bg-neutral-900 p-8 ring-1 ring-neutral-700",
        plan.badge && "ring-2 ring-yellow-400/50 scale-105 transform"
      )}
    >
      {plan.badge && (
        <div className="text-center -mt-12 mb-6">
          <span className="text-yellow-400 text-sm px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30">
            {plan.badge}
          </span>
        </div>
      )}
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <div className="inline-flex items-center font-bold justify-center p-2 rounded-[10px] border border-neutral-600 bg-transparent">
            <h3 className="text-sm text-white">{plan.name}</h3>
          </div>
          <div>
            <p className="text-md text-neutral-400 my-4">
              {plan.shortDescription}
            </p>
          </div>
          <div className="mt-4">
            {plan.originalPrice && (
              <span className="text-neutral-500 line-through mr-2">
                ${plan.originalPrice}
              </span>
            )}
            <span className="text-5xl font-bold text-white">${plan.price}</span>
            <span className="text-neutral-400 ml-2">{plan.period}</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-yellow-400" />
              ) : (
                <X className="h-5 w-5 text-neutral-600" />
              )}
              <span
                className={cn(
                  "text-sm",
                  feature.included ? "text-neutral-300" : "text-neutral-500"
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <Button
            onClick={plan.onClick}
            className={cn(
              "w-full py-3 rounded-xl border-0",
              plan.id === planType.pro
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-300 hover:to-orange-400 shadow-lg hover:shadow-xl transition-all duration-200"
                : "bg-gradient-to-b from-neutral-700 to-neutral-800 hover:from-neutral-600 hover:to-neutral-700 text-white"
            )}
          >
            {plan.buttonText}
          </Button>
          {plan.subText && (
            <div className="text-sm text-neutral-500 text-center mt-4">
              {plan.subText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export function PricingList() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="w-full px-4 py-4">
        <div className="max-w-md mx-auto">
          {plans.map((tier) => (
            <MobileCard plan={tier} key={tier.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((tier) => (
          <DesktopCard plan={tier} key={tier.id} />
        ))}
      </div>
    </div>
  );
}

export function Pricing() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      id="pricing"
      className="relative isolate w-full overflow-hidden px-4 py-16 md:py-40 pt-10 md:pt-60 lg:px-4"
    >
      {/* Yellow glow background */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-yellow-400/8 via-orange-400/4 to-transparent rounded-full blur-3xl" />
      {!isMobile && (
        <div className="pt-32 md:pt-48 mt-[600px]">
          <BackgroundShape />
        </div>
      )}
      <div
        className={cn(
          "z-20",
          isMobile ? "flex flex-col mt-0 relative" : "absolute inset-0 mt-80"
        )}
      >
        <div
          className={cn(
            "relative z-50 mx-auto mb-4",
            isMobile ? "w-full" : "max-w-4xl text-center"
          )}
        >
          <h2
            className={cn(
              "inline-block text-3xl md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)]",
              "bg-clip-text text-transparent"
            )}
          >
            Simple, Transparent Pricing
          </h2>
        </div>
        <p
          className={cn(
            "text-sm text-neutral-400 mt-4 px-4",
            isMobile ? "w-full" : "max-w-lg text-center mx-auto"
          )}
        >
          Choose the perfect plan for your business. Start free and scale as you grow with our powerful AI agent platform.
        </p>
        <div className="mx-auto mt-12 md:mt-20">
          <PricingList />
        </div>
      </div>
      {!isMobile && (
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            background:
              "linear-gradient(179.87deg, rgba(0, 0, 0, 0) 0.11%, rgba(0, 0, 0, 0.8) 69.48%, #000000 92.79%)",
          }}
        />
      )}
    </div>
  );
}

function BackgroundShape() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const size = isMobile ? 600 : 1400;
  const innerSize = isMobile ? 400 : 1000;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[rgba(255,255,255,0.1)]"
        style={{
          width: size,
          height: size,
          clipPath: "circle(50% at 50% 50%)",
          background: `
            radial-gradient(
              circle at center,
              rgba(40, 40, 40, 0.8) 0%,
              rgba(20, 20, 20, 0.6) 30%,
              rgba(0, 0, 0, 0.4) 70%
            )
          `,
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: isMobile ? "20px 40px" : "60px 120px",
          }}
        />
      </div>
      <div
        className="absolute bg-black z-2 left-1/2 top-1/2 
          -translate-x-1/2 -translate-y-1/2 rounded-full 
          border border-[rgba(255,255,255,0.1)]
          shadow-[0_0_200px_80px_rgba(255,255,255,0.1)]"
        style={{
          width: innerSize,
          height: innerSize,
        }}
      />
    </div>
  );
} 