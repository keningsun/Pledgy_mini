'use client';
import { Header } from '../Header';
import { useRouter, useSearchParams } from 'next/navigation';

export const Result = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const goalId = searchParams.get('goalId');

  return (
    <div>
      <Header title="Pledgy" onClick={() => router.back()} />
      <div className="flex flex-col justify-center items-center mx-3">
        <p className="text-black text-2xl font-bold font-['Inter'] leading-tight mt-16">
          Pledger Success
        </p>
        <img
          src="/assets/img-result.png"
          alt="result"
          width={200}
          className="mt-2"
        />

        <div className="h-5 relative flex items-center justify-between w-full mt-24 mb-3">
          <div className="text-black text-sm font-normal font-['Inter'] leading-tight">
            Claimable Balance
          </div>
          <div className="text-right text-black text-sm font-normal font-['Inter'] leading-tight">
            0 WLD
          </div>
        </div>
        <button className="btn btn-primary m-1  w-full" onClick={() => {}}>
          Claim
        </button>
      </div>
    </div>
  );
};
