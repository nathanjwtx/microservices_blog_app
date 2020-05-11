const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let posts = {};

app.get('/posts', (req, res) => {
	res.send(posts);
});

app.post('/posts', async (req, res) => {
	const id = randomBytes(4).toString('hex');
	const title = req.body.title;

	posts[id] = { id, title };

	let event = {};
	event.type = 'PostCreated';
	event.data = posts[id];

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
