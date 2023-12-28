import {ApplicationError} from "../../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";
export default class ProductModel{
    constructor(
        name,
        desc,
        price,
        imageUrl,
        category,
        sizes,
        id
      ) {
      
        this.name = name;
        this.desc = desc;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.sizes = sizes;
        this._id = id;
      }    
 
    static rateProduct(userID, productID, rating){
        //validate user and product
        const user = UserModel.getAll().find(
            (u) => u.id == userID
        );
        if(!user)
        throw new ApplicationError('User not found',404);
            
        const product = products.find((p) => p.id == productID);
        if(!product)
        throw new ApplicationError('Product not found',400);

        // Check if there are any ratings and if not then add ratings array

        if(!product.ratings){
            product.ratings = [];
            product.ratings.push({
                userID: userID , rating: rating,
            });
        }
        else{
            //check if user rating is already available 
            const existingRatingIndex = product.ratings.findIndex(
                (r) => r.userID == userID
            );
            if(existingRatingIndex >= 0){
                product.ratings[existingRatingIndex] = {
                    userID: userID,
                    rating: rating,
                };
            }
            else{
                //if no existing rating, then add new rating
                product.ratings.push({
                    userID: userID,
                    rating: rating,
                });
            }
        }
    }
}

var products =
[ new ProductModel(1,'Product1', 'Description for Product1','https://m.media-amazon.com/images/I/81+GIkwqLIL._SX679_.jpg', 'Category1',185, ['M','XL']
),
 
new ProductModel(2,'Product2', 'Description for Product2', 'https://m.media-amazon.com/images/I/41QAcck4dfL._SX300_SY300_QL70_FMwebp_.jpg', 'Category2',20, ['S','XL']
),
 
new ProductModel(3,'Product3', 'Description for Product3', 'https://m.media-amazon.com/images/I/61B84NiWabL._SY522_.jpg', 'Category3',30, ['S','M','L']
),
 
new ProductModel(4,'Product4', 'Description for Product4', 'https://m.media-amazon.com/images/I/611bwwXTx7L._SY879_.jpg','Category4',50, ['S','XL']
),
];