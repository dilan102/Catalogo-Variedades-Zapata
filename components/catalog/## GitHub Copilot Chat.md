## GitHub Copilot Chat

- Extension: 0.50.1 (prod)
- VS Code: 1.122.1 (8761a5560cfd65fdd19ce7e2bd18dab5c0a4d84e)
- OS: linux 6.6.119-antix.1-amd64-smp x64
- GitHub Account: sharithceballoszapata72-cell

## Network

User Settings:
```json
  "http.systemCertificatesNode": true,
  "github.copilot.advanced.debug.useElectronFetcher": true,
  "github.copilot.advanced.debug.useNodeFetcher": false,
  "github.copilot.advanced.debug.useNodeFetchFetcher": true
```

Connecting to https://api.github.com:
- DNS ipv4 Lookup: 140.82.112.5 (115 ms)
- DNS ipv6 Lookup: Error (77 ms): getaddrinfo ENOTFOUND api.github.com
- Proxy URL: None (2 ms)
- Electron fetch (configured): Error (155 ms): Error: net::ERR_CERT_DATE_INVALID
	at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/utility_init:2:10684)
	at SimpleURLLoaderWrapper.emit (node:events:519:28)
  {"is_request_error":true,"network_process_crashed":false}
- Node.js https: Error (243 ms): Error: certificate is not yet valid
	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
	at TLSSocket.emit (node:events:519:28)
	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
	at ssl.onhandshakedone (node:_tls_wrap:881:12)
- Node.js fetch: Error (230 ms): TypeError: fetch failed
	at node:internal/deps/undici/undici:14902:13
	at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
	at async n._fetch (/usr/share/code/resources/app/extensions/copilot/dist/extension.js:5505:6188)
	at async n.fetch (/usr/share/code/resources/app/extensions/copilot/dist/extension.js:5505:5496)
	at async u (/usr/share/code/resources/app/extensions/copilot/dist/extension.js:5537:186)
	at async Cg._executeContributedCommand (file:///usr/share/code/resources/app/out/vs/workbench/api/node/extensionHostProcess.js:502:48807)
  Error: certificate is not yet valid
  	at TLSSocket.onConnectSecure (node:_tls_wrap:1697:34)
  	at TLSSocket.emit (node:events:519:28)
  	at TLSSocket._finishInit (node:_tls_wrap:1095:8)
  	at ssl.onhandshakedone (node:_tls_wrap:881:12)

Connecting to https://api.githubcopilot.com/_ping:
- DNS ipv4 Lookup: 140.82.114.22 (4 ms)
- DNS ipv6 Lookup: Error (3 ms): getaddrinfo ENOTFOUND api.githubcopilot.com
- Proxy URL: None (14 ms)
- Electron fetch (configured): HTTP 200 (247 ms)
- Node.js https: HTTP 200 (287 ms)
- Node.js fetch: HTTP 200 (297 ms)

Connecting to https://copilot-proxy.githubusercontent.com/_ping:
- DNS ipv4 Lookup: 4.228.31.153 (4 ms)
- DNS ipv6 Lookup: Error (76 ms): getaddrinfo ENOTFOUND copilot-proxy.githubusercontent.com
- Proxy URL: None (5 ms)
- Electron fetch (configured): HTTP 200 (507 ms)
- Node.js https: HTTP 200 (545 ms)
- Node.js fetch: HTTP 200 (553 ms)

Connecting to https://mobile.events.data.microsoft.com: HTTP 404 (80 ms)
Connecting to https://dc.services.visualstudio.com: HTTP 404 (531 ms)
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: HTTP 200 (315 ms)
Connecting to https://copilot-telemetry.githubusercontent.com/_ping: HTTP 200 (306 ms)
Connecting to https://default.exp-tas.com: HTTP 400 (359 ms)

Number of system certificates: 449

## Documentation

In corporate networks: [Troubleshooting firewall settings for GitHub Copilot](https://docs.github.com/en/copilot/troubleshooting-github-copilot/troubleshooting-firewall-settings-for-github-copilot).