import { Navbar } from '@/components/landingui/navbar';

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />
      {children}
    </div>
  );
}
