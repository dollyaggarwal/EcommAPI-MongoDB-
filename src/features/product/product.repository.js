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
            return collection.find();

        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }
    async get(id){
        try{
            const db = getDB();
            const collection = db.collection(this.collection);
            return collection.find({_id:ObjectId(id)});

        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }
}
export default ProductRepository;