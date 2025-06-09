import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create AI Agent | Yari',
  description: 'Build custom AI agents for your small business to automate tasks and workflows',
  openGraph: {
    title: 'AI Agent Builder | Yari',
    description: 'Build custom AI agents for your small business to automate tasks and workflows',
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
