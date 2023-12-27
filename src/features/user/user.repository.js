import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../../error-handler/applicationError.js";


export default class UserRepository{
    
    constructor(){
        this.collection = 'users';
    }
    async signUp(newUser){
        try{
            //get the database
            const db = getDB();
            
            //get the collection
            const collection = db.collection(this.collection);
            
            //insert the document
           await collection.insertOne(newUser);
           return newUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
        
    }

    async signIn(email,password){
        try{
            //get the database
            const db = getDB();
            
            //get the collection
            const collection = db.collection(this.collection);
            
            //find the document
           return await collection.findOne({email, password});
          
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
        
    }
    async findByEmail(email){
        try{
            //get the database
            const db = getDB();
            
            //get the collection
            const collection = db.collection("users");
            
            //find the document
           return await collection.findOne({email});
          
        }catch(err){
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
        
    }


}