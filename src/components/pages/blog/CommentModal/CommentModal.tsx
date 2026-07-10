'use client';
import type { FC } from 'react';

import { CommentForm } from 'components/pages';
import { Modal } from 'components/utilities';
import type { CommentFormData } from 'types/comment';

interface CommentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CommentFormData) => Promise<void>;
	replyingTo?: string;
	replyingToId?: string;
	onCancelReply?: () => void;
	title?: string;
}

/**
 * CommentModal component for displaying comment forms in a modal overlay
 */
const CommentModal: FC<CommentModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
	replyingTo,
	replyingToId,
	onCancelReply,
	title = 'Add Comment',
}) => {
	const handleCancelReply = () => {
		if (onCancelReply) {
			onCancelReply();
		}
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={title}>
			<CommentForm
				onSubmit={onSubmit}
				replyingTo={replyingTo}
				replyingToId={replyingToId}
				onCancelReply={handleCancelReply}
			/>
		</Modal>
	);
};

export default CommentModal;
