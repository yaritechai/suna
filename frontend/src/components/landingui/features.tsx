"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import DottedMap from "dotted-map";
import {
  IconBrandSlack,
  IconBrandNotion,
  IconBrandGmail,
  IconBrandGoogleDrive,
  IconBrandDiscord,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandGithub,
  IconBrandZoom,
  IconApi,
} from "@tabler/icons-react";
import { GlowingEffect } from "./ui/glowing-effect";

export function Features() {
  return (
    <div
      id="features"
      className="w-full max-w-7xl mx-auto py-4 px-4 md:px-8 md:my-20 md:py-20 bg-white dark:bg-transparent transition-colors duration-300"
    >
      <div className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-center text-lg font-semibold tracking-tight text-gray-600 dark:text-neutral-300 md:text-3xl transition-colors duration-300">
        <h2
          className={cn(
            "inline-block text-3xl md:text-6xl bg-gradient-to-b from-gray-600 via-gray-900 to-gray-600 dark:bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)]",
            "bg-clip-text text-transparent transition-colors duration-300"
          )}
        >
          Features & Benefits
        </h2>
      </div>
      <p className="max-w-lg text-sm text-center mx-auto mt-4 text-gray-600 dark:text-neutral-400 transition-colors duration-300">
        Powerful AI agents that go beyond chatbots - they connect to your tools, perform complex tasks, and work autonomously to grow your business.
      </p>
      <div className="mt-20 grid cols-1 lg:grid-cols-5 gap-4 auto-rows-[25rem] max-w-3xl mx-auto lg:max-w-none">
        <Card className="flex flex-col relative justify-between lg:col-span-2">
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/3">
            <IntegrationsOrbit />
          </div>
          <CardContent className="h-40 absolute bottom-0">
            <CardTitle>
              1000+ MCP <br /> Integrations
            </CardTitle>
            <CardDescription>
              Connect to any tool, API, or service through our vast ecosystem of MCP servers. From CRM to databases, everything works together.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="flex relative flex-col justify-between lg:col-span-3">
          <CardContent className="h-40">
            <CardTitle>
              Available <br /> Worldwide
            </CardTitle>
            <CardDescription>
              Deploy AI agents globally with localized support, multi-language capabilities, and region-specific compliance.
            </CardDescription>
          </CardContent>
          <div className="absolute inset-0">
            <MapView />
          </div>
          <h1
            className={cn(
              "inline-block p-6 text-2xl md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)]  bg-clip-text text-transparent"
            )}
          >
            50+
            <br />
            Countries
          </h1>
        </Card>
        <Card className="flex flex-col relative justify-between lg:col-span-3">
          <h1
            className={cn(
              "inline-block text-right absolute top-0 right-0 p-6 text-xl md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)] bg-clip-text text-transparent"
            )}
          >
            10,000+
            <br />
            Businesses
          </h1>
          <CardSkeletonBody>
            <div className="relative flex h-[300px] w-full flex-col items-start top-20 md:top-10 overflow-hidden rounded-lg bg-background md:shadow-xl">
              <ToolsList />
            </div>
          </CardSkeletonBody>
          <CardContent className="h-40 relative mb-4">
            <CardTitle>
              Trusted by <br /> Businesses
            </CardTitle>
            <CardDescription>
              Join thousands of companies using AI agents to automate workflows, boost productivity, and scale operations efficiently.
            </CardDescription>
          </CardContent>
          <div className="absolute right-4 bottom-4 opacity-10 md:opacity-100">
            <BusinessGrid />
          </div>
        </Card>

        <Card className="flex flex-col justify-between lg:col-span-2">
          <CardContent className="h-40">
            <CardTitle>
              Users <br /> Love Yari
            </CardTitle>
            <CardDescription>
              See what businesses are saying about transforming their operations with AI agents that actually get work done.
            </CardDescription>
          </CardContent>
          <CardSkeletonBody>
            <div className="w-full h-full p-4 rounded-lg px-10 mt-6">
              <CardStack items={TESTIMONIALS} />
            </div>
          </CardSkeletonBody>
        </Card>
      </div>
    </div>
  );
}

// Card structure
const CardSkeletonBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("overflow-hidden relative w-full h-full", className)}>
      {children}
    </div>
  );
};

const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("p-6", className)}>{children}</div>;
};

const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "inline-block text-xl md:text-4xl bg-gradient-to-b from-gray-600 via-gray-900 to-gray-600 dark:bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)] bg-clip-text text-transparent transition-colors duration-300",
        className
      )}
    >
      {children}
    </h3>
  );
};

const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "font-sans max-w-sm text-sm font-normal tracking-tight mt-2 text-gray-600 dark:text-neutral-400 transition-colors duration-300",
        className
      )}
    >
      {children}
    </p>
  );
};

const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover="animate"
      className={cn(
        "group relative isolate flex flex-col rounded-2xl bg-gray-100 dark:bg-neutral-900 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] overflow-hidden transition-colors duration-300",
        className
      )}
    >
      <GlowingEffect
        spread={60}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={5}
        blur={10}
      />
      {children}
    </motion.div>
  );
};

const ToolsList = () => {
  const commonStyles = useMemo(
    () =>
      "rounded-[13px] w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-[1_0_0] bg-[linear-gradient(0deg,#333_0%,#333_100%),radial-gradient(297.31%_124.05%_at_91.1%_3.42%,#3B3B3B_0%,#232323_27.05%,#0A0A0A_100%)] flex items-center justify-center",
    []
  );

  const tools = useMemo(
    () => [
      { Icon: IconBrandSlack, delay: 0 },
      { Icon: IconBrandNotion, delay: 0.1 },
      { Icon: IconBrandGmail, delay: 0.2 },
      { Icon: IconBrandGoogleDrive, delay: 0.3 },
      { Icon: IconApi, delay: 0.4 },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isHovered) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % tools.length);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [tools.length, isHovered]);

  const ToolComponents = useMemo(
    () =>
      tools.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: 1,
            opacity: 1,
            background:
              index === activeIndex
                ? "radial-gradient(297.31% 124.05% at 91.1% 3.42%, #f59e0b 0%, #ea580c 27.05%, #0A0A0A 100%), #D9D9D9"
                : "linear-gradient(0deg,#333 0%,#333 100%),radial-gradient(297.31% 124.05% at 91.1% 3.42%,#3B3B3B 0%,#232323 27.05%,#0A0A0A 100%)",
            boxShadow:
              index === activeIndex
                ? "0px 22px 6px 0px rgba(245, 158, 11, 0.01), 0px 14px 6px 0px rgba(245, 158, 11, 0.04), 0px 8px 5px 0px rgba(245, 158, 11, 0.14), 0px 4px 4px 0px rgba(245, 158, 11, 0.24), 0px 1px 2px 0px rgba(245, 158, 11, 0.27)"
                : "none",
          }}
          onMouseEnter={() => {
            setIsHovered(true);
            setActiveIndex(index);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          transition={{
            delay,
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
            background: {
              duration: 0.3,
              ease: "easeInOut",
            },
            boxShadow: {
              duration: 0.3,
              ease: "easeInOut",
            },
          }}
          className={commonStyles}
        >
          <Icon className="w-6 h-6 md:w-10 md:h-10 text-neutral-200 dark:text-neutral-200" />
        </motion.div>
      )),
    [tools, activeIndex, commonStyles]
  );

  return (
    <div className="inline-flex items-center gap-[6px] md:gap-[11px] p-[6px] md:p-[9px] rounded-[0px_20px_20px_0px] bg-[linear-gradient(88deg,#161616_0.35%,#292929_98.6%)] shadow-[0px_112px_31px_0px_rgba(0,0,0,0.02),0px_71px_29px_0px_rgba(0,0,0,0.13),0px_40px_24px_0px_rgba(0,0,0,0.45),0px_18px_18px_0px_rgba(0,0,0,0.77),0px_4px_10px_0px_rgba(0,0,0,0.88)]">
      {ToolComponents}
    </div>
  );
};

let interval: NodeJS.Timeout;
type Card = {
  id: number;
  name: string;
  designation?: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative h-48 md:h-36 w-full mx-auto">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute w-full h-full p-4 flex flex-col justify-between rounded-[16px] bg-[linear-gradient(180deg,#1D1D1D_0%,#131313_100%)] shadow-[0px_1px_1px_0px_rgba(121,121,121,0.70)_inset] border border-white/[0.1]"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
            }}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
              <YariLogo className="w-6 h-6 sm:w-auto sm:h-auto" />
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <p className="text-sm sm:text-base  font-medium text-white">
                  {card.name}
                </p>
                {card.designation && (
                  <p className="text-sm sm:text-base font-normal text-neutral-200">
                    {card.designation}
                  </p>
                )}
              </div>
            </div>
            <div className="font-normal text-xs sm:text-sm text-neutral-200 mt-2">
              {card.content}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const TESTIMONIALS = [
  {
    id: 0,
    name: "Sarah Chen",
    designation: "CEO, TechStart",
    content: (
      <p>
        These AI agents are <Highlight>game-changing</Highlight>. They handle our customer support, manage leads, and even draft proposals. It's like having a 24/7 team.
      </p>
    ),
  },
  {
    id: 1,
    name: "Mike Rodriguez",
    designation: "Operations Manager",
    content: (
      <p>
        Unlike chatbots, these agents actually <Highlight>get things done</Highlight>. 
        They connect to our CRM, send emails, and manage our entire sales pipeline autonomously.
      </p>
    ),
  },
  {
    id: 2,
    name: "Emily Watson",
    designation: "Marketing Director",
    content: (
      <p>
        The <Highlight>MCP integrations</Highlight> are incredible. Our agents can access any tool we use - Slack, Notion, Google Drive, you name it. Everything just works together.
      </p>
    ),
  },
];

const YariLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn("w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center", className)}>
      <span className="text-black font-bold text-sm">Y</span>
    </div>
  );
};

const businessLogos = [
  { name: "TechCorp", color: "bg-blue-500" },
  { name: "StartupXYZ", color: "bg-green-500" },
  { name: "InnovateCo", color: "bg-purple-500" },
  { name: "ScaleTech", color: "bg-red-500" },
  { name: "GrowthLabs", color: "bg-indigo-500" },
  { name: "AutomatePro", color: "bg-pink-500" },
];

const BusinessGrid = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isHovered) {
      interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % businessLogos.length);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isHovered]);

  useEffect(() => {
    if (hoveredIndex !== null) {
      setActiveIndex(hoveredIndex);
    }
  }, [hoveredIndex]);

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredIndex(null);
      }}
    >
      {businessLogos.map((business, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={{ y: 20, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            scale: index === activeIndex ? [1, 1.2, 1] : 0.9,
            rotate: index === activeIndex ? [0, -5, 5, 0] : 0,
          }}
          transition={{
            duration: 0.6,
            scale: {
              duration: 0.8,
              times: [0, 0.5, 1],
              ease: "easeInOut",
              repeat: index === activeIndex ? Infinity : 0,
              repeatDelay: 1,
            },
            rotate: {
              duration: 0.8,
              times: [0, 0.25, 0.75, 1],
              ease: "easeInOut",
              repeat: index === activeIndex ? Infinity : 0,
              repeatDelay: 1,
            },
          }}
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.2 },
          }}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div
            className={cn(
              "w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xs",
              business.color
            )}
            style={{
              filter:
                index === activeIndex ? "brightness(1.2)" : "brightness(0.8)",
              transition: "filter 0.3s ease",
            }}
          >
            {business.name.slice(0, 2)}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const OrbitingIcons = ({
  centerIcon,
  orbits,
  className,
}: {
  centerIcon?: React.ReactNode;
  orbits: Array<{
    icons: React.ReactNode[];
    radius?: number;
    speed?: number;
    rotationDirection?: "clockwise" | "anticlockwise";
    revealTime?: number;
    delay?: number;
  }>;
  className?: string;
}) => {
  const orbitData = React.useMemo(() => {
    return orbits.map((orbit, orbitIndex) => {
      const radius = orbit.radius || 100 + orbitIndex * 80;
      const speed = orbit.speed || 1;
      const revealTime = orbit.revealTime || 0.5;
      const orbitDelay = orbit.delay || 0;
      const iconCount = orbit.icons.length;

      const angleStep = 360 / iconCount;
      const angles = Array.from({ length: iconCount }, (_, i) => angleStep * i);

      const iconData = angles.map((angle) => {
        const randomDelay = -Math.random() * speed;
        const rotationAngle =
          orbit.rotationDirection === "clockwise"
            ? [angle, angle - 360]
            : [angle, angle + 360];

        return {
          angle,
          randomDelay,
          rotationAngle,
          position: {
            x: radius * Math.cos((angle * Math.PI) / 180),
            y: radius * Math.sin((angle * Math.PI) / 180),
          },
          animation: {
            initial: {
              rotate: angle,
              scale: 0,
              opacity: 0,
            },
            animate: {
              rotate: rotationAngle,
              scale: 1,
              opacity: 1,
            },
            transition: {
              rotate: {
                duration: speed,
                repeat: Infinity,
                ease: "linear",
                delay: randomDelay + orbitDelay,
              },
              scale: {
                duration: revealTime,
                delay: Math.abs(randomDelay) + orbitDelay,
              },
              opacity: {
                duration: revealTime,
                delay: Math.abs(randomDelay) + orbitDelay,
              },
            },
            counterRotation: {
              initial: { rotate: -angle },
              animate: {
                rotate:
                  orbit.rotationDirection === "clockwise"
                    ? [-angle, -angle + 360]
                    : [-angle, -angle - 360],
              },
              transition: {
                duration: speed,
                repeat: Infinity,
                ease: "linear",
                delay: randomDelay + orbitDelay,
              },
            },
          },
        };
      });

      return {
        radius,
        speed,
        revealTime,
        orbitDelay,
        iconData,
        rotationDirection: orbit.rotationDirection,
      };
    });
  }, [orbits]);

  return (
    <div className={cn("relative w-[300px] h-[300px]", className)}>
      {centerIcon && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          {centerIcon}
        </div>
      )}
      {orbitData.map((orbit, orbitIndex) => (
        <div
          key={orbitIndex}
          className="absolute top-0 left-0 w-full h-full"
          style={{ zIndex: orbits.length - orbitIndex }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[343.721px] border border-[#545454] bg-[linear-gradient(189deg,#252525_5.97%,#0E0E0E_92.92%)] shadow-[0px_115px_32px_0px_rgba(0,0,0,0.01),_0px_74px_29px_0px_rgba(0,0,0,0.05),_0px_41px_25px_0px_rgba(0,0,0,0.16),_0px_18px_18px_0px_rgba(0,0,0,0.27),_0px_5px_10px_0px_rgba(0,0,0,0.31),inset_0px_0px_20px_rgba(0,0,0,0.5)]"
            style={{
              width: orbit.radius * 2 + "px",
              height: orbit.radius * 2 + "px",
            }}
          />

          {orbit.iconData.map((icon, iconIndex) => (
            <motion.div
              key={iconIndex}
              className="absolute"
              style={{
                width: "40px",
                height: "40px",
                left: `calc(50% - 20px)`,
                top: `calc(50% - 20px)`,
                transformOrigin: "center center",
              }}
              initial={icon.animation.initial}
              animate={icon.animation.animate}
              transition={icon.animation.transition}
            >
              <div
                style={{
                  position: "absolute",
                  left: `${orbit.radius}px`,
                  transformOrigin: "center center",
                }}
              >
                <motion.div
                  initial={icon.animation.counterRotation.initial}
                  animate={icon.animation.counterRotation.animate}
                  transition={icon.animation.counterRotation.transition}
                  className="w-10 h-10 rounded-[5px] bg-[#151515] flex items-center justify-center shadow-[0px_23px_7px_0px_rgba(0,0,0,0.01),0px_15px_6px_0px_rgba(0,0,0,0.06),0px_8px_5px_0px_rgba(0,0,0,0.19),0px_4px_4px_0px_rgba(0,0,0,0.32),0px_1px_2px_0px_rgba(0,0,0,0.37)]"
                >
                  {orbits[orbitIndex].icons[iconIndex]}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

const IntegrationsOrbit = () => {
  const orbit1Icons = [
    <IconBrandSlack
      key="slack"
      className="w-6 h-6 text-white dark:text-white"
    />,
    <IconBrandNotion
      key="notion"
      className="w-6 h-6 text-white dark:text-white"
    />,
    <IconBrandGmail
      key="gmail"
      className="w-6 h-6 text-white dark:text-white"
    />,
  ];

  const orbit2Icons = [
    <IconBrandDiscord
      key="discord"
      className="w-5 h-5 text-white dark:text-white"
    />,
    <IconBrandTwitter
      key="twitter"
      className="w-5 h-5 text-white dark:text-white"
    />,
    <IconBrandLinkedin
      key="linkedin"
      className="w-5 h-5 text-white dark:text-white"
    />,
    <IconBrandGithub
      key="github"
      className="w-5 h-5 text-white dark:text-white"
    />,
  ];

  return (
    <OrbitingIcons
      orbits={[
        {
          icons: orbit1Icons,
          rotationDirection: "clockwise",
          radius: 80,
          speed: 7,
        },
        {
          icons: orbit2Icons,
          rotationDirection: "anticlockwise",
          radius: 140,
          speed: 15,
        },
      ]}
    />
  );
};

const MapView = () => {
  const svgMap = useMemo(() => {
    const map = new DottedMap({
      height: 40,
      grid: "diagonal",
    });

    return map.getSVG({
      radius: 0.15,
      color: "#FFFFFF50",
      shape: "circle",
    });
  }, []);

  const flashingPoints = useMemo(() => {
    const points = [];
    const numPoints = 8;

    for (let i = 0; i < numPoints; i++) {
      points.push({
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        delay: (i / numPoints) * 3,
        duration: 2 + Math.random(),
      });
    }
    return points;
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 transition-opacity duration-300">
        <Image
          src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
          className="h-full w-full object-cover absolute top-0 -right-2 -mt-14 
            [mask-image:linear-gradient(to_bottom,transparent,white_15%,white_85%,transparent)]
            pointer-events-none select-none opacity-50"
          alt="Interactive world map visualization"
          height={595}
          width={356}
          priority={true}
          draggable={false}
        />
      </div>

      <div className="absolute inset-0" aria-hidden="true">
        {flashingPoints.map((point, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-glow"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              boxShadow: "0 0 12px rgba(250, 204, 21, 0.6)",
            }}
            animate={{
              opacity: [0, 0.8, 0],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: point.duration,
              delay: point.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}; 