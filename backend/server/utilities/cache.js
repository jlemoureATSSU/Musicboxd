const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 2000, checkperiod: 2200 });

module.exports = myCache;
