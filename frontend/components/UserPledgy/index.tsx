'use client';
import { Header } from '../Header';
import { useRouter } from 'next/navigation';

export const UserPledgy = () => {
  const router = useRouter();
  return (
    <div>
      <Header title="Pledgy" onClick={() => router.back()} />
      <div className="flex flex-col justify-center items-center mx-3">
        <img
          src="/assets/img-join.png"
          alt="join"
          width={200}
          className="mt-10"
        />
        <div className="w-full p-2.5 bg-[#f6f6f6] rounded-lg flex-col justify-start items-start gap-2 inline-flex mt-16">
          <div className="h-5 relative flex items-center justify-between w-full">
            <div className="text-black text-sm font-normal font-['Inter'] leading-tight">
              Pledge Pool Price
            </div>
            <div className="text-right text-black text-sm font-normal font-['Inter'] leading-tight">
              0.001 ETH
            </div>
          </div>
          <div className="h-5 relative flex items-center justify-between w-full">
            <div className="text-black text-sm font-normal font-['Inter'] leading-tight">
              Challenge Start with
            </div>
            <div className="text-right text-black text-sm font-normal font-['Inter'] leading-tight">
               0.000002 ETH
            </div>
          </div>
        </div>
        <div className="h-5 relative flex items-center justify-between w-full mt-24">
          <div className="text-black text-sm font-normal font-['Inter'] leading-tight">
            The amount you stake now
          </div>
          <div className="text-right text-black text-sm font-normal font-['Inter'] leading-tight">
            0.001 ETH
          </div>
        </div>
        <button className="btn btn-primary m-1  w-full" onClick={() => {}}>
          Create Now
        </button>
      </div>
    </div>
  );
};
