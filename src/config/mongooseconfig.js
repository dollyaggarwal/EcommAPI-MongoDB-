import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";

dotenv.config();
const url = process.env.DB_URL;
export const connectUsingMongoose =  async() =>{
    try{
    await mongoose.connect(url, {
            dbName:"EcommerceDB",
            useNewUrlParser:true,
            useUnifiedTopology:true       
    });
    console.log("Mongodb connected using mongoose");
    addCategories();
}catch(err){
    console.log("Error while connecting to db")
}
}

async function addCategories(){
    const CategoryModel = mongoose.model("category",categorySchema);
    const categories = CategoryModel.find();
    if(!categories || (await categories).length==0){
        await CategoryModel.insertMany([{name:'Books'},{name:'Clothing'},{name:'Electronics'}]);
    }
    console.log("Categories added");
}