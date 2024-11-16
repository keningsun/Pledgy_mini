'use client';
import { signIn } from 'next-auth/react';

export const LoginPage = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img src="/assets/logo.png" className="w-20" alt="logo" />
      <p className="text-center font-bold text-3xl mt-3">Pledgy</p>
      <p className="text-center text-md w-80 mt-10">
        Pledgy gamifies goal-setting, letting users set challenges with rewards
        for success or stake-sharing for failure.
      </p>
      <button
        className="btn btn-primary w-80 mt-8"
        onClick={() => signIn('worldcoin')}
      >
        Continue with World ID
      </button>
    </div>
  );
};
