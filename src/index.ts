import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import commonRoutes from './routes/commonRoutes';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import quizzzyRoutes from './routes/quizzzyRoutes';
import quizzzRoutes from './routes/quizzzRoutes';


const app = express();
dotenv.config({ path: ['.env.local', '.env'] });
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI as string;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB 🪿");

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT} 🚀`);
        });

        app.use('/api/commons', commonRoutes);

        app.use('/api/users', userRoutes);

        app.use('/api/admins', adminRoutes);

        app.use('/api/quizzzy', quizzzyRoutes);

        app.use('/api/quizzz', quizzzRoutes);

        app.use((req, res) => {
            res.status(404).send('404 Not Found');
        })
    })
    .catch((error) => {
        console.error(error);
    });