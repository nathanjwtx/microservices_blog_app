const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

type Post = {
	id: string,
	title: string,
	comments?: []
};

let posts:any = {};

app.get('/posts', (_req: any, res: { send: (arg0: {}) => void; }) => {
	res.send(posts);
});

app.post('/posts', async (req: { body: { title: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
	const id = randomBytes(4).toString('hex');

	const post = {} as Post;
	post.id = id;
	post.title = req.body.title;
	posts[id] = post;

	type Event = {
		type: string,
		data: Post
	};

	let event = {} as Event;
	event.type = 'PostCreated';
	event.data = post;

	await axios.post('http://localhost:4005/events', event);

	res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
	console.log('received event', req.body.type);

	res.send({});
});

app.listen(4000, () => {
	console.log('listening on port 4000');
});
