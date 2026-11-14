'use client';
import dynamic from 'next/dynamic';

/** FloatingChat loaded on the client only. */
export default dynamic(() => import('./FloatingChat'), { ssr: false });
