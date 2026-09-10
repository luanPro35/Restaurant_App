import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dolin Admin Portal | Quản Trị Nhà Hàng',
  description: 'Hệ thống Quản trị Nhà Hàng Dolin chuyên nghiệp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={jakarta.variable}>
      <body className="bg-[#F8FAFC] text-slate-800 antialiased font-sans selection:bg-[#E07B39]/20 selection:text-[#E07B39]">
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
