import { ReactNode } from 'react';

// Root layout is a passthrough — html/body are provided by [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
