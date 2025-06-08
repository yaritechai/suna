import { Navbar } from '@/components/landingui/navbar';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-zinc-950">
      <Navbar />
      {children}
    </div>
  );
}
