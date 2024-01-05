import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: String,
    price:Number,
    category: String,
    description:String,
    stock:Number,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'reviews'
        }
    ],
    categories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'category'
        }
    ]
})