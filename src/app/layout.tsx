import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simulator Serkom Laravel - Aplikasi Pemesanan Makanan (Ujikom LSP)',
  description:
    'Interactive 3-Panel EdTech Coding Simulator guiding candidates end-to-end through Laravel Certification Exam (PANDUAN_LENGKAP_SERKOM_PESAN_MAKAN.md).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark h-full">
      <body className="h-full antialiased overflow-hidden flex flex-col bg-[#09090b]">
        {children}
      </body>
    </html>
  );
}
