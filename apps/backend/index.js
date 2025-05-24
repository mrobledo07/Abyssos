const express = require('express');
const app = express();
const PORT = 3000;

// Imports
const dev1Data = require('./mock/dev1Data');
const dev3Data = require('./mock/dev3Data');
const { calculateTrustScore } = require('./scoreEngine');

app.get('/trust-score', (req, res) => {
  const { address } = req.query;

  // Validate address
  if (!address || !address.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid address' });
  }

  // Use mock inputs from Dev 1 and Dev 3
  const scoreResult = calculateTrustScore(dev1Data, dev3Data);

  res.json({
    address,
    ...scoreResult
  });
});

app.listen(PORT, () => {
  console.log(`✅ Dev 2 Trust Score API running at http://localhost:${PORT}`);
});
