import mongoose from 'mongoose'
import Weight from '../models/weight.model.js';



export const addWeight = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { weightKg, date } = req.body;
        const existingWeight = await Weight.findOne({ date });
        if (existingWeight) {
            console.log(existingWeight);
            await Weight.deleteOne({ date });
        }
        const newWeight = await Weight.create([{ weightKg, date }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            succes: true,
            message: 'Added weight',
            data: {
                weight: newWeight[0]
            }
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

};

export const getWeight = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;

        const start = new Date(startDate);
        const end = new Date(endDate);

        const records = await Weight.find({
            date: { $gte: start, $lte: end }
        });

        const data = records.map(w => ({
            date: w.date.toISOString().slice(0, 10),
            weightKg: w.weightKg
        }));

        res.status(200).json({ succes: true, data });
    } catch (error) {
        next(error);
    }
};