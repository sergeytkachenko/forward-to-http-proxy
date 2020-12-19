import http from "http";

const httpProxyConfig = {
	host: process.env.PROXY_HOST || 'k8s',
	port: process.env.PROXY_PORT || 30880,
};

/**
 * Handle https requests
 * @param req
 * @param socket
 */
function handleHttpsRequest(req, socket) {
	req.on('error', (err) => console.error(err));
	socket.on('error', (err) => console.error(err));
	const proxyOpts = {
		host: httpProxyConfig.host,
		port: httpProxyConfig.port,
		method: 'CONNECT',
		path: req.url,
		headers: {},
	};
	console.log(req.headers['user-agent']);
	const proxy_req = http.request(proxyOpts);
	proxy_req.on('error', (err) => handleError(socket, err));
	proxy_req.on('connect', (instance_req, proxy_socket) => {
		socket.write('HTTP/1.1 200 Connection established\r\n\r\n');
		console.log(`--->${req.url}`);

		proxy_socket.on('end', () => {
			console.log(`END: bytesSent: ${proxy_socket._bytesDispatched}`);
			console.log(`END: bytesReceived: ${proxy_socket.bytesRead}`);
		});
		proxy_socket.on('error', () => {
			console.log(`ERROR: bytesSent: ${proxy_socket._bytesDispatched}`);
			console.log(`ERROR: bytesReceived: ${proxy_socket.bytesRead}`);
		});
		proxy_socket.on('data', (chunks) => {
			// console.log(chunks.byteLength);
		});

		proxy_socket.pipe(socket);
		socket.pipe(proxy_socket);
	});
	proxy_req.on('close', function() {
		console.log(this.res.statusCode, `<---${req.url}`)
	});
	proxy_req.end();
}

const handleError = (socket, err) => {
	console.log(err);
	const text = `HTTP/1.1 500 ${err.toString()}\r\n\r\n`;
	socket.write(text);
	socket.end();
}

export const connect = handleHttpsRequest;
