import ProductModel from "./product.model.js";
import ProductRepository from './product.repository.js';
export default class ProductController{

  constructor(){
    this.productRepository = new ProductRepository();
  }
    async getAllProduct(req,res){
      try{
      const products =  this.productRepository.getAll();
      res.status(200).send(products);
      }catch(err){
        console.log(err);
        res.status(500).send("Something went wrong");
      }
        
    }
   async addProduct(req,res){
      try{
      const { name, price, sizes} = req.body;
      
      console.log(req.file.filename)
      const newProduct = new ProductModel(name,null, 
      req.file.filename,null, parseFloat(price), sizes.split(','));

      const createdProduct = await this.productRepository.add(newProduct);
      res.status(201).send(createdProduct);
    }catch(err){
      console.log(err);
      res.status(500).send("Something went wrong");
    }
  }
    
    getOneProduct(req,res){
      try{
        const id = req.params.id;
        const product =  this.productRepository.get(id);
        if(!product){
          res.status(404).send("Product not found");
        }
        else{
          return res.status(200).send(product);
        }
        res.status(200).send(product);
        }catch(err){
          console.log(err);
          res.status(500).send("Something went wrong");
        }
    }

    rateProduct(req,res,next){

      try{
      const userID = req.query.userID;
      const productID = req.query.productID;
      const rating = req.query.rating;
    
        ProductModel.rateProduct(userID, productID, rating);
     
        return res.status(200).send('Rating has been added');
     } 
    catch(err){
          next(err);
    }
    }

    filterProducts(req, res){
      const minPrice = req.query.minPrice;
      const maxPrice = req.query.maxPrice;
      const category = req.query.category;
      const result = ProductModel.filter(minPrice, maxPrice, category);
      res.status(200).send(result);
    }
}