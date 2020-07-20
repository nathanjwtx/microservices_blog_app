const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];

	// added a default status to allow time for the moderation service to do
	// its job
	comments.push({ id: commentId, content, status: 'pending' });

	commentsByPostId[req.params.id] = comments;

	// send comment to the query service so db has comment immediately
	// regardless of status
	await axios.post('http://localhost:4005/events', {
		type: 'CommentCreated',
		data: {
			id: commentId,
			content,
			postId: req.params.id,
			status: 'pending'
		}
	})

	res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
	console.log('received event', req.body.type);

	const { type, data } = req.body
	
	if (type === 'CommentModerated') {
		const { id, postId, status, content } = data

		const comments = commentsByPostId[postId]

		const comment = comments.find(c => {
			return c.id === id
		})

		comment.status = status

		// send moderated comment to event-bus
		await axios.post('http://localhost:4005/events', {
			type: 'CommentUpdated',
			data: {
				id,
				status,
				postId,
				content
			}
		})
	}

	res.send({});
});

app.listen(4001, () => {
	console.log('Comments service listening on port 4001');
});