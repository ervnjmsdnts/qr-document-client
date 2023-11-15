import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { cn } from '../lib/utils';
import { useMutation, useQuery } from 'react-query';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  title: z.string().min(1),
  amount: z.number().min(1),
  type: z.enum([
    'PAYROLL',
    'MEMORANDUM',
    'PURCHASE_REQUEST',
    'VOUCHER_BILLING',
  ]),
});

type Schema = z.infer<typeof schema>;

const getUser = async (payload: { userId: string | undefined }) => {
  const res = await axios.get(
    `https://qr-document-api.vercel.app/api/admin/get-user`,
    {
      data: { userId: payload.userId },
    },
  );
  return res.data;
};

const generateQr = async (payload: Schema) => {
  const res = await axios.post(
    'https://qr-document-api.vercel.app/api/clerk/generate-qr',
    payload,
  );

  return res.data;
};

export default function GenerateQR() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const { userId } = useParams();

  const { data: user, isLoading: queryLoading } = useQuery({
    queryFn: () => getUser({ userId }),
    enabled: !!userId,
  });

  const { mutate, isLoading: mutateLoading } = useMutation(
    (payload: Schema & { departmentOrigin: string }) => generateQr(payload),
    {
      onSuccess: (data: { url: string }) => {
        setQrCode(data.url);
      },
    },
  );

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 0,
      title: '',
      type: 'MEMORANDUM',
    },
  });

  const submit = (data: Schema) => {
    mutate({ ...data, departmentOrigin: user.department as string });
    form.reset();
  };

  return (
    <div className='max-w-4xl grid place-items-center h-full mx-auto'>
      <div>
        <h1 className='text-2xl text-center mb-4 font-bold'>
          Generate QR Code
        </h1>
        <div className='border flex rounded-lg p-4'>
          <div className='min-w-[400px]'>
            <form
              onSubmit={form.handleSubmit(submit)}
              className='flex flex-col gap-2'>
              <div className='flex flex-col'>
                <label htmlFor='title' className='font-semibold text-zinc-500'>
                  Document Title
                </label>
                <input
                  id='title'
                  className={cn(
                    'p-2 rounded-md form-input',
                    form.formState.errors.title &&
                      'border-red-500 focus-visible:ring-red-400 focus-visible:ring-2 focus-visible:ring-offset-0',
                  )}
                  {...form.register('title')}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='amount' className='font-semibold text-zinc-500'>
                  Amount
                </label>
                <input
                  id='amount'
                  className={cn(
                    'p-2 rounded-md form-input',
                    form.formState.errors.amount &&
                      'border-red-500 focus-visible:ring-red-400 focus-visible:ring-2 focus-visible:ring-offset-0',
                  )}
                  {...form.register('amount', { valueAsNumber: true })}
                />
              </div>
              <div className='flex flex-col'>
                <label htmlFor='type' className='font-semibold text-zinc-500'>
                  Document Type
                </label>
                <select
                  id='type'
                  className={cn(
                    'p-2 rounded-md form-select',
                    form.formState.errors.type &&
                      'border-red-500 focus-visible:ring-red-400 focus-visible:ring-2 focus-visible:ring-offset-0',
                  )}
                  {...form.register('type')}>
                  <option value='MEMORANDUM'>Memorandum</option>
                  <option value='PURCHASE_REQUEST'>Purchase Request</option>
                  <option value='PAYROLL'>Payroll</option>
                  <option value='VOUCHER_BILLING'>Voucher and Billing</option>
                </select>
              </div>
              <button
                disabled={queryLoading || mutateLoading}
                className='p-2 text-white flex items-center justify-center disabled:opacity-50 bg-blue-700 rounded-md'>
                {queryLoading || mutateLoading ? (
                  <Loader2 className='w-5 h-5 animate-spin' />
                ) : (
                  'Generate'
                )}
              </button>
            </form>
          </div>
          <div className='w-px bg-zinc-200 mx-4' />
          <div className='w-64'>
            <h2 className='font-semibold text-lg'>Generated QR Code</h2>
            {qrCode ? (
              <img src={qrCode} className='w-full' alt='QR Code' />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
