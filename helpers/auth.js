const jwt=require('jsonwebtoken');

const userAuth = async (req,res,next)=>{
    const {token} = req.cookies;  
    const decodeToken= await jwt.verify(token,'ABEL@2024');    
    const {id}=decodeToken;
   next();
 
}

module.exports={
userAuth
}