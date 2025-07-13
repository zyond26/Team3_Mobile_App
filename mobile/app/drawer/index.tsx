import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';

export default function Index() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      router.replace('/drawer/home');
    }
  }, [pathname]);

  return null;
}
