import http from 'http';
import { connect } from "./https.js";
import { request } from "./http.js";

const server = http.createServer();
server.on('error', err => console.error(err))
server.on('connect', (req, socket) => connect(req, socket));
server.on('request', (req, res) => request(req, res));
const port = parseInt(process.env.PORT) || 80;
server.listen(port);
process.on('SIGINT', function() {
	console.log("Caught interrupt signal");
	process.exit();
});
console.log(`SERVER listen on ${port} port...`);
