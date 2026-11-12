import type { Meta, StoryObj } from '@storybook/nextjs';
import { createElement } from 'react';

import Modal from 'components/utilities/Modal/Modal';

import CertificationModal from './CertificationModal';

const meta: Meta<typeof CertificationModal> = {
	title: 'Homepage/CertificationModal',
	component: CertificationModal,
	parameters: { layout: 'fullscreen' },
	decorators: [
		(Story) =>
			createElement(Modal, {
				isOpen: true,
				onClose: () => {},
				title: 'Certification',
				eyebrow: '03 / 14',
				children: createElement(Story),
			}),
	],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
	args: {
		certification: {
			name: 'Databricks Certified Generative AI Engineer Associate',
			provider: 'Databricks',
			logo: '/databricks.svg',
			issuedDate: '2026-10-01',
			expiryDate: '2028-10-01',
			credentialId: '158342917',
			certificateUrl: 'https://credentials.databricks.com/',
			description:
				'Validates the ability to design and implement LLM-enabled solutions with Databricks: RAG pipelines, vector search, chains, evaluation and governance.',
			skills: ['RAG', 'Vector Search', 'LangChain', 'MLflow', 'Unity Catalog'],
		},
	},
};

export const Expired: Story = {
	args: {
		certification: {
			name: 'HubSpot Inbound Marketing',
			provider: 'HubSpot Academy',
			logo: '/hubspot.svg',
			issuedDate: '2022-03-01',
			expiryDate: '2024-03-01',
		},
	},
};
