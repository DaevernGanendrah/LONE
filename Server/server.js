// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const Score = require('./models/score');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB URI
// const MONGO_URI = 'mongodb+srv://Alex:12345@cluster0.wwaslbh.mongodb.net/?retryWrites=true&w=majority';

// // Connect to MongoDB without the deprecated options
// mongoose.connect(MONGO_URI);

// app.post('/submit-score', async (req, res) => {
//     const { username, score } = req.body;
//     let highScore = await Score.findOne({ username });

//     if (highScore) {
//         if (score > highScore.score) {
//             highScore.score = score;
//             await highScore.save();
//         }
//     } else {
//         highScore = new Score({ username, score });
//         await highScore.save();
//     }

//     res.json({ message: 'Score updated' });
// });

// app.get('/high-scores', async (req, res) => {
//     const highScores = await Score.find().sort({ score: -1 }).limit(10);
//     res.json(highScores);
// });

// app.listen(3000, () => console.log('Server running on port 3000'));
































require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// <<<<<<< HEAD
// =======
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
const path = require('path');
// >>>>>>> bcd5cdd (first commit)
const Score = require('./Models/score');

const app = express();

// Basic security protections
// app.use(helmet());

// // Rate limiting to prevent brute-force attacks
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the 'Client' directory
app.use(express.static('Client'));

// MongoDB URI
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Submit score endpoint
app.post('/submit-score', async (req, res) => {
    try {
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
    } catch (error) {
        res.status(500).json({ message: 'Error updating score', error: error });
    }
});

// Fetch high scores endpoint
app.get('/high-scores', async (req, res) => {
    try {
        const highScores = await Score.find().sort({ score: -1 }).limit(10);
        res.json(highScores);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching high scores', error: error });
    }
});




// Root endpoint to serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Client', 'index.html'));
});

// Set the port dynamically from the environment or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
