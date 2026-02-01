import express from 'express';
import { PORT } from './config/env.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import weightRouter from './routes/weight.routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.get('/', (req, res) => res.send('nekaj'))
app.use('/api/weights', weightRouter)

app.use(errorMiddleware)
app.listen(PORT, async () => {
    console.log(`listening on http://localhost:${PORT}`)
    await connectToDatabase();
});

export default app;