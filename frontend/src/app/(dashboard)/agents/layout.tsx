import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agent Conversation | Yari',
  description: 'Interactive AI agent conversation helping small businesses automate tasks and boost productivity',
  openGraph: {
    title: 'AI Agent Conversation | Yari',
    description: 'Interactive AI agent conversation helping small businesses automate tasks and boost productivity',
    type: 'website',
  },
};

export default function AgentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
