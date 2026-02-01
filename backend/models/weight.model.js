import mongoose from 'mongoose'

const weightSchema = new mongoose.Schema({
    weightKg: {
        type: Number,
        required: [true, " Please insert weight"],
    },
    date: {
        type: Date,
        required: [true, "Please insert a date"],
    }
},);
const Weight = mongoose.model('Weight', weightSchema);
export default Weight;