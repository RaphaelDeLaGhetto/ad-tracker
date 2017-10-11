'use strict';

const redis = require('redis');

/**
 * The test/development port is set to 6380 to avoid accidental data loss
 * if test are executed in production
 *
 * See `README` to set up Dockerized dev server
 */
let PORT = 6380;
if (process.env.NODE_ENV === 'production') {
  PORT = 'redis://redis:' + 6379;
}

let client = redis.createClient(PORT);

client.on('error', (err) => {
  console.log('Redis connection error:', err);
});

module.exports = client;
