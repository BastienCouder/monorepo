import React from 'react';
import ActionsFolder from './_components/actions-folder';

export default async function Myfolders() {
  return (
    <section className="w-full space-y-6 lg:pr-4">
      <h1 className="font-bold text-2xl">My folders</h1>
      <ActionsFolder />
    </section>
  );
}
