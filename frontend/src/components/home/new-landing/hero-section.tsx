'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ChatMessage {
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export function HeroSection() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: 'user',
      content: 'Hi! I\'m interested in your services',
      timestamp: new Date()
    },
    {
      type: 'bot',
      content: 'Hello! I\'d be happy to help. What specific service are you looking for?',
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(2);

  const additionalMessages = [
    {
      type: 'user' as const,
      content: 'I need help with customer support automation'
    },
    {
      type: 'bot' as const,
      content: 'Perfect! Our AI chatbots can handle 80% of customer inquiries automatically. Would you like to schedule a demo?'
    }
  ];

  useEffect(() => {
    if (currentMessageIndex < 4) {
      const timer = setTimeout(() => {
        if (currentMessageIndex % 2 === 0) {
          // User message
          setIsTyping(false);
          setMessages(prev => [...prev, {
            ...additionalMessages[currentMessageIndex - 2],
            timestamp: new Date()
          }]);
          setCurrentMessageIndex(prev => prev + 1);
          
          // Show typing indicator after user message
          setTimeout(() => setIsTyping(true), 1000);
        } else {
          // Bot response
          setIsTyping(false);
          setTimeout(() => {
            setMessages(prev => [...prev, {
              ...additionalMessages[currentMessageIndex - 2],
              timestamp: new Date()
            }]);
            setCurrentMessageIndex(prev => prev + 1);
          }, 2000);
        }
      }, currentMessageIndex === 2 ? 3000 : 4000);

      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex]);

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden px-4 pt-20 md:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Brand name */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm">Y</span>
              </div>
              <span className="text-white text-xl font-semibold">Yari</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              AI Chatbots for{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Small Business
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
              Transform your customer service with intelligent AI chatbots. 
              Automate responses, capture leads, and grow your business 24/7.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Link
                href="/auth/signup"
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Start Chatting →
              </Link>
              <button className="px-8 py-4 border border-gray-600 text-white rounded-full hover:border-gray-400 transition-all duration-200 transform hover:-translate-y-1">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>

        {/* Right side - Chat Demo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
            {/* Chat header */}
            <div className="bg-gray-800/90 px-6 py-4 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-white font-medium ml-4">Live Chat</span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="p-6 space-y-4 h-80 overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black'
                        : 'bg-gray-700/80 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-700/80 text-white px-4 py-3 rounded-lg">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-300">AI is typing</span>
                      <div className="flex gap-1 ml-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat input */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  disabled
                />
                <button className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-lg font-medium hover:from-yellow-300 hover:to-orange-400 transition-all duration-200">
                  Send
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 