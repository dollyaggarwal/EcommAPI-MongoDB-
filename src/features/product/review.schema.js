import mongoose, { Types } from "mongoose";

export const reviewSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        Ref:'products'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    rating:Number
})