import { ObjectId } from "mongodb";
import { ApplicationError } from "../../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";

const ProductModel = mongoose.model("products", productSchema);
const ReviewModel = mongoose.model("reviews", reviewSchema);
class ProductRepository{

    constructor(){
        this.collection = 'products';
    }

    async add(newProduct){
        try{
             //get the db
            const db = getDB();

             //get the collection
             const collection = db.collection(this.collection);
             await collection.insertOne(newProduct);
             return newProduct;
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }

    async getAll(){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find().toArray();

        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }
    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});

        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }

    async filter(minPrice, categories){
        try{
            const db = getDB();
            const collection = db.collection(this.collection); 
            let filterExpression={};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)}
            }
            categories = JSON.parse(categories.replace(/'/g,'"'));
            if(categories){
                filterExpression={$or:[{category:{$in: categories}}, filterExpression]}
                // filterExpression.category=category
            }                                       //in project operator , 1 for inclusion of attribute and 0 means exclusion of an attribute in result
            return collection.find(filterExpression).project({name:1, price:1, _id:0, ratings:{$slice:1}}).toArray();

        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with database", 500);    
        }
    }
    // async rate(userID, productID, rating){
    //     try{
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         //find the product
    //         const product = await collection.findOne({_id: new ObjectId(productID)});
    //         //find the rating
    //         const userRating = product?.ratings?.find(r=> r.userID == userID);
    //         if(userRating){
    //             //update the rating
    //             await collection.updateOne({_id: new ObjectId(productID), "ratings.userID":new ObjectId(userID)},
    //             {$set:{"ratings.$.rating": rating}
    //         });
    //         }
    //         else{
    //             await collection.updateOne({_id: new ObjectId(productID),},
    //             {$push:{ratings:{userID:new ObjectId(userID), rating}}
    //         });
    //         }   
    //     }catch(err){
    //         console.log(err);
    //         throw new ApplicationError('Something went wrong in database', 500);
    //     }
    // }

    async rate(userID, productID, rating){
        try{
        //     const db = getDB();
        //     const collection = db.collection(this.collection);
        //   //removes existing entry
        //   await collection.updateOne({_id: new ObjectId(productID)},
        //         {$pull:{ratings:{userID:new ObjectId(userID)}}
        //     });

        //     //add new entry
        //     await collection.updateOne({_id: new ObjectId(productID),},
        //     {$push:{ratings:{userID:new ObjectId(userID), rating}}
        // })  
        
        //check if product exists
        const productToUpdate = await ProductModel.findById(productID);
        if(!productToUpdate){
            throw new Error("Product not found")
        }

        //find the existing review
        const userReview = await ReviewModel.findOne({product:new ObjectId(productID), user: new ObjectId(userID)});
        if(userReview){
            userReview.rating = rating;
            await userReview.save();
        }else{
            const newReview = new ReviewModel({
                product: new ObjectId(productID),
                user:new ObjectId(userID),
                rating:rating
            });
            newReview.save();
        }
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }

    async averageProductPricePerCategory(){
        try{
            const db = getDB();
           return await db.collection(this.collection)
            .aggregate([
                {
                    //Stage 1: Get average price per category
                    $group:{
                        _id:"$category",
                        averagePrice:{$avg:"$price"}
                    }
                }
            ]).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }
}
export default ProductRepository;