ProductController
Get Products
Add a Product
Get one Product
Rate Product
Add items to cart
Get items of cart
Remove items from cart.

UserController
Signup - Emali, Name Password, TypeOfUser(customer, seller)
Signin - (Emali, Password)


//aggregation pipeline

```javascript
db.Products.aggregate([
    //1. Create documents for ratings
    {
        $unwind:"ratings"
    },
    //2. Group rating per Product and get average
    {
        $group:{
            _id:"$name",
            averageRating:{$avg:"$ratings.rating}
        }
    }
])
```
```javascript
db.Products.aggregate([
    //1. Project name of Product, and countOfRating
    {
        $project:{name:1, countOfRating:{
            $cond:{if:{$isArray:"$ratings"},
            then:{$size:"$ratings"},else:0 }
             }}
    },
    {
        //2. Sort the collection
        $sort:{countOfRating:-1}
    },
    {
        //3. Limit to just 1 item in result
        $limit:1
    }
])
```
