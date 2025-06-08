import Link from "next/link";
import React from "react";
import { Logo } from "./logo";

export function Footer() {
  const product = [
    { title: "AI Agents", href: "#features" },
    { title: "MCP Integrations", href: "#integrations" },
    { title: "Pricing", href: "#pricing" },
    { title: "API", href: "#api" },
  ];

  const resources = [
    { title: "Documentation", href: "/docs" },
    { title: "Agent Templates", href: "/templates" },
    { title: "Support", href: "/support" },
    { title: "Blog", href: "/blog" },
  ];

  const company = [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Careers", href: "/careers" },
    { title: "Partners", href: "/partners" },
  ];

  const legal = [
    { title: "Privacy Policy", href: "/privacy" },
    { title: "Terms of Service", href: "/terms" },
    { title: "Cookie Policy", href: "/cookies" },
  ];

  return (
    <footer className="relative border-t border-gray-800 px-8 py-20 bg-black w-full overflow-hidden mx-auto max-w-7xl">
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-px flex h-8 items-end overflow-hidden">
        <div className="flex -mb-px h-[2px] w-56">
          <div className="w-full flex-none bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent blur-sm" />
        </div>
      </div>

      <div className="max-w-7xl my-28 mx-auto text-sm text-gray-400 flex flex-col justify-between md:px-8">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Brand section */}
          <div className="mb-10 md:mb-0 max-w-md">
            <Logo />
            <p className="mt-4 text-gray-400 leading-relaxed">
              Build intelligent AI agents that work 24/7 to automate tasks, connect to thousands of tools, and scale your business operations effortlessly.
            </p>
            <div className="mt-6">
              <Link
                href="/auth"
                variant="yellow"
            className="inline-flex items-center px-6 py-3"
              >
                Get Started →
              </Link>
            </div>
          </div>

          {/* Links sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-20">
            <div className="flex flex-col space-y-4">
              <h3 className="text-white font-semibold">Product</h3>
              <ul className="space-y-3">
                {product.map((item, idx) => (
                  <li key={`product-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <h3 className="text-white font-semibold">Resources</h3>
              <ul className="space-y-3">
                {resources.map((item, idx) => (
                  <li key={`resource-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <h3 className="text-white font-semibold">Company</h3>
              <ul className="space-y-3">
                {company.map((item, idx) => (
                  <li key={`company-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col space-y-4">
              <h3 className="text-white font-semibold">Legal</h3>
              <ul className="space-y-3">
                {legal.map((item, idx) => (
                  <li key={`legal-${idx}`}>
                    <Link
                      href={item.href}
                      className="hover:text-white transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Yari. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 