const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 500, checkperiod: 600 });
module.exports = myCache;
