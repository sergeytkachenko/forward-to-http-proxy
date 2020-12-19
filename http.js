import http from "http";

const httpProxyConfig = {
	host: process.env.PROXY_HOST || 'k8s',
	port: parseInt(process.env.PROXY_PORT) || 30880,
};

/**
 * Handle http requests.
 * @param req
 * @param res
 */
function handleHttpRequest(req, res) {
	if (req.url === '/liveness' || req.url === '/readiness') {
		res.writeHead(200);
		res.end();
		return;
	}
	const proxyOpts = {
		path: req.url,
		host: httpProxyConfig.host,
		port: httpProxyConfig.port,
		method: req.method,
		headers: req.headers,
	};
	const proxy_req = http.request(proxyOpts);
	proxy_req.on('error', (err) => handleError(res, err));
	proxy_req.on('response', (proxy_res) => {
		proxy_res.on('error', (err) => handleError(res, err));
		res.writeHead(proxy_res.statusCode, proxy_res.headers);
		proxy_res.pipe(res);
	});
	req.pipe(proxy_req);
}

const handleError = (res, err) => {
	console.log(err);
	res.writeHead(500);
	res.end(err.toString());
}

export const request = handleHttpRequest;
