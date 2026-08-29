const express = require('express');
const router = express.Router();
const { ALLOWED_CURRENCIES } = require('../currencies');
const { exchangeRateCache } = require('../store');

router.get('/', async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount){
    return res.status(400).json({ error: 'Missing required query parameters: from, to, amount' });
  }

  const fromUpper = from.toUpperCase();
  const toUpper = to.toUpperCase();

  if (!ALLOWED_CURRENCIES.includes(fromUpper)) {
    return res.status(400).json({ error: 'Invalid "from" currency' });
  }

  if (!ALLOWED_CURRENCIES.includes(toUpper)) {
    return res.status(400).json({ error: 'Invalid "to" currency' });
  }

  if (isNaN(amount) || Number(amount) < 0) {
    return res.status(400).json({ error: 'Invalid "amount". It must be a non-negative number' });
  }

  if (fromUpper === toUpper) {
    return res.json({ from: fromUpper, to: toUpper, amount: Number(amount), result: Number(amount) });
  }

  try {
    const url = `https://api.frankfurter.dev/v2/rate/${fromUpper}/${toUpper}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Bad response from exchange rate API');
    }

    const data = await response.json();
    const result = Number(amount) * data.rate;

    exchangeRateCache.set(`${fromUpper}:${toUpper}`, data.rate);

    res.json({ from: fromUpper, to: toUpper, amount: Number(amount), result, source: 'live' });
  } catch (err) {
    const cachedRate = exchangeRateCache.get(`${fromUpper}:${toUpper}`);

    if (cachedRate !== undefined) {
      const result = Number(amount) * cachedRate;
      return res.json({ from: fromUpper, to: toUpper, amount: Number(amount), result, source: 'cache' });
    }

    res.status(503).json({ error: 'Exchange rate service unavailable, try again later' });
  }
});

module.exports = router;