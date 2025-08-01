// import { redirect } from 'next/navigation';

// export default function Page(): never {
//   redirect('/dashboard');
// }


'use client';

import { Providers } from '@/app/providers';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}
