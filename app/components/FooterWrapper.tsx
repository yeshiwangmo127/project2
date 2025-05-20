'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Don't show footer on login, register, and user type selection pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/select-user-type') {
    return null;
  }
  
  return <Footer />;
} 