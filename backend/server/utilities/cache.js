// utilities/cache.js
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 1000, checkperiod: 1200 });

module.exports = myCache;
