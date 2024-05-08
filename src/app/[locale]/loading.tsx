'use client';

import Spinner from '@/components/spinner';

export default function Loading() {
  return (
    <div className="h-screen w-full flex justify-center items-center bg-bacground">
      <div className="atom-container">
        <div className="atom-core"></div>
        <div className="orbit first"></div>
        <div className="orbit second"></div>
        <div className="orbit third"></div>
        <div className="orbit fourth"></div>
      </div>
    </div>
  );
}
