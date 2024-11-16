'use client';
import { LoginPage } from '@/components/Login';
import { PledgyList } from '@/components/PledgyList';
import { useSession } from 'next-auth/react';

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
