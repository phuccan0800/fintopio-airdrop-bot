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
    let proxy = `http://${proxies[i].split(':')[2]}:${proxies[i].split(':')[3]}@${proxies[i].split(':')[0]}:${proxies[i].split(':')[1]}`;
    let proxyAgent = new HttpsProxyAgent(proxy);
    promises.push(automaticFlow(i + 1, BEARERS[i], proxyAgent));
}
