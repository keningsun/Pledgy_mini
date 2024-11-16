'use client';

import { PayBlock } from '@/components/Pay';
import { SignIn } from '@/components/SignIn';
import { VerifyBlock } from '@/components/Verify';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LoginPage } from '@/components/Login';
import { PledgyList } from '@/components/PledgyList';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    return <LoginPage />;
  }

  return (
    <main className="min-h-screen py-4 px-3">
      <PledgyList />
    </main>
  );
}
