import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiGithub } from 'react-icons/fi';

import styles from './page.module.scss';
import PortfolioGallery from '../../../components/pages/PortfolioGallery/PortfolioGallery';

// Mock data - replace with your actual data source
const portfolioData = [
	{
		id: '1',
		title: 'E-commerce Platform',
		description:
			'A modern e-commerce platform built with Next.js, featuring advanced product management, user authentication, and payment integration.',
		longDescription: `This comprehensive e-commerce solution was developed to provide a seamless shopping experience. The platform includes advanced features such as real-time inventory management, dynamic pricing, and personalized product recommendations.

The project showcases modern web development practices including server-side rendering for optimal performance, progressive web app capabilities for mobile users, and a robust admin dashboard for store management.`,
		demo: 'https://demo-ecommerce.com',
		github: 'https://github.com/username/ecommerce-platform',
		tech: [
			'Next.js',
			'TypeScript',
			'Tailwind CSS',
			'Stripe',
			'Prisma',
			'PostgreSQL',
		],
		year: '2024',
		image: {
			url: 'https://picsum.photos/seed/picsum/200/300',
		},
		gallery: [
			{
				id: '1',
				url: 'https://picsum.photos/seed/picsum/200/300',
				alt: 'E-commerce Platform - Homepage',
				caption: 'Main homepage with product showcase',
			},
			{
				id: '2',
				url: 'https://picsum.photos/seed/picsum/200/300',
				alt: 'E-commerce Platform - Product Details',
				caption: 'Product detail page with specifications',
			},
			{
				id: '3',
				url: 'https://picsum.photos/seed/picsum/200/300',
				alt: 'E-commerce Platform - Shopping Cart',
				caption: 'Shopping cart with checkout process',
			},
			{
				id: '4',
				url: 'https://picsum.photos/seed/picsum/200/300',
				alt: 'E-commerce Platform - Admin Dashboard',
				caption: 'Admin dashboard for store management',
			},
		],
		features: [
			'User authentication and authorization',
			'Product catalog with search and filtering',
			'Shopping cart and checkout process',
			'Payment integration with Stripe',
			'Admin dashboard for store management',
			'Responsive design for all devices',
		],
		challenges: [
			'Implementing real-time inventory updates',
			'Optimizing performance for large product catalogs',
			'Ensuring secure payment processing',
			'Creating an intuitive admin interface',
		],
		solutions: [
			'Used WebSocket connections for real-time updates',
			'Implemented efficient caching strategies',
			'Followed PCI DSS compliance guidelines',
			'Conducted extensive user testing and feedback',
		],
	},
	{
		id: '2',
		title: 'Task Management App',
		description:
			'A collaborative task management application with real-time updates and team collaboration features.',
		longDescription: `This task management application was designed to improve team productivity and project coordination. The app features real-time collaboration, task assignment, progress tracking, and comprehensive reporting.

Built with modern technologies, the application provides an intuitive interface for managing complex projects while maintaining simplicity for everyday use.`,
		demo: 'https://task-app-demo.com',
		github: 'https://github.com/username/task-management',
		tech: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
		year: '2023',
		image: {
			url: 'https://picsum.photos/seed/picsum/200/300',
		},
		gallery: [
			{
				id: '1',
				url: 'https://picsum.photos/seed/picsum/200/300',
				alt: 'Task Management App - Dashboard',
				caption: 'Main dashboard with task overview',
			},
			{
				id: '2',
				url: 'https://picsum.photos/seed/picsum/200/300',
				alt: 'Task Management App - Task Creation',
				caption: 'Creating and editing tasks',
			},
			{
				id: '3',
				url: 'https://picsum.photos/seed/picsum/200/300',
				alt: 'Task Management App - Team View',
				caption: 'Team collaboration interface',
			},
			{
				id: '4',
				url: 'https://picsum.photos/seed/picsum/200/300',
				alt: 'Task Management App - Analytics',
				caption: 'Progress tracking and analytics',
			},
		],
		features: [
			'Real-time task updates',
			'Team collaboration tools',
			'Project timeline visualization',
			'File sharing and attachments',
			'Progress tracking and analytics',
			'Mobile-responsive design',
		],
		challenges: [
			'Managing real-time state synchronization',
			'Handling concurrent user interactions',
			'Optimizing database queries',
			'Ensuring data consistency',
		],
		solutions: [
			'Implemented WebSocket connections for real-time updates',
			'Used optimistic UI updates with conflict resolution',
			'Applied database indexing and query optimization',
			'Implemented proper error handling and rollback mechanisms',
		],
	},
];

interface PortfolioDetailsPageProps {
	params: {
		id: string;
	};
}

export async function generateMetadata({
	params,
}: PortfolioDetailsPageProps): Promise<Metadata> {
	const project = portfolioData.find((p) => p.id === params.id);

	if (!project) {
		return {
			title: 'Project Not Found',
		};
	}

	return {
		title: `${project.title} - Portfolio Details`,
		description: project.description,
	};
}

export default function PortfolioDetailsPage({
	params,
}: PortfolioDetailsPageProps) {
	const project = portfolioData.find((p) => p.id === params.id);

	if (!project) {
		notFound();
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<Link href="/" className={styles.backButton}>
					<FiArrowLeft size={20} />
					<span>Back to Portfolio</span>
				</Link>
				<div className={styles.projectNumber}>
					{String(parseInt(project.id)).padStart(2, '0')}
				</div>
			</div>

			<div className={styles.content}>
				<div className={styles.mainSection}>
					<div className={styles.projectHeader}>
						<h1 className={styles.projectTitle}>{project.title}</h1>
						{project.year && (
							<p className={styles.projectYear}>{project.year}</p>
						)}
					</div>

					<div className={styles.projectImage}>
						<img src={project.image.url} alt={project.title} />
					</div>

					<div className={styles.projectDescription}>
						<p>{project.longDescription}</p>
					</div>

					{project.gallery && project.gallery.length > 0 && (
						<PortfolioGallery
							images={project.gallery}
							title="Project Gallery"
						/>
					)}

					<div className={styles.projectLinks}>
						{project.demo && (
							<a
								href={project.demo}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.projectLink}
							>
								<FiExternalLink size={20} />
								<span>Live Demo</span>
							</a>
						)}
						{project.github && (
							<a
								href={project.github}
								target="_blank"
								rel="noopener noreferrer"
								className={styles.projectLink}
							>
								<FiGithub size={20} />
								<span>View Code</span>
							</a>
						)}
					</div>
				</div>

				<div className={styles.sidebar}>
					<div className={styles.techSection}>
						<h3 className={styles.sectionTitle}>Technologies</h3>
						<div className={styles.techTags}>
							{project.tech?.map((tech, index) => (
								<span key={index} className={styles.techTag}>
									{tech}
								</span>
							))}
						</div>
					</div>

					<div className={styles.featuresSection}>
						<h3 className={styles.sectionTitle}>Key Features</h3>
						<ul className={styles.featuresList}>
							{project.features.map((feature, index) => (
								<li key={index} className={styles.featureItem}>
									{feature}
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
