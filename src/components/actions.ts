import request from '../lib/axios';

export const getUser = async (payload: { userId: string | undefined }) => {
  const res = await request.get('/admin/get-user', {
    params: { userId: payload.userId },
  });
  return res.data;
};
