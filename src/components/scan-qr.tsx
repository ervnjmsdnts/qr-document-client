import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { useMutation, useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { getUser } from './actions';
import { Ghost, Loader2 } from 'lucide-react';
import { isAxiosError } from 'axios';
import request from '../lib/axios';

const scanQr = async (payload: {
  documentId: string;
  userDepartment: string;
}) => {
  const res = await request.post('/user/scan-qr', payload);

  return res.data;
};

export default function ScanQR() {
  const [scan, setScan] = useState(false);

  const { userId } = useParams();

  const {
    data: user,
    isLoading: queryLoading,
    error: queryError,
  } = useQuery<{ department: string }>({
    queryKey: ['user', userId],
    queryFn: () => getUser({ userId }),
    enabled: !!userId,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    mutate,
    data,
    error: mutateError,
  } = useMutation(
    (payload: { documentId: string; userDepartment: string }) =>
      scanQr(payload),
    {
      retry: false,
    },
  );

  if (isAxiosError(queryError)) {
    return (
      <div className='flex flex-col text-zinc-600 justify-center items-center h-full'>
        <Ghost className='w-8 h-8' />
        <p className='text-2xl font-semibold'>
          {queryError.response?.data.error}
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto h-full w-full grid place-items-center'>
      <div className='flex flex-col items-center gap-4'>
        {data && data.message ? (
          <p className='text-center'>{data.message}</p>
        ) : null}
        {isAxiosError(mutateError) ? (
          <p className='text-center text-red-400'>
            {mutateError.response?.data.error}
          </p>
        ) : null}
        {scan ? (
          <QrReader
            constraints={{ width: 300, height: 300, channelCount: 1 }}
            className='w-80 bg-zinc-200 h-80'
            scanDelay={1000}
            onResult={(result) => {
              if (result) {
                mutate({
                  documentId: JSON.parse(result.getText()).id,
                  userDepartment: user!.department,
                });
              }
            }}
          />
        ) : (
          <div className='w-80 h-80 bg-zinc-200' />
        )}
        <button
          className='bg-blue-700 text-white flex items-center justify-center disabled:opacity-50 w-full py-2 px-8 rounded-md'
          disabled={queryLoading}
          onClick={() => setScan((prev) => !prev)}>
          {queryLoading ? <Loader2 className='w-5 h-5 animate-spin' /> : 'Scan'}
        </button>
      </div>
    </div>
  );
}
