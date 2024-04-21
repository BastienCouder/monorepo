'use client';

import { EdgeStoreRouter } from '@/app/api/edge/[...edgestore]/route';
import { createEdgeStoreProvider } from '@edgestore/react';

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 2,
  });

export { EdgeStoreProvider, useEdgeStore };
