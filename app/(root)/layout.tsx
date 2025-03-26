
import Footer from '@/components/Footer';
import Header from '@/components/header';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen mx-auto">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
