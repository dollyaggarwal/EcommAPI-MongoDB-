import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { likeSchema } from "./like.schema.js";

const LikeModel = mongoose.model('likes',likeSchema)

export class LikeRepository{

    async getLikes(type, id){
        try{
            return await LikeModel.find({
                likeable: new ObjectId(id),
                on_model:type
            }).populate('user')
            .populate({path:'likeable', model: type})
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }

    async likeProduct(userId, productId){
        try{
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(productId),
                on_model:'products'
            });
            await newLike.save();

        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }

    async likeCategory(userId, categoryId){
        try{
            const newLike = new LikeModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(categoryId),
                on_model:'category'
            });
            await newLike.save();

        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }
}