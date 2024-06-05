'use client';

import useActiveChannel from '@/hooks/use-active-channel';

const ActiveStatus = () => {
  useActiveChannel();
  return null;
};

export default ActiveStatus;
