const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET endpoint to fetch songlist
app.get('/api/songs', (req, res) => {
    const songlist = JSON.parse(fs.readFileSync(path.join(__dirname, 'songlist.json'), 'utf8'));
    res.json(songlist);
});

// POST endpoint to update songlist
app.post('/api/songs', (req, res) => {
    const songDetails = req.body;
    const songlistPath = path.join(__dirname, 'songlist.json');

    let songlist = [];
    if (fs.existsSync(songlistPath)) {
        songlist = JSON.parse(fs.readFileSync(songlistPath, 'utf8'));
    }

    songlist.push(songDetails);
    fs.writeFileSync(songlistPath, JSON.stringify(songlist, null, 2));

    res.json({ success: true, message: 'Song added successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});