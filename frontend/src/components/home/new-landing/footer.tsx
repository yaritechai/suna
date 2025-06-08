'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-black font-bold text-sm">Y</span>
              </div>
              <span className="text-gray-900 dark:text-white text-xl font-semibold">Yari</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Transform your customer service with intelligent AI chatbots. 
              Automate responses, capture leads, and grow your business 24/7.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#integration" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 dark:text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © 2024 Yari. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 