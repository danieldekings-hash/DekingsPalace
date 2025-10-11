import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.scss';

export const metadata: Metadata = {
  title: 'DeKingsPalace - Premium Investment Plans',
  description: 'Secure and profitable investment opportunities with DeKingsPalace',
  keywords: ['investment', 'finance', 'trading', 'cryptocurrency'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
