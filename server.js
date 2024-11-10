const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/saveSong', (req, res) => {
  const { id, metadata } = req.body;
  const filePath = path.join(__dirname, 'public', `music_${id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
  res.json({ success: true });
});

app.post('/api/saveMetadata', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'metadata.json');
  fs.writeFileSync(filePath, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

app.listen(3002, () => {
  console.log('API server running on port 3002');
});
