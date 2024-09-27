const fs = require('fs');
const path = require('path');
const { automaticFlow } = require('./src/tasks')
const proxyFile = path.join(__dirname, 'proxy.txt');
const { HttpsProxyAgent } = require('https-proxy-agent');

const promises = [];
const proxies = fs.readFileSync(proxyFile, 'utf8')
    .replace(/\r/g, '')
    .split('\n')
    .filter(Boolean);

const BEARERS = JSON.parse(fs.readFileSync('bearers.json', 'utf-8'));
for (let i = 0; i < BEARERS.length; i++) {
    let proxyAgent = new HttpsProxyAgent(proxies[i]);
    promises.push(automaticFlow(i + 1, BEARERS[i], proxyAgent));
}
