'use client';
import dynamic from 'next/dynamic';

/** ConsentBanner loaded on the client only. */
export default dynamic(() => import('./ConsentBanner'), { ssr: false });
