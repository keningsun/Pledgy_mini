'use client';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const PledgyItem = ({
  title,
  desc,
  endTime,
  goalId,
}: {
  title: string;
  desc: string;
  endTime: string;
  goalId: string;
}) => {
  const router = useRouter();
  const isOver = new Date(endTime) < new Date();
  return (
    <div className="w-full p-2.5 pb-0 bg-[#f6f6f6] rounded-lg flex-col justify-start items-end gap-8 inline-flex mt-5">
      <div className="pr-1 pb-3 justify-start items-center inline-flex">
        <div className="w-100 self-stretch flex-col justify-start items-start gap-3 inline-flex">
          <div className="w-72 justify-start items-center gap-24 inline-flex">
            <div className="w-64 flex-col justify-start items-start inline-flex">
              <div className="self-stretch justify-start items-start gap-2.5 inline-flex">
                <div className="text-black text-sm font-semibold font-['Inter'] leading-tight">
                  {title}
                </div>
                <div className="grow shrink basis-0 text-black text-sm font-normal font-['Inter'] leading-tight">
                  0.01 WLD
                </div>
              </div>
              <div className="self-stretch text-[#828282] text-xs font-normal font-['Inter'] leading-none">
                {dayjs(endTime).fromNow()}
              </div>
            </div>
          </div>
          <div className="h-24 flex-col justify-center items-start gap-3 flex">
            <div className="self-stretch text-black text-sm font-normal font-['Inter'] leading-tight">
              {desc}
            </div>
            <div className="self-stretch justify-between items-center inline-flex">
              <div className="grow shrink basis-0 h-5 justify-start items-center gap-4 flex">
                <div className="justify-start items-center gap-2 flex">
                  <img src="/assets/loader.svg" alt="loading" />
                  <div className="text-black text-sm font-medium font-['Inter'] leading-tight">
                    6 Challengers
                  </div>
                </div>
              </div>
              <div
                className="w-24 h-8 px-4 bg-black rounded-lg justify-center items-center gap-2 flex"
                onClick={() => {
                  if (isOver) {
                    router.push(`/result?goalId=${goalId}`);
                  } else {
                    router.push(`/pledgy?goalId=${goalId}`);
                  }
                }}
              >
                <div className="text-white text-sm font-medium font-['Inter'] leading-tight">
                  {isOver ? 'Result' : 'Challenge'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PledgyList = () => {
  const router = useRouter();
  return (
    <div>
      <div className="h-14 flex justify-between items-center">
        <div className="w-1/2">
          <p className="font-bold text-xl">Pledgy</p>
        </div>
        <img
          src="/assets/add.svg"
          alt="add"
          onClick={() => router.push('/create')}
        />
      </div>
      <PledgyItem
        title="Pledgy Bet 01"
        desc="The current address balance reaches 1K USDC.e after 12 hours"
        endTime="2024-11-16T10:00:00.000Z"
        goalId="1"
      />
      <PledgyItem
        title="Pledgy Bet 02"
        desc="The current address balance reaches 100 USDC.e after 12 hours"
        endTime="2024-11-16T08:00:00.000Z"
        goalId="2"
      />
    </div>
  );
};
