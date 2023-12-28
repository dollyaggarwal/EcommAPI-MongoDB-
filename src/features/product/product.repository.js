import { ObjectId } from "mongodb";
import { ApplicationError } from "../../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

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

    async filter(minPrice, maxPrice, category){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if(minPrice){
                filterExpression.price = {$gte:parseFloat(minPrice)}
            }
            if(maxPrice){
                filterExpression.price = {...filterExpression.price,$lte:parseFloat(maxPrice)}
            }
            if(category){
                filterExpression.category = category;
            }
            return collection.find(filterExpression).toArray();
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
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
            const db = getDB();
            const collection = db.collection(this.collection);
          //removes existing entry
          await collection.updateOne({_id: new ObjectId(productID)},
                {$pull:{ratings:{userID:new ObjectId(userID)}}
            });

            //add new entry
            await collection.updateOne({_id: new ObjectId(productID),},
            {$push:{ratings:{userID:new ObjectId(userID), rating}}
        })    
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }
}
export default ProductRepository;