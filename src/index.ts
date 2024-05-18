import express from 'express';
import dotenv from 'dotenv';

const app = express();

dotenv.config({ path: ['.env.local', '.env'] });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});