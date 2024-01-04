import UserModel from './user.model.js';
import jwt from 'jsonwebtoken';
import UserRepository from './user.repository.js';
import bcrypt from 'bcrypt';

export default class UserController {

  constructor(){
    this.userRepository = new UserRepository();
  }

  async resetPassword(req, res){
    try{

      const {newPassword} = req.body;
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const userID = req.userID;
      await this.userRepository.resetPassword(userID, hashedPassword);
      res.status(200).send("Password is updated");

    }catch(err){
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
  async signUp(req, res , next) {
    try{
    const {
      name,
      email,
      password,
      type,
    } = req.body;

const hashedPassword = await bcrypt.hash(password, 12)

    const user = new UserModel(
      name,
      email,
      hashedPassword,
      type
    );
    await this.userRepository.signUp(user);
    res.status(201).send(user);
    }catch(err){
     next(err);
    }
  }

  async signIn(req, res, next) {
    try{
      // 1. Find user by email.
      const user = await this.userRepository.findByEmail(req.body.email);
      if(!user){
        return res
        .status(400)
        .send('Incorrect Credentials');
      } else {
        // 2. Compare password password with hashed password.
        const result = await bcrypt.compare(req.body.password, user.password);
        if(result){

          // 3. Create token.
          const token = jwt.sign(
            {
              
              userID: user._id,
              email: user.email,
            },
            'z9vb4TgLR6uFRrd0JXaMQEtOdu1fimJ3',
            {
              expiresIn: '1h',
            }
          );
        
      // 4. Send token.
      return res.status(200).send(token);
        } else {
          return res
        .status(400)
        .send('Incorrect Credentials');
        }
      }
  } catch(err){
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }
}
