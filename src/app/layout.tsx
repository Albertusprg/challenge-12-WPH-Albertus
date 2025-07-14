import Navbar from '@/components/layout/Navbar';
import './globals.css';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';
import { UserProvider } from '@/context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <UserProvider>
          <Navbar />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
