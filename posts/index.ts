const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (_req: any, res: { send: (arg0: {}) => void; }) => {
	res.send(posts);
});

app.post('/posts', (req: { body: { title: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: any): void; new(): any; }; }; }) => {
	const id = randomBytes(4).toString('hex');
	const { title } = req.body;

	posts[id] = {
		id, title
	};

	res.status(201).send(posts[id]);
});

app.listen(4000, () => {
	console.log('listening on port 4000');
});
