'use client';
import { Header } from '../Header';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '../Select';

export const CreatePledgy = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('onChain');
  const [rule, setRule] = useState('onChain');
  const [endTime, setEndTime] = useState('');

  const options = [
    { value: 'onChain', label: 'Onchain' },
    { value: 'github', label: 'Github' },
  ];
  const ruleOptions = [
    { value: 'onChain', label: 'Onchain' },
    { value: 'github', label: 'Github' },
  ];
  const endTimeOptions = [
    { value: '1', label: '1 day' },
    { value: '3', label: '5 days' },
    { value: '5', label: '5 days' },
    { value: '7', label: '7 days' },
  ];
  return (
    <div>
      <Header title="Create Pledgy" onClick={() => router.back()} />
      <div className="my-4">
        <div className="px-3">
          <div className="flex flex-col gap-3">
            <div className="text-black text-base font-semibold font-['Inter'] leading-snug">
              Title
            </div>
            <input
              className="w-100 h-10 p-4 bg-[#f6f6f6] rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="text-black text-base font-semibold font-['Inter'] leading-snug">
              Description
            </div>
            <textarea
              className="w-100 h-24 p-4 bg-[#f6f6f6] rounded-lg"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="w-100 mt-2">
          <div className="w-full px-4 border-b border-[#e6e6e6] justify-center items-center gap-3 inline-flex">
            <div className="w-1/3 text-black text-base font-semibold font-['Inter'] leading-snug">
              End Time
            </div>
            <Select
              options={endTimeOptions}
              placeholder="End Time"
              onChange={(e) => setRule(e.target.value)}
            />
          </div>
          <div className="w-full px-4 border-b border-[#e6e6e6] justify-center items-center gap-3 inline-flex">
            <div className="w-24 text-black text-base font-semibold font-['Inter'] leading-snug">
              Type
            </div>
            <Select
              options={options}
              placeholder="Choose Type"
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div className="w-full px-4 border-b border-[#e6e6e6] justify-center items-center gap-3 inline-flex">
            <div className="w-24 text-black text-base font-semibold font-['Inter'] leading-snug">
              Rules
            </div>
            <Select
              options={ruleOptions}
              placeholder="Pledgy Starter Rule"
              onChange={(e) => setRule(e.target.value)}
            />
          </div>

          <div className="px-3">
            <div className="w-full h-24 p-2.5 bg-[#f6f6f6] rounded-lg flex-col justify-start items-start gap-2 inline-flex mt-8">
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
              <div className="h-5 relative flex items-center justify-between w-full">
                <div className="text-black text-sm font-normal font-['Inter'] leading-tight">
                  Challenger Cap
                </div>
                <div className="text-right text-black text-sm font-normal font-['Inter'] leading-tight">
                  50 ETH
                </div>
              </div>
            </div>
            <div className="h-5 relative flex items-center justify-between w-full mt-10">
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
      </div>
    </div>
  );
};
