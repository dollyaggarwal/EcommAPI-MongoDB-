//Manage routes/paths to ProductController

//1. Import express
import express from "express";
import ProductController from "./product.controller.js";
import {upload} from '../../middlewares/fileupload.middleware.js'

//2. Initialise Express router
const productRouter = express.Router();

const productController = new ProductController();

//localhost/api/products
productRouter.post('/rate', productController.rateProduct);
productRouter.get('/', (req, res) =>{
    productController.getAllProduct(req, res)
});
productRouter.post('/', upload.single('imageUrl'),(req, res) =>{
    productController.addProduct(req, res)
});
productRouter.get('/:id',(req, res) =>{
    productController.getOneProduct(req, res)
});

//localhost:3200/api/products/filter?minPrice=10&maxPrice=20&category=Category1
productRouter.post('/filter', productController.filterProducts);

export default productRouter;