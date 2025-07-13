import type { ReactNode } from 'react';

interface PortfolioLayoutProps {
	children: ReactNode;
}

export default function PortfolioLayout({ children }: PortfolioLayoutProps) {
	return <>{children}</>;
}
