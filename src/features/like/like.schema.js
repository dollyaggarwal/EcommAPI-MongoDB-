import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    likeable:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:'on_model'
    },
    on_model:{
        type:String,
        enum:['products', 'category']
    }
}).pre('save', (next)=>{
    console.log("New like coming in");
    next();
})
.post('save',(doc)=>{
    console.log("Like is saved");
    console.log(doc);
}).pre('find', (next) =>{
    console.log("Retrieving Likes");
    next();
}).post('find', (docs)=>{
    console.log("Post find");
    console.log(docs);
})