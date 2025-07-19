import Navbar from '@/components/layout/Navbar';
import './globals.css';
import Footer from '@/components/layout/Footer';
import { Inter } from 'next/font/google';
import { UserProvider } from '@/context/UserContext';
import { ToastProvider } from '@/context/ToastContext';

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
          <ToastProvider>
            <Navbar />
            {children}
            <Footer />
          </ToastProvider>
        </UserProvider>
      </body>
    </html>
  );
}
