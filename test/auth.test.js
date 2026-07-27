const assert = require('assert');
const { getAuthHeaderToken } = require('../auth');

const request = (authorization) => ({
  get: (name) => name.toLowerCase() === 'authorization' ? authorization : undefined
});

assert.strictEqual(getAuthHeaderToken(request('Bearer valid-token')), 'valid-token');
assert.strictEqual(getAuthHeaderToken(request(undefined)), null);
assert.strictEqual(getAuthHeaderToken(request('Basic credentials')), null);
assert.strictEqual(getAuthHeaderToken(request('Bearer')), null);
assert.strictEqual(getAuthHeaderToken(request('Bearer token extra')), null);

console.log('auth header tests passed');
