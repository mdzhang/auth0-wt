const _ = require('lodash');
const Promise = require('bluebird');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const moment = require('moment');
const redis = require('redis');

const CACHE_KEY = 'webtask:trump-count:nytimes';
Promise.promisifyAll(redis.RedisClient.prototype);

function countTrumps() {
  return fetch('https://www.nytimes.com/')
  .then(res => res.text())
  .then(body => {
    // eslint-disable-next-line no-undef
    $ = cheerio.load(body);

    // eslint-disable-next-line no-undef
    const visibleText = $('body').text();
    const trumps = visibleText.match(/trump/ig).length;

    return trumps;
  });
}

/**
 * Fetch number of occurrences of "Trump" on the NYTimes front page, and put into
 * Redis.
 *
 * Installation:
 * 1. Install the webtask cli: `npm install -g wt-cli`
 * 2. Create a webtask profile: `wt init`
 * 3. Get a Redis instance e.g. from: redistogo.com
 * 4. From tasks/trump-counter, generate the webhook url, substituting <REDIS_URL> with the one from step #3: `wt create index --secret REDIS_URL=<REDIS_URL>
 *
 * @param {secret} REDIS_URL - Redis instance url
 */
module.exports = function(ctx, cb) {
  const REDIS_URL = ctx.secrets.REDIS_URL;
  if (!REDIS_URL) return cb(new Error('REDIS_URL secret is missing'));

  const client = redis.createClient(REDIS_URL);

  return client.getAsync(CACHE_KEY)
  .then(data => {
    const parsedData = JSON.parse(data) || {};

    return countTrumps()
    .then(trumps => {
      // e.g. 2017-03-06 3:25:50 pm
      const now = moment().format('YYYY-MM-DD h:mm:ss a');

      parsedData[now] = trumps;

      return client.setAsync(CACHE_KEY, JSON.stringify(parsedData));
    })
    .then(() => {
      if (_.isEmpty(parsedData)) {
        return 'Nothing yet!';
      }

      return parsedData;
    });
  })
  .nodeify(cb);
};
