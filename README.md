# forward-to-http-proxy

Proxy server that redirect to another proxy by custom logic

Change remote proxy params:
```
const httpProxyConfig = {
	host: 'k8s',
	port: 30880,
};
```

Run application 
```
node index.js
```

Now proxy listen in 8000 port and redirect all requests to k8s:30880 proxy
