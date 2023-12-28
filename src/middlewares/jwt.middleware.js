import jwt  from "jsonwebtoken"

const jwtAuth = async(req, res, next) =>{

    //1. Read the token.
    const token = req.headers['authorization'];

    //2. if no token , return the error
  
    if(!token){

        return res.status(401).send('Unauthorized');
    }
    //3. Check if token is valid
    try{

        const payload = jwt.verify(token,'z9vb4TgLR6uFRrd0JXaMQEtOdu1fimJ3');
        req.userID = payload.userID;
        console.log(payload);
       
    }
    catch(err){
        //4. return error
        return res.status(401).send('Unauthorized');
    }

    //5. call next middleware
    next();
};

export default jwtAuth;