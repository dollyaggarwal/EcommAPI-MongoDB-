
import { LikeRepository } from "./like.repository.js";

export class LikeController{

    constructor(){
        this.likeRepository = new LikeRepository();
    }

    async getLikes(req, res, next){
        try{
            const {id,type} = req.query; 
            console.log(req.query)
            console.log(id);
            const likes = await this.likeRepository.getLikes(type, id);
            return res.status(200).send(likes);
        }catch(err){
            console.log(err);
            res.status(500).send("Something went wrong");
          }
    }

    async likeItem(req, res){
        try{
            const {id, type} = req.body;
            if(type!='products' && type!='category'){
                return res.status(400).send("Invalid");
            }
            if(type == 'products'){
                await this.likeRepository.likeProduct(req.userID, id);
            }
            else{
                await this.likeRepository.likeCategory(req.userID, id);
            }
        }catch(err){
            console.log(err);
            res.status(500).send("Something went wrong");
          }
          res.status(201).send();
    }
}