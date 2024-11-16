import client from '../config/client';
import ABI from '../config/ABI.json';
import { PledgyAddress } from '../config';

export const readContract = async (functionName: string, args: any) => {
  const contract = await client.readContract({
    address: PledgyAddress,
    abi: ABI,
    functionName: functionName,
    args: args,
  });

  return contract;
};
