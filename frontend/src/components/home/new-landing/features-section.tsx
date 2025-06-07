'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  Zap, 
  Shield, 
  BarChart3, 
  Puzzle 
} from 'lucide-react';

const features = [
  {
    icon: MessageCircle,
    title: 'Smart Conversations',
    description: 'AI-powered chatbots that understand context and provide human-like responses to your customers.'
  },
  {
    icon: Users,
    title: 'Lead Generation',
    description: 'Automatically capture and qualify leads 24/7, turning website visitors into potential customers.'
  },
  {
    icon: Zap,
    title: 'Instant Responses',
    description: 'Provide immediate answers to customer questions, reducing wait times and improving satisfaction.'
  },
  {
    icon: Shield,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security with 99.9% uptime guarantee to keep your business running smoothly.'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance metrics, conversation insights, and ROI with comprehensive analytics.'
  },
  {
    icon: Puzzle,
    title: 'Easy Integration',
    description: 'Seamlessly integrate with your existing tools and platforms in just a few clicks.'
  }
];

export function FeaturesSection() {
  return (
    <div className="relative bg-black py-20 md:py-32">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Modern Businesses
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to automate customer interactions and grow your business
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-yellow-400/50 transition-all duration-300 h-full">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-7 h-7 text-black" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-gray-300 mb-8 text-lg">
            Ready to transform your customer service?
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-full hover:from-yellow-300 hover:to-orange-400 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
            Get Started Today →
          </button>
        </motion.div>
      </div>
    </div>
  );
} 