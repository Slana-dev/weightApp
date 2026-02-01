import mongoose from 'mongoose'
import { DB_URI, NODE_ENV, PORT } from '../config/env.js'

if (!DB_URI) {
    throw new Error('Define the MONGODB variable inside .env.<development/production>.local');
}

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log(`Connected to database in ${NODE_ENV} mode`);
    } catch (error) {
        console.error('Problem connecting to database', error);
        process.exit(1);
    }
}
export default connectToDatabase;