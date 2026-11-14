'use client';
import dynamic from 'next/dynamic';

/** CommandPalette loaded on the client only. */
export default dynamic(() => import('./CommandPalette'), { ssr: false });
