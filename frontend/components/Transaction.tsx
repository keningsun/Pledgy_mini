import {
  MiniAppSendTransactionPayload,
  MiniKit,
  ResponseEvent,
  SendTransactionErrorCodes,
} from '@worldcoin/minikit-js';
import { useWaitForTransactionReceipt } from '@worldcoin/minikit-react';
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { validateSchema } from '../helpers/validate-schema';
import PledgyABI from '../config/ABI.json';
import {
  createPublicClient,
  decodeAbiParameters,
  http,
  parseAbiParameters,
} from 'viem';
import client from '../config/client';
import { PledgyAddress, WLDAddress } from '../config';

const sendTransactionSuccessPayloadSchema = yup.object({
  status: yup.string<'success'>().oneOf(['success']),
  transaction_status: yup.string<'submitted'>().oneOf(['submitted']),
  transaction_id: yup.string().required(),
  from: yup.string().optional(),
  chain: yup.string().required(),
  timestamp: yup.string().required(),
});

const sendTransactionErrorPayloadSchema = yup.object({
  error_code: yup
    .string<SendTransactionErrorCodes>()
    .oneOf(Object.values(SendTransactionErrorCodes))
    .required(),
  status: yup.string<'error'>().equals(['error']).required(),
});

export const SendTransaction = () => {
  const [transactionData, setTransactionData] = useState<Record<
    string,
    any
  > | null>(null);
  const [receivedSendTransactionPayload, setReceivedSendTransactionPayload] =
    useState<Record<string, any> | null>(null);
  const [tempInstallFix, setTempInstallFix] = useState(0);
  const [
    sendTransactionPayloadValidationMessage,
    setSendTransactionPayloadValidationMessage,
  ] = useState<string | null>();

  const [transactionId, setTransactionId] = useState<string>('');

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error,
    isError,
  } = useWaitForTransactionReceipt({
    client: client as any,
    appConfig: {
      app_id: process.env.NEXT_PUBLIC_STAGING_VERIFY_APP_ID || '',
    },
    transactionId: transactionId,
    pollingInterval: 2000,
  });

  useEffect(() => {
    if (!MiniKit.isInstalled()) {
      console.log('MiniKit is not installed');
      return;
    }

    MiniKit.subscribe(
      ResponseEvent.MiniAppSendTransaction,
      async (payload: MiniAppSendTransactionPayload) => {
        console.log('MiniAppSendTransaction, SUBSCRIBE PAYLOAD', payload);

        if (payload.status === 'error') {
          const errorMessage = await validateSchema(
            sendTransactionErrorPayloadSchema,
            payload
          );

          if (!errorMessage) {
            setSendTransactionPayloadValidationMessage('Payload is valid');
          } else {
            setSendTransactionPayloadValidationMessage(errorMessage);
          }
        } else {
          const errorMessage = await validateSchema(
            sendTransactionSuccessPayloadSchema,
            payload
          );

          if (!errorMessage) {
            setSendTransactionPayloadValidationMessage('Payload is valid');
          } else {
            setSendTransactionPayloadValidationMessage(errorMessage);
          }

          // const responseJson = await response.json();

          setTransactionId(payload.transaction_id);
        }

        setReceivedSendTransactionPayload(payload);
      }
    );

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppSendTransaction);
    };
  }, [tempInstallFix]);

  const onSendTransactionClick = async () => {
    const deadline = Math.floor(
      (Date.now() + 30 * 60 * 1000) / 1000
    ).toString();

    const permitTransfer = {
      permitted: {
        token: WLDAddress,
        amount: '1000000000000000',
      },
      nonce: Date.now().toString(),
      deadline,
    };

    const permitTransferArgsForm = [
      [permitTransfer.permitted.token, permitTransfer.permitted.amount],
      permitTransfer.nonce,
      permitTransfer.deadline,
    ];

    const transferDetails = {
      to: PledgyAddress,
      requestedAmount: '1000000000000000',
    };

    const transferDetailsArgsForm = [
      //   transferDetails.to,
      transferDetails.requestedAmount,
    ];
    try {
      const payload = await MiniKit.commandsAsync.sendTransaction({
        transaction: [
          {
            address: PledgyAddress,
            abi: PledgyABI,
            functionName: 'createGoal',
            args: [
              'title',
              'desc',
              Math.floor(new Date().valueOf() / 1000) + 10000,
              permitTransfer.nonce,
              deadline,
              'PERMIT2_SIGNATURE_PLACEHOLDER_0',
            ],
          },
        ],
        permit2: [
          {
            ...permitTransfer,
            spender: PledgyAddress,
          },
        ],
      });

      setTempInstallFix((prev) => prev + 1);
      setTransactionData(payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid gap-y-2">
      <h2 className="text-2xl font-bold">Transaction</h2>
      <div className="grid gap-y-1">
        <p>Raw string:</p>

        <div className="bg-gray-300 min-h-[100px] p-2">
          <pre className="break-all whitespace-break-spaces max-h-[300px] overflow-y-scroll">
            {transactionData
              ? JSON.stringify(transactionData, null, 3)
              : JSON.stringify(null)}
          </pre>
        </div>
      </div>
      <div className="grid gap-x-2 grid-cols-2">
        <button
          className="bg-black text-white rounded-lg p-4 w-full"
          onClick={onSendTransactionClick}
        >
          Send Transaction
        </button>
      </div>
      {/* <div className="grid gap-x-2 grid-cols-2">
          <button
            className="bg-black text-white rounded-lg p-4 w-full"
            onClick={testNFTPurchase}
          >
            Purchase NFT Permit2
          </button>
          <button
            className="bg-black text-white rounded-lg p-4 w-full"
            onClick={onSendOrbTransactionClick}
          >
            Send Orb
          </button>
        </div> */}

      <div className="grid gap-y-1">
        <p>
          Received from &quot;{ResponseEvent.MiniAppSendTransaction}&quot;:{' '}
        </p>
        <div className="bg-gray-300 min-h-[100px] p-2">
          <pre className="break-all whitespace-break-spaces">
            {JSON.stringify(receivedSendTransactionPayload, null, 2)}
          </pre>
        </div>

        <div className="grid gap-y-1">
          <p>Validation message:</p>
          <p className="bg-gray-300 p-2">
            {sendTransactionPayloadValidationMessage ?? 'No validation'}
          </p>
        </div>

        <div className="grid gap-y-1">
          <p>Verification:</p>
          {/* {sendTransactionVerificationMessage ?? "No verification yet"} */}
          {transactionId && <p>Transaction ID: {transactionId}</p>}
          {isConfirming && <p>Waiting for confirmation...</p>}
          {isConfirmed && <p>Transaction confirmed.</p>}
          {isError && <p>{error?.message}</p>}
        </div>
      </div>
    </div>
  );
};
