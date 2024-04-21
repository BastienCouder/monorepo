'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Header } from '@/components/auth/header';
import { Social } from '@/components/auth/social';
import { BackButton } from '@/components/auth/back-button';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { FcLeft } from 'react-icons/fc';
import { MoveLeftIcon } from 'lucide-react';

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {

  return (
    <Card className="w-[450px] space-y-2 shadow-md rounded-md">
      <CardHeader className='p-0'>
        <Header />
      </CardHeader>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <div className="w-full flex items-center px-6">
        <div className="w-1/2 h-1 bg-primary"></div>
        <p className="px-8 -mt-1 flex justify-center items-center font-bold">
          or
        </p>
        <div className="w-1/2 h-1 bg-primary"></div>
      </div>
      <CardContent className='pt-4 pb-0'>{children}</CardContent>
      <CardFooter className='flex flex-col gap-2'>
        <BackButton label={backButtonLabel} href={backButtonHref} />
        <Link href={'/'} className='w-full flex justify-center items-center '>
          <Button className='w-1/2'>Back to app</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
