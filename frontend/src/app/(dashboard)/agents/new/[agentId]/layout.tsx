import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Agent | Yari',
  description: 'Interactive agent playground powered by Yari',
  openGraph: {
    title: 'Agent Playground | Yari',
    description: 'Interactive agent playground powered by Yari',
    type: 'website',
  },
};

export default function NewAgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
