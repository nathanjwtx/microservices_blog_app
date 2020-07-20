const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/events', (req, res) => {
	const { type, data } = req.body;

	if (type === 'PostCreated') {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] }
	}

	if (type === 'CommentCreated') {
		const { id, content, postId, status } = data;

		const updatedPost = posts[postId];
		updatedPost.comments.push({id, content, status});
	}

	if (type === 'CommentUpdated') {
		const { id, content, postId, status } = data;
		
		const post = posts[postId]
		const comment = post.comments.find(c => {
			return c.id === id
		})

		// updating existing item not adding a new one
		comment.status = status
		comment.content = content
	}

	console.log(posts);

	res.send({});

});

app.listen(4002, () => {
	console.log('Query service listening on 4002');
});