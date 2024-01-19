const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Score = require('./models/score');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI
const MONGO_URI = 'mongodb+srv://Alex:12345@cluster0.wwaslbh.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB without the deprecated options
mongoose.connect(MONGO_URI);

app.post('/submit-score', async (req, res) => {
    const { username, score } = req.body;
    let highScore = await Score.findOne({ username });

    if (highScore) {
        if (score > highScore.score) {
            highScore.score = score;
            await highScore.save();
        }
    } else {
        highScore = new Score({ username, score });
        await highScore.save();
    }

    res.json({ message: 'Score updated' });
});

app.get('/high-scores', async (req, res) => {
    const highScores = await Score.find().sort({ score: -1 }).limit(10);
    res.json(highScores);
});

app.listen(3000, () => console.log('Server running on port 3000'));
