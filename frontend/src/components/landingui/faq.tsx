"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const FAQs = [
  {
    question: "How do Yari AI agents differ from regular chatbots?",
    answer:
      "Unlike simple chatbots that just respond to messages, Yari agents are generalist AI that can perform actual tasks. They can research competitors, draft proposals, manage your social media, analyze data, and connect to thousands of tools through MCP servers. Think of them as digital employees that work 24/7.",
  },
  {
    question: "What are MCP servers and how do they help my business?",
    answer:
      "MCP (Model Context Protocol) servers are integrations that connect your AI agents to various tools and services. With access to 1000+ MCP servers, your agents can connect to your CRM, email, social media, databases, APIs, and virtually any business tool you use, making them incredibly powerful and versatile.",
  },
  {
    question: "Can I customize how my AI agents look and behave?",
    answer:
      "Absolutely! Yari offers extensive customization options. You can brand your agents with custom styling, set their personality and tone, define their expertise areas, and even white-label the entire solution for your business. Your agents can perfectly match your brand and business needs.",
  },
  {
    question: "How quickly can I set up and deploy an AI agent?",
    answer:
      "You can have your first AI agent running in minutes! Our platform automatically creates agents based on your business needs. Simply describe what you want your agent to do, and Yari will configure it with the right tools, knowledge, and capabilities to get started immediately.",
  },
  {
    question: "What kind of tasks can Yari agents handle?",
    answer:
      "Yari agents can handle a wide range of business tasks including customer support, lead qualification, content creation, data analysis, research, social media management, email marketing, appointment scheduling, and much more. They can search the web, access your business tools, and perform complex multi-step workflows.",
  },
  {
    question: "Is my business data secure with Yari?",
    answer:
      "Security is our top priority. We use enterprise-grade encryption, secure data handling practices, and comply with industry standards. Your data is processed securely and you maintain full control over what information your agents can access and how it's used.",
  },
];

export function FrequentlyAskedQuestions() {
  const [open, setOpen] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto my-10 md:my-20 py-10 md:py-20 px-4 md:px-8">
      <div className="text-balance relative z-20 mx-auto mb-4 max-w-4xl text-center">
        <h2
          className={cn(
            "inline-block text-3xl md:text-6xl bg-[radial-gradient(61.17%_178.53%_at_38.83%_-13.54%,#3B3B3B_0%,#888787_12.61%,#FFFFFF_50%,#888787_80%,#3B3B3B_100%)]",
            "bg-clip-text text-transparent"
          )}
        >
          Frequently Asked Questions
        </h2>
      </div>
      <p className="max-w-lg text-sm text-center mx-auto mt-4 text-neutral-400 px-4 md:px-0">
        Everything you need to know about Yari AI agents and how they can transform your business operations.
      </p>
      <div className="mt-10 md:mt-20 max-w-3xl mx-auto divide-y divide-neutral-800">
        {FAQs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={open}
            setOpen={setOpen}
          />
        ))}
      </div>
    </div>
  );
}

const FAQItem = ({
  question,
  answer,
  setOpen,
  open,
}: {
  question: string;
  answer: string;
  open: string | null;
  setOpen: (open: string | null) => void;
}) => {
  const isOpen = open === question;

  return (
    <motion.div
      className="cursor-pointer py-4 md:py-6 hover:bg-neutral-900/30 rounded-lg px-4 transition-colors duration-200"
      onClick={() => {
        if (isOpen) {
          setOpen(null);
        } else {
          setOpen(question);
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="pr-8 md:pr-12">
          <h3 className="text-base md:text-lg font-medium text-neutral-200 hover:text-yellow-400 transition-colors duration-200">
            {question}
          </h3>
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden text-sm md:text-base text-neutral-400 mt-2"
              >
                <p>{answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative mr-2 md:mr-4 mt-1 h-5 w-5 md:h-6 md:w-6 flex-shrink-0">
          <motion.div
            animate={{
              scale: isOpen ? [0, 1] : [1, 0, 1],
              rotate: isOpen ? 90 : 0,
              marginLeft: isOpen ? "1.5rem" : "0rem",
            }}
            initial={{ scale: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className={cn(
              "absolute inset-0 h-5 w-5 md:h-6 md:w-6 transform transition-colors duration-200",
              isOpen ? "text-yellow-400" : "text-neutral-500"
            )} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}; 