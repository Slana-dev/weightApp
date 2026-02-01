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

        const weightsMap = new Map();
        const records = await Weight.find({
            date: { $gte: start, $lte: end }
        });

        records.forEach((w) => {
            console.log(w.date.toDateString())
            weightsMap.set(w.date.toDateString(), w.weightKg);
        });
        const results = [];
        let loop = new Date(startDate);

        while (loop <= end) {
            results.push(weightsMap.get(loop.toDateString()) ?? -1);
            var newDate = loop.setDate(loop.getDate() + 1);
            loop = new Date(newDate);
        }

        res.status(200).json({ succes: true, data: results });

    } catch (error) {
        next(error);
    }
};