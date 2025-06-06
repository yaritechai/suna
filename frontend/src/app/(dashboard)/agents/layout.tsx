import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agent Conversation | Yari',
  description: 'Interactive agent conversation powered by Yari',
  openGraph: {
    title: 'Agent Conversation | Yari',
    description: 'Interactive agent conversation powered by Yari',
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
