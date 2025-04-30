// limiter.js (or wherever you're using rateLimit)
const rateLimit = require('express-rate-limit');

// Handle ESM weirdness
const actualRateLimit = rateLimit.default || rateLimit;

const limiter = actualRateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

module.exports = limiter;
