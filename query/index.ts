const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts:any = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/events', (req, res) => {
	const { type, data } = req.body;

	type Post = {
		id: string,
		title: string,
		comments?: []
	}
	let post = {} as Post;

	if (type === 'PostCreated') {
		const { id, title } = data;
		post.id = id;
		post.title = title;

		posts[id] = post;
	}

	if (type === 'CommentCreated') {
		const { id, content, postId } = data;
		post.id = id;


		const updatedPost = posts[postId] as Post;
		updatedPost.comments.push({id, content});
	}

	console.log(posts);

	res.send({});

});

app.listen(4002, () => {
	console.log('listening on 4002');
});