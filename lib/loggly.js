var loggly = require('loggly');

function logger(tag) {
  return loggly.createClient({
    token: "f08763b3-3e97-465d-842e-f0670ce6ad11",
    subdomain: "johnwquarles",
    tags: ['NodeJS', tag],
    json: true
  });
}

module.exports = logger;
