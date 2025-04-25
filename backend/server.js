import express from 'express';
import cors from 'cors';

import { PORT } from './config/env.js'
import connectToDB from './config/db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.send('API is running 🚀');
});

connectToDB();

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});