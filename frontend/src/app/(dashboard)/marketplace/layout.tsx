import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agent Marketplace | Yari',
  description: 'Discover powerful AI agents designed for small businesses to automate tasks and boost productivity',
  openGraph: {
    title: 'AI Agent Marketplace | Yari',
    description: 'Discover powerful AI agents designed for small businesses to automate tasks and boost productivity',
    type: 'website',
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
