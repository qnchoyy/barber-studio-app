import express from 'express';
import cors from 'cors';

import { PORT } from './config/env.js'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
    res.send('API is running 🚀');
});

app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});