'use client';
import dynamic from 'next/dynamic';

/** Toast loaded on the client only. */
export default dynamic(() => import('./Toast'), { ssr: false });
