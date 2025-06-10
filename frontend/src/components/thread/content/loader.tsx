import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';

const items = [
    { id: 1, content: "Initializing neural pathways..." },
    { id: 2, content: "Analyzing query complexity..." },
    { id: 3, content: "Assembling cognitive framework..." },
    { id: 4, content: "Orchestrating thought processes..." },
    { id: 5, content: "Synthesizing contextual understanding..." },
    { id: 6, content: "Calibrating response parameters..." },
    { id: 7, content: "Engaging reasoning algorithms..." },
    { id: 8, content: "Processing semantic structures..." },
    { id: 9, content: "Formulating strategic approach..." },
    { id: 10, content: "Optimizing solution pathways..." },
    { id: 11, content: "Harmonizing data streams..." },
    { id: 12, content: "Architecting intelligent response..." },
    { id: 13, content: "Fine-tuning cognitive models..." },
    { id: 14, content: "Weaving narrative threads..." },
    { id: 15, content: "Crystallizing insights..." },
    { id: 16, content: "Preparing comprehensive analysis..." }
  ];

export function AgentLoader() {
  return (
    <div className="inline-flex items-center space-x-3 px-4 py-3 bg-base-100/90 
                    backdrop-blur-sm rounded-2xl border border-base-300/50 
                    shadow-lg max-w-fit">
      {/* Animated dots */}
      <div className="flex space-x-1">
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary 
                       animate-pulse shadow-sm"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary 
                       animate-pulse delay-150 shadow-sm"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-secondary 
                       animate-pulse delay-300 shadow-sm"></div>
      </div>
      
      {/* AI name and status */}
      <span className="text-sm text-base-content/80 font-medium">
        Yari is thinking...
      </span>
    </div>
  );
}
