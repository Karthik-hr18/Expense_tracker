import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EUser",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    category: {
        type: String,
        default: "Other",
    },
    notes: {
        type: String,
        default: "",
    },
})
export default mongoose.model("Income", incomeSchema);