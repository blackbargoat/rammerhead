// Hosting overrides for single-port PaaS deploys (Render, Railway, Koyeb, Fly, etc.)
// behind an HTTPS reverse proxy. Merged over src/config.js at startup.
const RammerheadJSMemCache = require('./src/classes/RammerheadJSMemCache.js');

const port = parseInt(process.env.PORT, 10) || 8080;

module.exports = {
    bindingAddress: '0.0.0.0',
    port,
    crossDomainPort: null,
    enableWorkers: false,
    // set RH_PASSWORD on the host to require a password for new sessions
    password: process.env.RH_PASSWORD || null,
    restrictSessionToIP: false,
    jsCache: new RammerheadJSMemCache(50 * 1024 * 1024),
    getServerInfo: (req) => {
        const local = !req.headers['x-forwarded-proto'];
        return {
            hostname: new URL('http://' + req.headers.host).hostname,
            port: local ? port : 443,
            crossDomainPort: local ? port : 443,
            protocol: local ? 'http:' : 'https:'
        };
    },
    getIP: (req) => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()
};
