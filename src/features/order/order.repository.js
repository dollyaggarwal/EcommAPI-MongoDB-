import { ObjectId } from "mongodb";
import { ApplicationError } from "../../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";

export default class OrderRepository{
    constructor(){
        this.collection = "orders";
    }

    async placeOrder(userId){
        //1. get cartitems and calculate total amount.
            await this.getTotalAmount(userId);
        //2. create an order record.

        //3. Reduce the stock.

        //4. clear the cart items.
    }

    async getTotalAmount(userId){
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

        ]).toArray();
        const finalTotalAmount = items.reduce((acc, item) =>acc+item.totalAmount, 0);
        console.log(finalTotalAmount);
    }
}