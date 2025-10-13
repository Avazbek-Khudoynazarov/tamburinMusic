import type { IClassesBoardReplyItem } from '@/components/UI/Minimal/types/user';
import type { IPostComment } from '@/components/UI/Minimal/types/blog';

import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

import { PostCommentItem } from './post-comment-item';

// ----------------------------------------------------------------------

type Props = {
	comments?: IClassesBoardReplyItem[];
};

export function PostCommentList({ comments = [] }: Props) {
	return (
		<>
			{comments.map((comment) => {
				const postedDate = comment.created_date
					? (comment.created_date instanceof Date
						? comment.created_date
						: new Date(comment.created_date))
					: new Date();
				return (
					<Box key={comment.id}>
						<PostCommentItem
							name={comment.member?.name ?? '알수없음'}
							message={comment.content}
							postedAt={postedDate.toISOString()}
							avatarUrl=""
						/>
					</Box>
				);
			})}

			{/* <Pagination count={8} sx={{ my: { xs: 5, md: 8 }, mx: 'auto' }} /> */}
		</>
	);
}
