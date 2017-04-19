const assert = require('chai').assert;
const fetchMock = require('fetch-mock');
const moment = require('moment');
const proxyquire = require('proxyquire');
const redisMock = require('fakeredis');

const ctxStub = {
  secrets: {
    REDIS_URL: 'foo'
  },
};

const fetchStub = fetchMock.sandbox();
fetchStub.mock('https://www.nytimes.com/', '<html><body>Trump trump</body></html>');

const trumpCounter = proxyquire('./index', {
  moment: () => moment('2017-03-06T15:25:50'),
  'node-fetch': fetchStub,
  redis: redisMock,
});

describe('trumpCounter', () => {
  it('counts trumps and pushes to redis', done => {
    trumpCounter(ctxStub, (err, data) => {
      if (err) return done(err);

      assert.isNull(err);
      assert.deepEqual(data, { '2017-03-06 3:25:50 pm': 2 });
      done();
    });
  });
});
