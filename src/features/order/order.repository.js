import { ObjectId } from "mongodb";
import { ApplicationError } from "../../../error-handler/applicationError.js";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderModel from "./order.model.js";
import { cli } from "winston/lib/winston/config/index.js";

export default class OrderRepository{
    constructor(){
        this.collection = "orders";
    }

    async placeOrder(userId){
        const client = getClient();
        const session = client.startSession();
        try{      
            const db = getDB();
            session.startTransaction();
        //1. get cartitems and calculate total amount.
            const items = await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((acc, item) =>acc+item.totalAmount, 0);
                 console.log(finalTotalAmount);
        //2. create an order record.
        const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date())
        db.collection(this.collection).insertOne(newOrder, {session});
        //3. Reduce the stock.
        for(let item of items){
            await db.collection("products").updateOne(
                {_id: item.productID},
                {$inc:{stock: -item.quantity}},{session}
            )
        }
        throw new Error("Something is wrong in placeOrder");

        //4. clear the cart items.
        await db.collection("cartitems").deleteMany({
            userID: new ObjectId(userId)
        },{session});
        session.commitTransaction();
        session.endSession();
        return;
        }catch(err){
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            throw new ApplicationError('Something went wrong in database', 500);
        }
    }

    async getTotalAmount(userId, session){
        const db = getDB();
      const items= await db.collection("cartItems").aggregate([

            //1. get cart items for the user
            {
                $match:{userID: new ObjectId(userId)}
            },
            //2. get the products from products collection.
            {
                $lookup:{
                    from:"products",
                    localField:"productID",
                    foreignField:"_id",
                    as:"productInfo"
                }
            },
            //3. Unwind the productInfo.
            {
                $unwind:"$productInfo"
            },
            //4. Calculate totalAmount for each cartitems.
            {
                $addFields:{
                    "totalAmount":{
                        $multiply:["$productInfo.price","$quantity"]
                    }
                }
            }

        ], {session}).toArray();
        return items;
        
    }
}