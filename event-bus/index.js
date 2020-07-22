const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// this will hold all events so that a stopped service can pick up where it
// left off if it has stopped and been restarted
const events = []

app.post('/events', (req, res) => {
	const event = req.body;

	events.push(event)

	// event-bus sends out the event to all microservices upon receipt
	// each microservice may or may not do something with it
	axios.post('http://localhost:4000/events', event);
	axios.post('http://localhost:4001/events', event);
	axios.post('http://localhost:4002/events', event);
	axios.post('http://localhost:4003/events', event)

	res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
	console.log('events called for');
	res.send(events)
})

app.listen(4005, () => {
	console.log('Event-bus listening on port 4005');
})