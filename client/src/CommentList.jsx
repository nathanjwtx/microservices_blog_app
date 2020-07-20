// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const CommentList = ({ postId }) => {
	// const [comments, setComments] = useState([]);

	// const fetchData = async () => {
		// const res = await axios.get(
			// `http://localhost:4001/posts/${postId}/comments`,
		// );
		// setComments(res.data);
	// };

	// useEffect(() => {
		// fetchData();
	// }, []);

	// previous method above

import React from 'react'

const CommentList = ({ comments }) => {


	const renderedComments = comments.map(comment => {
		let content

		if (comment.status === 'approved') {
			content = comment.content
		}

		if (comment.status === 'pending') {
			content = 'this comment is pending moderation'
		}

		if (comment.status === 'rejected') {
			content = 'this comment was rejected'
		}

		return <li key={comment.id}>{content}</li>

	});

	return (
		<ul>
			{renderedComments}
		</ul>
	)
};

export { CommentList };
