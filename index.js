import http from 'http';
import { connect } from "./https.js";
import { request } from "./http.js";

const server = http.createServer();
server.on('error', err => console.error(err))
server.on('connect', (req, socket) => connect(req, socket));
server.on('request', (req, res) => request(req, res));
server.listen(8000);
