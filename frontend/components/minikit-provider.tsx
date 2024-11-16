'use client'; // Required for Next.js

import { MiniKit } from '@worldcoin/minikit-js';
import { ReactNode, useEffect } from 'react';

const appId = process.env.APP_ID;
export default function MiniKitProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    MiniKit.install(appId);
    console.log(MiniKit.isInstalled());
  }, []);

  return <>{children}</>;
}
