import './env.js';
import express from 'express';
import swagger, { serve } from 'swagger-ui-express';
import cors from 'cors';

import productRouter from './src/features/product/product.routes.js';
import orderRouter from './src/features/order/order.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cartitems/cartitems.routes.js';
import likeRouter from './src/features/like/like.routes.js';
import bodyParser from 'body-parser';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import apiDocs from './swagger.json'assert {type:'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import { connectUsingMongoose } from './src/config/mongooseconfig.js';
import mongoose, { mongo } from 'mongoose';


const server = express();
server.use(bodyParser.json());

//CORS policy configuration for specific client url
    // server.use((req, res, next) =>{
    //     res.header('Access-Control-Allow-Origin', 'http://localhost:5500');
    //     res.header('Access-Control-Allow-Headers', '*');
    //     res.header('Access-Control-Allow-Methods', '*');
    //     //return OK for preflight request.
    //     if(req.method == "OPTIONS"){
    //         return res.sendStatus(200);
    //     }
    //     next();
    // });

//CORS policy configuration for all client url
// server.use((req, res, next) =>{
// res.header('Access-Control-Allow-Origin', '*');
// res.header('Access-Control-Allow-Headers', '*');
// res.header('Access-Control-Allow-Methods', '*');
// //return OK for preflight request.
// if(req.method == "OPTIONS"){
//     return res.sendStatus(200);
// }
// next();
    // })

    
//CORS policy configuration using cors inbuilt library
var corsOptions = {
    origin:'http://localhost:5500'
}
 server.use(cors());

server.use('/api-docs',swagger.serve, swagger.setup(apiDocs));

server.use(loggerMiddleware);

//for all requests related to product, redirect to product routes.
server.use('/api/products',jwtAuth, productRouter);

//for all requests related to order, redirect to order routes.
server.use('/api/orders',jwtAuth, orderRouter);

//for all requests related to user, redirect to user routes.
server.use('/api/cartItems',jwtAuth, cartRouter);
//for all requests related to user, redirect to user routes.
server.use('/api/likes',jwtAuth, likeRouter);

//for all requests related to user, redirect to user routes.
server.use('/api/users', userRouter);

server.get("/", (req, res) =>{
    res.send("Welcome to Ecommerce APIs");
});

//Error handler middleware
server.use((err, req, res, next) =>{
     console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
       return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
       return res.status(err.code).send(err.message);
    }
    //server errors.
    res.status(500).send(err.message);
});


server.use((req, res) =>{
    res.status(404).send("API not found!..Please check our documentation for more information at localhost:3300/api-docs")
})

server.listen(3300,()=>{
    console.log("Server is running at 3300");
    //connectToMongoDB();
    connectUsingMongoose();
});
