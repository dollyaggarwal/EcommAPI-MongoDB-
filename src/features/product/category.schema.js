import mongoose, { mongo } from "mongoose";

export const categorySchema = new mongoose.Schema({
    name:String,
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'products'
        }
    ]
});