'use client';

import { PayBlock } from '@/components/Pay';
import { SignIn } from '@/components/SignIn';
import { VerifyBlock } from '@/components/Verify';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LoginPage } from '@/components/Login';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <LoginPage />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-y-3">
      <VerifyBlock />
      <PayBlock />
    </main>
  );
}
