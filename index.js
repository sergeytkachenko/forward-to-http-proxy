const http = require('http');
const httpProxyConfig = {
	host: 'k8s',
	port: 30880,
};
const server = http.createServer();
server.on('error', err => console.error(err))
server.on('connect', (req, socket) => connect(req, socket));
server.on('request', (req, res) => request(req, res));
server.listen(8000);
/**
 * Handle https requests
 * @param req
 * @param socket
 */
function connect(req, socket) {
	req.on('error', (err) => console.error(err));
	socket.on('error', (err) => console.error(err));
	const proxyOpts = {
		host: httpProxyConfig.host,
		port: httpProxyConfig.port,
		method: 'CONNECT',
		path: req.url,
		headers: {},
	};
	const proxy_req = http.request(proxyOpts);
	proxy_req.on('error', (err) => console.error(err));
	proxy_req.on('connect', (instance_req, proxy_socket) => {
		proxy_socket.on('error', (err) => console.error(err));
		socket.write('HTTP/1.1 200 Connection established\r\n\r\n');
		proxy_socket.pipe(socket).pipe(proxy_socket);
	});
	proxy_req.end();
}
/**
 * Handle http requests.
 * @param req
 * @param res
 */
function request(req, res) {
	req.on('error', (err) => console.error(err));
	res.on('error', (err) => console.error(err));
	const proxyOpts = {
		path: req.url,
		host: httpProxyConfig.host,
		port: httpProxyConfig.port,
		method: req.method,
		headers: req.headers,
	};
	const proxy_req = http.request(proxyOpts);
	proxy_req.on('error', (err) => console.error(err));
	proxy_req.on('response', (proxy_res) => {
		proxy_res.on('error', (err) => console.error(err));
		// const cleanHeaders = sanitize.headers(proxy_res.headers);
		const cleanHeaders = proxy_res.headers;
		res.writeHead(proxy_res.statusCode, cleanHeaders);
		proxy_res.pipe(res);
	});
	req.pipe(proxy_req);
}
