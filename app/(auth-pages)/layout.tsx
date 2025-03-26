import Header from '@/components/header';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen w-full">
        {children}
      </div>
    </>
  );
}
