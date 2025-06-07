"use client";
import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "./button";
import { GlowingEffect } from "./ui/glowing-effect";
import { Search, FileText, BarChart3, Globe, Zap, CheckCircle } from "lucide-react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const parentRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;

  const { scrollY } = useScroll({
    target: parentRef,
  });

  const translateY = useTransform(scrollY, [0, 100], [0, -20]);
  const scale = useTransform(scrollY, [0, 100], [1, 0.96]);
  const blurPx = useTransform(scrollY, [0, 100], [0, 5]);
  const filterBlurPx = useMotionTemplate`blur(${blurPx}px)`;

  return (
    <div
      ref={parentRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-20 md:px-8 md:pt-40"
    >
      {/* Premium Space Background */}
      <div className="absolute inset-0 bg-black">
        {/* Base gradient - pure blacks and muted grays */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-black" />
        
        {/* Circular planet-like glow behind animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-yellow-400/10 via-orange-400/5 to-transparent rounded-full blur-3xl" />
        
        {/* Animated vertical beams */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Beam 1 */}
          <motion.div
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent"
            style={{ left: "15%" }}
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: 0,
            }}
          />
          {/* Beam 2 */}
          <motion.div
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-orange-400/20 to-transparent"
            style={{ left: "35%" }}
            animate={{
              y: ["100%", "-100%"],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
              delay: 2,
            }}
          />
          {/* Beam 3 */}
          <motion.div
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-yellow-300/25 to-transparent"
            style={{ left: "65%" }}
            animate={{
              y: ["-100%", "100%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
              delay: 4,
            }}
          />
          {/* Beam 4 */}
          <motion.div
            className="absolute w-px h-full bg-gradient-to-b from-transparent via-amber-400/15 to-transparent"
            style={{ left: "85%" }}
            animate={{
              y: ["100%", "-100%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
              delay: 6,
            }}
          />
        </div>

        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(250, 204, 21, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250, 204, 21, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      <div className="text-balance relative z-20 mx-auto mb-4 mt-4 max-w-4xl text-center text-4xl font-semibold tracking-tight text-neutral-300 md:text-7xl">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            y: translateY,
            scale,
            filter: filterBlurPx,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "inline-block bg-gradient-to-r from-yellow-400 to-orange-500",
            "bg-clip-text text-transparent"
          )}
        >
          AI Agents for Small Businesses
        </motion.h1>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.5 }}
        className="relative z-20 mx-auto mt-4 max-w-xl px-4 text-center text-base/6 text-gray-300 sm:text-lg"
      >
        Transform your business with intelligent AI Agents. 
        Do Research, draft proposals, and connect your tools.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.7 }}
        className="mb-8 mt-6 sm:mb-10 sm:mt-8 flex w-full items-center justify-center px-4 sm:px-8 md:mb-20"
      >
        <Button
          as={Link}
          href="/auth"
          className="w-full sm:w-48 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-0"
        >
          Get Started
        </Button>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
        ref={containerRef}
        className="relative mx-auto w-full max-w-6xl p-2 backdrop-blur-lg md:p-4"
      >
        <div className="rounded-[30px] relative">
          <GlowingEffect
            spread={60}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={5}
            blur={10}
          />
          <MacBrowserWindow>
            <WireframeAnimation />
          </MacBrowserWindow>
          <div
            className="absolute inset-0 rounded-[30px] pointer-events-none"
            style={{
              background:
                "linear-gradient(179.87deg, rgba(0, 0, 0, 0) 0.11%, rgba(0, 0, 0, 0.3) 69.48%, rgba(0, 0, 0, 0.6) 92.79%)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

const MacBrowserWindow = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-black/90 backdrop-blur-xl border border-gray-700/50 rounded-[20px] overflow-hidden shadow-2xl min-h-[500px]">
      {/* Mac window controls */}
      <div className="flex items-center px-4 py-3 bg-gray-900/50 border-b border-gray-700/30">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-gray-800/50 rounded-lg px-3 py-1 text-xs text-gray-400 border border-gray-600/30">
            yari.ai/agents/automation
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

const WireframeAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [reportData, setReportData] = useState<any[]>([]);
  
  const steps = [
    "Initializing AI Agent...",
    "Searching web for market data...",
    "Analyzing competitor information...",
    "Generating insights...",
    "Creating comprehensive report...",
    "Report completed!"
  ];

  const mockSearchQueries = [
    "market trends 2024",
    "competitor analysis tools", 
    "industry benchmarks",
    "customer behavior data"
  ];

  const mockResults = [
    "TechCrunch: Market Analysis Report",
    "Forbes: Industry Trends 2024", 
    "McKinsey: Digital Transformation",
    "Statista: Market Size Data"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          // Simulate different actions based on step
          if (prev === 1) {
            // Search step
            setSearchQuery(mockSearchQueries[Math.floor(Math.random() * mockSearchQueries.length)]);
            setSearchResults(mockResults.slice(0, Math.floor(Math.random() * 3) + 1));
          } else if (prev === 3) {
            // Analysis step  
            setReportData([
              { label: "Market Growth", value: "+23%" },
              { label: "Competition", value: "High" },
              { label: "Opportunity", value: "Strong" }
            ]);
          }
          return prev + 1;
        } else {
          // Reset animation
          setTimeout(() => {
            setCurrentStep(0);
            setSearchQuery("");
            setSearchResults([]);
            setReportData([]);
          }, 2000);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 h-[450px] relative bg-gradient-to-br from-gray-900/20 to-black/40">
      {/* Status Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
          <span className="text-gray-300 text-sm font-mono">AI Agent Status</span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          Step {currentStep + 1}/6
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Left Panel - Search & Web Scraping */}
        <div className="space-y-4">
          <div className="border border-gray-700/30 rounded-lg p-4 bg-gray-900/20 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Web Research
            </h3>
            
            {/* Search Bar Animation */}
            <div className="bg-gray-800/40 rounded-lg p-2 border border-gray-600/30 mb-3">
              <motion.div
                className="text-gray-300 text-xs font-mono"
                key={searchQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {searchQuery || "Ready to search..."}
                {currentStep === 1 && (
                  <motion.span
                    className="inline-block w-1 h-3 bg-yellow-400 ml-1"
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}
              </motion.div>
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {searchResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex items-center space-x-2 py-1"
                >
                  <Globe className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-gray-400">{result}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Processing Animation */}
          <div className="border border-gray-700/30 rounded-lg p-4 bg-gray-900/20 backdrop-blur-sm">
            <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              AI Processing
            </h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "flex items-center space-x-2 text-xs",
                    index === currentStep ? "text-yellow-400" : 
                    index < currentStep ? "text-green-400" : "text-gray-500"
                  )}
                  animate={index === currentStep ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={{ duration: 1, repeat: index === currentStep ? Infinity : 0 }}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : index === currentStep ? (
                    <div className="w-3 h-3 border border-yellow-400 rounded-full border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-3 h-3 border border-gray-600 rounded-full" />
                  )}
                  <span>{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Report Generation */}
        <div className="space-y-4">
          <div className="border border-gray-700/30 rounded-lg p-4 bg-gray-900/20 backdrop-blur-sm h-full">
            <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Generated Report
            </h3>
            
            {currentStep >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-3"
              >
                <div className="bg-gray-800/40 rounded p-3 border border-gray-600/30">
                  <h4 className="text-xs font-semibold text-white mb-2">Market Analysis Summary</h4>
                  <div className="space-y-2">
                    {reportData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="flex justify-between items-center"
                      >
                        <span className="text-xs text-gray-400">{item.label}</span>
                        <span className="text-xs text-yellow-400 font-mono">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Chart Visualization */}
                <div className="bg-gray-800/40 rounded p-3 border border-gray-600/30">
                  <div className="flex items-center mb-2">
                    <BarChart3 className="w-3 h-3 text-gray-400 mr-2" />
                    <span className="text-xs text-gray-300">Growth Projection</span>
                  </div>
                  <div className="flex items-end space-x-1 h-16">
                    {[40, 55, 70, 85, 95].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="bg-gradient-to-t from-yellow-500 to-orange-400 w-4 rounded-sm"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-4 p-3 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400 font-semibold">Report Ready for Download</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Wireframe Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(250, 204, 21, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(250, 204, 21, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </div>
    </div>
  );
}; 